#!/usr/bin/env python3
"""
Script to import user stories from CSV file into GitHub issues.
Requires GitHub CLI (gh) to be installed and authenticated.
"""

import csv
import subprocess
import sys
import os


def parse_csv(filename):
    """Parse the CSV file and return a list of user stories."""
    user_stories = []
    
    with open(filename, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            user_stories.append(row)
    
    return user_stories


def format_issue_body(story):
    """Format the issue body with additional metadata."""
    body = story['Body']
    
    # Add Sprint and Priority metadata at the end
    body += f"\n\n---\n\n**Sprint:** {story['Sprint']}\n"
    body += f"**Priority:** {story['Priority']}\n"
    
    return body


def create_issue(story, dry_run=False):
    """Create a GitHub issue using the gh CLI."""
    title = story['Title']
    body = format_issue_body(story)
    labels = story['Labels']
    
    # Add Sprint and Priority as labels too
    sprint_label = story['Sprint'].replace(' ', '-').lower()
    priority_label = story['Priority'].lower()
    all_labels = f"{labels},{sprint_label},{priority_label}"
    
    cmd = [
        'gh', 'issue', 'create',
        '--title', title,
        '--body', body,
        '--label', all_labels
    ]
    
    if dry_run:
        print(f"\n{'='*80}")
        print(f"TITLE: {title}")
        print(f"LABELS: {all_labels}")
        print(f"BODY:\n{body}")
        print(f"{'='*80}\n")
        return True
    else:
        try:
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            issue_url = result.stdout.strip()
            print(f"✓ Created issue: {title}")
            print(f"  URL: {issue_url}")
            return True
        except subprocess.CalledProcessError as e:
            print(f"✗ Failed to create issue: {title}")
            print(f"  Error: {e.stderr}")
            return False


def main():
    """Main function to import user stories."""
    csv_file = 'user-stories.csv'
    
    # Check if CSV file exists
    if not os.path.exists(csv_file):
        print(f"Error: {csv_file} not found!")
        sys.exit(1)
    
    # Parse command line arguments
    dry_run = '--dry-run' in sys.argv
    
    if dry_run:
        print("DRY RUN MODE - No issues will be created\n")
    
    # Parse CSV
    print(f"Reading user stories from {csv_file}...")
    user_stories = parse_csv(csv_file)
    print(f"Found {len(user_stories)} user stories\n")
    
    # Create issues
    success_count = 0
    fail_count = 0
    
    for i, story in enumerate(user_stories, 1):
        print(f"[{i}/{len(user_stories)}] Processing: {story['Title']}")
        
        if create_issue(story, dry_run):
            success_count += 1
        else:
            fail_count += 1
    
    # Summary
    print(f"\n{'='*80}")
    print(f"Import completed!")
    print(f"  Success: {success_count}")
    print(f"  Failed:  {fail_count}")
    print(f"{'='*80}")
    
    if fail_count > 0:
        sys.exit(1)


if __name__ == '__main__':
    main()
