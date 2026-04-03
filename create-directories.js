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
];

console.log('Creating directories...\n');

directories.forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`✓ Created: ${dir}`);
});

console.log('\n✓ All directories created successfully!');
