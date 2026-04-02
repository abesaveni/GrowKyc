// Script to fix ComprehensiveClientForm.tsx by removing corrupted lines 996-1244
const fs = require('fs');

const filePath = './src/app/components/kyc/ComprehensiveClientForm.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log(`Total lines: ${lines.length}`);
console.log(`Removing lines 996-1244 (corrupted duplicate renderAddressStep)`);

// Remove lines 996-1244 (0-indexed: 995-1243)
const fixedLines = [
  ...lines.slice(0, 995),  // Keep lines 1-995
  ...lines.slice(1244)      // Keep lines 1245+
];

const fixedContent = fixedLines.join('\n');
fs.writeFileSync(filePath, fixedContent, 'utf8');

console.log(`Fixed! New total lines: ${fixedLines.length}`);
console.log(`Removed ${lines.length - fixedLines.length} lines`);
