const fetch = require('node-fetch');

async function testAdminLoginDirect() {
    console.log('🔧 Testing Admin Login Directly...\n');
    
    const backendUrl = 'http://localhost:5000';
    const credentials = { username: 'admin', password: 'admin123' };
    
    try {
        // Test backend health
        console.log('1. Testing backend health...');
        const healthResponse = await fetch(`${backendUrl}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Backend Status:', healthData.status);
        
        // Test admin login endpoint
        console.log('\n2. Testing admin login endpoint...');
        const loginResponse = await fetch(`${backendUrl}/api/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': 'http://localhost:3001'
            },
            body: JSON.stringify(credentials)
        });
        
        console.log('Response Status:', loginResponse.status);
        console.log('Response Headers:', Object.fromEntries(loginResponse.headers.entries()));
        
        const loginData = await loginResponse.json();
        console.log('Response Data:', JSON.stringify(loginData, null, 2));
        
        if (loginResponse.ok && loginData.success) {
            console.log('\n✅ ADMIN LOGIN WORKING!');
            console.log('User:', loginData.user.name);
            console.log('Role:', loginData.user.role);
        } else {
            console.log('\n❌ ADMIN LOGIN FAILED');
            console.log('Error:', loginData.error);
        }
        
        // Test CORS preflight
        console.log('\n3. Testing CORS preflight...');
        const optionsResponse = await fetch(`${backendUrl}/api/admin/login`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3001',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        });
        
        console.log('OPTIONS Status:', optionsResponse.status);
        console.log('CORS Headers:', {
            'Access-Control-Allow-Origin': optionsResponse.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': optionsResponse.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': optionsResponse.headers.get('Access-Control-Allow-Headers')
        });
        
    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testAdminLoginDirect();