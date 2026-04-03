const fs = require('fs');
const path = require('path');

const basePath = 'C:\\Users\\rafae\\Documents\\Respositories\\travel-baggage-checker\\trip-manager-app';

const directories = [
  'public',
  'src\\types',
  'src\\context',
  'src\\hooks',
  'src\\utils',
  'src\\components',
  'src\\pages',
  'src\\styles'
];

console.log('Creating directories...\n');

directories.forEach((dir) => {
  const fullPath = path.join(basePath, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`✓ Created: ${fullPath}`);
});

console.log('\n✓ All directories created successfully!');
