// Startup Check - Runs before server starts
// Ensures orders are never lost

const fs = require('fs');
const path = require('path');

const ordersFile = path.join(__dirname, 'data', 'orders.json');
const backupDir = path.join(__dirname, 'data', 'backups', 'orders');

console.log('🔍 Running startup check...\n');

// Ensure directories exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
  console.log('✅ Created data directory');
}

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log('✅ Created backup directory');
}

// Check if orders file exists
if (!fs.existsSync(ordersFile)) {
  console.log('⚠️  Orders file not found! Attempting recovery...\n');
  
  // Try to recover from backups
  if (fs.existsSync(backupDir)) {
    const backupFiles = fs.readdirSync(backupDir)
      .filter(f => f.endsWith('.json'))
      .map(f => ({
        name: f,
        path: path.join(backupDir, f),
        mtime: fs.statSync(path.join(backupDir, f)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime);
    
    if (backupFiles.length > 0) {
      const latestBackup = backupFiles[0];
      console.log(`📦 Found backup: ${latestBackup.name}`);
      
      try {
        const backupData = fs.readFileSync(latestBackup.path, 'utf-8');
        const orders = JSON.parse(backupData);
        
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
        console.log(`✅ Recovered ${orders.length} orders from backup!`);
        console.log('🎉 Orders restored successfully!\n');
      } catch (error) {
        console.error('❌ Failed to recover from backup:', error.message);
        // Create empty file
        fs.writeFileSync(ordersFile, '[]');
        console.log('✅ Created new empty orders file\n');
      }
    } else {
      // No backups, create empty file
      fs.writeFileSync(ordersFile, '[]');
      console.log('✅ Created new empty orders file\n');
    }
  } else {
    // No backup directory, create empty file
    fs.writeFileSync(ordersFile, '[]');
    console.log('✅ Created new empty orders file\n');
  }
} else {
  // Orders file exists, check if it's valid
  try {
    const data = fs.readFileSync(ordersFile, 'utf-8');
    const orders = JSON.parse(data);
    console.log(`✅ Orders file OK (${orders.length} orders)\n`);
  } catch (error) {
    console.error('⚠️  Orders file corrupted! Attempting recovery...\n');
    
    // Try to recover from backups
    if (fs.existsSync(backupDir)) {
      const backupFiles = fs.readdirSync(backupDir)
        .filter(f => f.endsWith('.json'))
        .map(f => ({
          name: f,
          path: path.join(backupDir, f),
          mtime: fs.statSync(path.join(backupDir, f)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);
      
      if (backupFiles.length > 0) {
        const latestBackup = backupFiles[0];
        console.log(`📦 Found backup: ${latestBackup.name}`);
        
        try {
          const backupData = fs.readFileSync(latestBackup.path, 'utf-8');
          const orders = JSON.parse(backupData);
          
          fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
          console.log(`✅ Recovered ${orders.length} orders from backup!`);
          console.log('🎉 Orders restored successfully!\n');
        } catch (err) {
          console.error('❌ Failed to recover from backup:', err.message);
          fs.writeFileSync(ordersFile, '[]');
          console.log('✅ Created new empty orders file\n');
        }
      } else {
        fs.writeFileSync(ordersFile, '[]');
        console.log('✅ Created new empty orders file\n');
      }
    } else {
      fs.writeFileSync(ordersFile, '[]');
      console.log('✅ Created new empty orders file\n');
    }
  }
}

console.log('✅ Startup check complete!\n');
