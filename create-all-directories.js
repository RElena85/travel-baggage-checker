const fs = require('fs');
const path = require('path');

const basePath = 'C:\\Users\\rafae\\Documents\\Respositories\\travel-baggage-checker\\trip-manager-app';

const directories = [
  path.join(basePath, 'public'),
  path.join(basePath, 'src', 'types'),
  path.join(basePath, 'src', 'context'),
  path.join(basePath, 'src', 'hooks'),
  path.join(basePath, 'src', 'utils'),
  path.join(basePath, 'src', 'components'),
  path.join(basePath, 'src', 'pages'),
  path.join(basePath, 'src', 'styles'),
  path.join(basePath, 'src', '__tests__'),
  path.join(basePath, 'e2e'),
];

console.log('Creating directories...\n');

directories.forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`✓ Created: ${dir}`);
});

console.log('\nVerifying directories...\n');
let allExist = true;
directories.forEach((dir) => {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    console.log(`✓ Verified: ${dir}`);
  } else {
    console.log(`✗ Missing: ${dir}`);
    allExist = false;
  }
});

if (allExist) {
  console.log('\n✓ All directories created and verified successfully!');
} else {
  console.log('\n✗ Some directories failed verification');
  process.exit(1);
}
