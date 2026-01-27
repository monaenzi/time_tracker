# Contributing to Time Tracker

Thank you for your interest in contributing! This guide will help you understand our development workflow and how to submit changes.

## Development Workflow

We use a **Pull Request (PR) workflow** for all changes. This ensures code quality, enables code review, and maintains a clean project history.

## Getting Started

1. **Fork the repository** (if you don't have write access)
2. **Clone your fork** (or the main repo if you have access):
   ```bash
   git clone https://github.com/monaenzi/time_tracker.git
   cd time_tracker
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

## Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/add-export-functionality`)
- `fix/` - Bug fixes (e.g., `fix/timer-not-resetting`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/improve-api-structure`)
- `test/` - Test additions/updates (e.g., `test/add-integration-tests`)

## Making Changes

1. **Make your changes** following the project's coding style
2. **Write or update tests** for your changes
3. **Test locally**:
   ```bash
   npm test              # Run all tests
   npm run test:ui       # Run tests with UI
   npm run test:headed   # Run tests in headed mode
   ```
4. **Commit your changes** with clear, descriptive commit messages:
   ```bash
   git add .
   git commit -m "Add feature: description of what you did"
   ```

### Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Be specific and descriptive
- Reference issue numbers if applicable: "Fix #123: timer not resetting"

## Creating a Pull Request

1. **Push your branch** to the remote repository:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub:
   - Go to the repository on GitHub
   - Click "New Pull Request" or "Compare & pull request"
   - Select:
     - **Base branch**: `develop` (or `main` for hotfixes)
     - **Compare branch**: Your feature branch
   - Fill out the PR template with:
     - Description of changes
     - Related issue/user story
     - Testing performed
     - Screenshots (if applicable)

3. **Wait for CI/CD** to run:
   - GitHub Actions will automatically run tests
   - Make sure all tests pass (green checkmark)

4. **Request review** (if working in a team):
   - Assign reviewers
   - Address any feedback or requested changes

5. **After approval**, merge the PR:
   - Use "Merge commit" to preserve history
   - Or "Squash and merge" to combine commits
   - Delete the feature branch after merging

## PR Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] New tests added for new functionality
- [ ] Manual testing completed
- [ ] No console.logs or debug code left behind
- [ ] README updated (if needed)
- [ ] PR description is complete
- [ ] Related issue/user story is linked

## Code Review Process

1. **Automated checks** run first (CI/CD)
2. **Code review** by team members (if applicable)
3. **Address feedback** by pushing new commits to the same branch
4. **Approval** from reviewers
5. **Merge** by maintainer or after approval

## Testing Requirements

- All new features must include tests
- All tests must pass before merging
- Test coverage should be maintained or improved
- Manual testing should be performed in supported browsers

## Definition of Done

A PR is considered "Done" when:

- ✅ Feature is functional in all supported browsers
- ✅ All data input is validated on the client and server side
- ✅ Tests pass and coverage is maintained
- ✅ Code reviewed and approved (if applicable)
- ✅ Documentation updated (if needed)
- ✅ No breaking changes (or breaking changes documented)

## Getting Help

- Check existing issues and PRs
- Ask questions in issue comments
- Review the README for project setup

## Quick Reference

```bash
# Start development
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Make changes, then:
git add .
git commit -m "Description"
git push origin feature/my-feature

# After PR is merged:
git checkout develop
git pull origin develop
git branch -d feature/my-feature  # Delete local branch
```

Thank you for contributing! 🎉
