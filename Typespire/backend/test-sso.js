const jwt = require('jsonwebtoken');

const SSO_SECRET = 'typespire_sso_secret_key_12345';
const BACKEND_URL = 'http://localhost:3000/api/v1';

async function testSSO() {
    console.log('Testing SSO Integration...');

    // 1. Generate Token
    const payload = {
        email: 'test_sso_student@example.com',
        firstName: 'Test',
        lastName: 'Student',
        role: 'STUDENT',
        institutionId: null,
    };

    const token = jwt.sign(payload, SSO_SECRET, { expiresIn: '1h' });
    console.log('Generated Token:', token);

    // 2. Call Endpoint
    try {
        const response = await fetch(`${BACKEND_URL}/auth/sso?token=${token}`);
        const data = await response.json();

        if (response.ok) {
            console.log('SSO Login Successful!');
            console.log('Response:', data);
        } else {
            console.error('SSO Login Failed:', data);
        }
    } catch (error) {
        console.error('SSO Login Error:', error.message);
    }
}

testSSO();
