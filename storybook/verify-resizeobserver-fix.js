#!/usr/bin/env node

/**
 * ResizeObserver Fix Verification Script
 * 
 * This script verifies that all components of the ResizeObserver fix are in place
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying ResizeObserver Fix Implementation...\n');

const checks = [];

// Check 1: preview-head.html exists and contains the fix
const previewHeadPath = path.join(__dirname, '.storybook', 'preview-head.html');
if (fs.existsSync(previewHeadPath)) {
  const content = fs.readFileSync(previewHeadPath, 'utf8');
  if (content.includes('ResizeObserver') && content.includes('SafeResizeObserver')) {
    checks.push({ name: 'Layer 1: preview-head.html', status: '✅', details: 'HTML injection fix found' });
  } else {
    checks.push({ name: 'Layer 1: preview-head.html', status: '⚠️', details: 'File exists but fix may be incomplete' });
  }
} else {
  checks.push({ name: 'Layer 1: preview-head.html', status: '❌', details: 'File not found' });
}

// Check 2: main.js contains fix
const mainJsPath = path.join(__dirname, '.storybook', 'main.js');
if (fs.existsSync(mainJsPath)) {
  const content = fs.readFileSync(mainJsPath, 'utf8');
  if (content.includes('ResizeObserver') || content.includes('isRO')) {
    checks.push({ name: 'Layer 2: main.js', status: '✅', details: 'Manager frame protection found' });
  } else {
    checks.push({ name: 'Layer 2: main.js', status: '⚠️', details: 'File exists but fix may be incomplete' });
  }
} else {
  checks.push({ name: 'Layer 2: main.js', status: '❌', details: 'File not found' });
}

// Check 3: Utility files exist
const utilFiles = [
  'src/utils/universalErrorSuppression.ts',
  'src/utils/nuclearResizeObserverFix.ts',
  'src/utils/resizeObserverFix.ts'
];

utilFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    checks.push({ name: `Layer 3: ${path.basename(file)}`, status: '✅', details: 'Utility file found' });
  } else {
    checks.push({ name: `Layer 3: ${path.basename(file)}`, status: '❌', details: 'File not found' });
  }
});

// Check 4: ResizeObserverErrorBoundary component
const errorBoundaryPath = path.join(__dirname, 'src/components/ResizeObserverErrorBoundary.tsx');
if (fs.existsSync(errorBoundaryPath)) {
  checks.push({ name: 'Layer 4: ResizeObserverErrorBoundary', status: '✅', details: 'Error boundary component found' });
} else {
  checks.push({ name: 'Layer 4: ResizeObserverErrorBoundary', status: '❌', details: 'Component not found' });
}

// Check 5: ChartWrapper component
const chartWrapperPath = path.join(__dirname, 'src/components/ChartWrapper.tsx');
if (fs.existsSync(chartWrapperPath)) {
  checks.push({ name: 'Layer 5: ChartWrapper', status: '✅', details: 'Chart wrapper component found' });
} else {
  checks.push({ name: 'Layer 5: ChartWrapper', status: '❌', details: 'Component not found' });
}

// Check 6: preview.tsx imports the fixes
const previewPath = path.join(__dirname, '.storybook', 'preview.tsx');
if (fs.existsSync(previewPath)) {
  const content = fs.readFileSync(previewPath, 'utf8');
  const hasImports = content.includes('universalErrorSuppression') && 
                     content.includes('nuclearResizeObserverFix') &&
                     content.includes('ResizeObserverErrorBoundary');
  if (hasImports) {
    checks.push({ name: 'Configuration: preview.tsx', status: '✅', details: 'All imports present' });
  } else {
    checks.push({ name: 'Configuration: preview.tsx', status: '⚠️', details: 'Some imports may be missing' });
  }
} else {
  checks.push({ name: 'Configuration: preview.tsx', status: '❌', details: 'File not found' });
}

// Print results
console.log('📊 Verification Results:\n');
checks.forEach(check => {
  console.log(`${check.status} ${check.name}`);
  console.log(`   ${check.details}\n`);
});

// Summary
const totalChecks = checks.length;
const passedChecks = checks.filter(c => c.status === '✅').length;
const warnedChecks = checks.filter(c => c.status === '⚠️').length;
const failedChecks = checks.filter(c => c.status === '❌').length;

console.log('\n📈 Summary:');
console.log(`   Total Checks: ${totalChecks}`);
console.log(`   ✅ Passed: ${passedChecks}`);
console.log(`   ⚠️  Warnings: ${warnedChecks}`);
console.log(`   ❌ Failed: ${failedChecks}\n`);

if (failedChecks === 0 && warnedChecks === 0) {
  console.log('🎉 All ResizeObserver fix layers are properly configured!\n');
  console.log('📝 Next Steps:');
  console.log('   1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)');
  console.log('   2. Hard refresh Storybook (Ctrl+Shift+R or Cmd+Shift+R)');
  console.log('   3. Open browser console (F12)');
  console.log('   4. Navigate to any chart story');
  console.log('   5. Verify NO ResizeObserver errors appear\n');
} else {
  console.log('⚠️  Some fix components are missing or incomplete.');
  console.log('📝 Recommended Actions:');
  console.log('   1. Review the failed/warned items above');
  console.log('   2. Check RESIZE_OBSERVER_FIX.md for complete documentation');
  console.log('   3. Re-run this script after making corrections\n');
}

process.exit(failedChecks > 0 ? 1 : 0);
