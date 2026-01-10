async function test() {
    try {
        console.log('Logging in...');
        const loginRes = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'kalisa@smartcuruza.com',
                password: 'password123',
            }),
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.access_token;
        console.log('Login successful. Token obtained.');

        console.log('Fetching current shift...');
        const shiftRes = await fetch('http://localhost:3001/merchants/shifts/current', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!shiftRes.ok) {
            throw new Error(`Shift fetch failed: ${shiftRes.statusText}`);
        }

        const text = await shiftRes.text();
        console.log('Current shift response text:', text);

        if (text) {
            const shiftData = JSON.parse(text);
            console.log('Current shift response JSON:', shiftData);
        } else {
            console.log('Response body is empty.');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

test();
