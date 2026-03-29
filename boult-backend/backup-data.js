const fs = require('fs');
const path = require('path');

// Backup script to save orders, products, and users data
function backupData() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, 'backups', timestamp);
  
  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Files to backup
  const filesToBackup = [
    'data/orders.json',
    'data/products.json',
    'data/users.json'
  ];
  
  console.log(`📦 Creating backup at: ${backupDir}`);
  
  filesToBackup.forEach(file => {
    const sourcePath = path.join(__dirname, file);
    const fileName = path.basename(file);
    const destPath = path.join(backupDir, fileName);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Backed up: ${fileName}`);
    } else {
      console.log(`⚠️  File not found: ${fileName}`);
    }
  });
  
  console.log(`\n✅ Backup completed successfully!`);
  console.log(`📁 Location: ${backupDir}\n`);
}

// Run backup
backupData();
