// Order Recovery Script
// Run this if orders get deleted: node recover-orders.js

const fs = require('fs');
const path = require('path');

const backupDir = path.join(__dirname, 'backups', 'orders');
const ordersFile = path.join(__dirname, 'data', 'orders.json');

console.log('🔍 Searching for order backups...\n');

if (!fs.existsSync(backupDir)) {
  console.log('❌ No backup directory found!');
  process.exit(1);
}

// Get all backup files
const backupFiles = fs.readdirSync(backupDir)
  .filter(f => f.endsWith('.json'))
  .map(f => ({
    name: f,
    path: path.join(backupDir, f),
    mtime: fs.statSync(path.join(backupDir, f)).mtime
  }))
  .sort((a, b) => b.mtime - a.mtime); // Sort by newest first

if (backupFiles.length === 0) {
  console.log('❌ No backup files found!');
  process.exit(1);
}

console.log(`✅ Found ${backupFiles.length} backup files:\n`);

// Show available backups
backupFiles.slice(0, 10).forEach((file, idx) => {
  console.log(`${idx + 1}. ${file.name}`);
  console.log(`   Modified: ${file.mtime.toLocaleString()}`);
  console.log('');
});

// Use latest backup
const latestBackup = backupFiles[0];
console.log(`\n📦 Using latest backup: ${latestBackup.name}`);

try {
  const backupData = fs.readFileSync(latestBackup.path, 'utf-8');
  const orders = JSON.parse(backupData);
  
  console.log(`\n✅ Found ${orders.length} orders in backup`);
  
  // Show order IDs
  if (orders.length > 0) {
    console.log('\nOrder IDs:');
    orders.forEach(order => {
      console.log(`  - ${order.id} (${order.customer}, ₹${order.amount})`);
    });
  }
  
  // Restore to main file
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  console.log(`\n✅ Orders restored to: ${ordersFile}`);
  console.log('\n🎉 Recovery complete!');
  
} catch (error) {
  console.error('❌ Error recovering orders:', error.message);
  process.exit(1);
}
