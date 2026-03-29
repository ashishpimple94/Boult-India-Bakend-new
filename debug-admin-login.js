// Debug script for admin login - Run this in browser console at http://localhost:3001

console.log('🔧 Starting Admin Login Debug...');

async function testAdminLogin() {
    const backendUrl = 'http://localhost:5000';
    const credentials = { username: 'admin', password: 'admin123' };
    
    console.log('🔄 Testing admin login with:', credentials);
    console.log('🔄 Backend URL:', backendUrl);
    
    try {
        // Test 1: Health check
        console.log('\n1. Testing backend health...');
        const healthResponse = await fetch(`${backendUrl}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData);
        
        // Test 2: Admin login
        console.log('\n2. Testing admin login...');
        const loginResponse = await fetch(`${backendUrl}/api/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        console.log('📊 Login response status:', loginResponse.status);
        console.log('📊 Login response headers:', Object.fromEntries(loginResponse.headers.entries()));
        
        const loginData = await loginResponse.json();
        console.log('📊 Login response data:', loginData);
        
        if (loginResponse.ok && loginData.success) {
            console.log('✅ Admin login successful!');
            
            // Test localStorage
            localStorage.setItem('adminAuthUser', JSON.stringify(loginData.user));
            console.log('✅ User data saved to localStorage');
            
            // Check if data persists
            const storedUser = localStorage.getItem('adminAuthUser');
            console.log('📊 Stored user data:', JSON.parse(storedUser));
            
        } else {
            console.log('❌ Admin login failed:', loginData.error);
        }
        
    } catch (error) {
        console.error('❌ Error during test:', error);
    }
}

// Run the test
testAdminLogin();

// Also provide manual test functions
window.debugAdminLogin = testAdminLogin;
window.clearAdminAuth = () => {
    localStorage.removeItem('adminAuthUser');
    console.log('🗑️ Admin auth data cleared');
};

console.log('🎯 Debug functions available:');
console.log('  - debugAdminLogin() - Run login test');
console.log('  - clearAdminAuth() - Clear stored auth data');