const API_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
  name: 'Test User',
  email: `test_${Date.now()}@example.com`,
  password: 'password123',
  username: `testuser_${Date.now()}`
};

async function testAuthFlow() {
  try {
    console.log('1. Registering user...');
    const registerRes = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER)
    });
    const registerData = await registerRes.json();
    if (!registerRes.ok) throw new Error(registerData.message);
    console.log('✅ Registered:', registerData.user.email);

    console.log('2. Logging in...');
    const loginRes1 = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password
      })
    });
    const loginData1 = await loginRes1.json();
    if (!loginRes1.ok) throw new Error(loginData1.message);
    console.log('✅ Login 1 Success. Token:', loginData1.token ? 'Present' : 'Missing');

    console.log('3. Simulating Logout (Client side action, nothing to do on server)');

    console.log('4. Logging in again...');
    const loginRes2 = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password
      })
    });
    const loginData2 = await loginRes2.json();
    if (!loginRes2.ok) throw new Error(loginData2.message);
    console.log('✅ Login 2 Success. Token:', loginData2.token ? 'Present' : 'Missing');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAuthFlow();
