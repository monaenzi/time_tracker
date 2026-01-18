#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the test results JSON file
const jsonPath = path.join(__dirname, '..', 'test-results', 'test-results.json');
const outputPath = path.join(__dirname, '..', 'test-results', 'test-results.md');

if (!fs.existsSync(jsonPath)) {
  console.error('Error: test-results.json not found at', jsonPath);
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Helper function to format duration
function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

// Generate markdown content
let md = `# Test Results Report\n\n`;
md += `**Generated:** ${formatDate(new Date())}\n\n`;

// Summary section
md += `## Summary\n\n`;
md += `| Metric | Value |\n`;
md += `|--------|-------|\n`;
md += `| Total Tests | ${results.stats.expected + results.stats.unexpected} |\n`;
md += `| ✅ Passed | ${results.stats.expected} |\n`;
md += `| ❌ Failed | ${results.stats.unexpected} |\n`;
md += `| ⏭️  Skipped | ${results.stats.skipped} |\n`;
md += `| 🔄 Flaky | ${results.stats.flaky} |\n`;
md += `| ⏱️  Duration | ${formatDuration(results.stats.duration)} |\n`;
md += `| 🕐 Start Time | ${formatDate(results.stats.startTime)} |\n\n`;

// Configuration section
md += `## Configuration\n\n`;
md += `- **Playwright Version:** ${results.config.version}\n`;
md += `- **Test Directory:** ${results.config.rootDir}\n`;
md += `- **Workers:** ${results.config.workers}\n`;
md += `- **Timeout:** ${results.config.projects[0].timeout}ms\n`;
if (results.config.webServer) {
  md += `- **Web Server:** ${results.config.webServer.command}\n`;
  md += `- **Base URL:** ${results.config.webServer.url}\n`;
}
md += `\n`;

// Test details section
md += `## Test Details\n\n`;

function processSuite(suite, depth = 0) {
  let content = '';
  const indent = '  '.repeat(depth);
  
  if (suite.title && suite.title !== suite.file) {
    content += `${indent}### ${suite.title}\n\n`;
  }
  
  if (suite.specs && suite.specs.length > 0) {
    suite.specs.forEach(spec => {
      const status = spec.ok ? '✅' : '❌';
      const test = spec.tests[0];
      const result = test.results[0];
      const duration = formatDuration(result.duration);
      
      content += `${indent}#### ${status} ${spec.title}\n\n`;
      content += `${indent}- **File:** \`${spec.file}\` (line ${spec.line})\n`;
      content += `${indent}- **Status:** ${result.status}\n`;
      content += `${indent}- **Duration:** ${duration}\n`;
      content += `${indent}- **Browser:** ${test.projectName}\n`;
      
      if (result.errors && result.errors.length > 0) {
        content += `${indent}- **Errors:**\n\n`;
        result.errors.forEach((error, idx) => {
          content += `${indent}  \`\`\`\n`;
          content += `${indent}  ${error.message || error}\n`;
          if (error.stack) {
            content += `${indent}  ${error.stack}\n`;
          }
          content += `${indent}  \`\`\`\n\n`;
        });
      }
      
      content += `\n`;
    });
  }
  
  if (suite.suites && suite.suites.length > 0) {
    suite.suites.forEach(subSuite => {
      content += processSuite(subSuite, depth + 1);
    });
  }
  
  return content;
}

results.suites.forEach(suite => {
  md += processSuite(suite);
});

// Errors section (if any)
if (results.errors && results.errors.length > 0) {
  md += `## Errors\n\n`;
  results.errors.forEach((error, idx) => {
    md += `### Error ${idx + 1}\n\n`;
    md += `\`\`\`\n${JSON.stringify(error, null, 2)}\n\`\`\`\n\n`;
  });
}

// Footer
md += `---\n\n`;
md += `*This report was automatically generated from test-results.json*\n`;

// Write the markdown file
fs.writeFileSync(outputPath, md, 'utf8');
console.log(`✅ Test results markdown generated: ${outputPath}`);
