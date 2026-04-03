const fs = require('fs');

const dirs = [
  'C:\\Users\\rafae\\Documents\\Respositories\\travel-baggage-checker\\trip-manager-app\\src',
  'C:\\Users\\rafae\\Documents\\Respositories\\travel-baggage-checker\\trip-manager-app\\public'
];

dirs.forEach(dir => {
  try {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created: ${dir}`);
  } catch (e) {
    console.error(`✗ Error creating ${dir}: ${e.message}`);
  }
});

// Verify
console.log('\nVerifying directories:');
dirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  console.log(`${exists ? '✓' : '✗'} ${dir}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
});
