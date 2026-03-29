const fs = require('fs');
const path = require('path');

// Restore script to recover data from backup
function restoreData(backupTimestamp) {
  const backupDir = path.join(__dirname, 'backups', backupTimestamp);
  
  if (!fs.existsSync(backupDir)) {
    console.error(`❌ Backup not found: ${backupDir}`);
    console.log('\n📁 Available backups:');
    const backupsDir = path.join(__dirname, 'backups');
    if (fs.existsSync(backupsDir)) {
      const backups = fs.readdirSync(backupsDir);
      backups.forEach(backup => console.log(`  - ${backup}`));
    } else {
      console.log('  No backups found');
    }
    return;
  }
  
  console.log(`📦 Restoring from backup: ${backupTimestamp}\n`);
  
  const filesToRestore = ['orders.json', 'products.json', 'users.json'];
  
  filesToRestore.forEach(file => {
    const sourcePath = path.join(backupDir, file);
    const destPath = path.join(__dirname, 'data', file);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Restored: ${file}`);
    } else {
      console.log(`⚠️  File not found in backup: ${file}`);
    }
  });
  
  console.log(`\n✅ Restore completed successfully!\n`);
}

// Get backup timestamp from command line
const backupTimestamp = process.argv[2];

if (!backupTimestamp) {
  console.log('Usage: node restore-data.js <backup-timestamp>');
  console.log('\n📁 Available backups:');
  const backupsDir = path.join(__dirname, 'backups');
  if (fs.existsSync(backupsDir)) {
    const backups = fs.readdirSync(backupsDir);
    backups.forEach(backup => console.log(`  - ${backup}`));
  } else {
    console.log('  No backups found');
  }
} else {
  restoreData(backupTimestamp);
}
