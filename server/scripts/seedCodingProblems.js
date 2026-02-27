const axios = require('axios');

async function seed() {
    try {
        console.log('Seeding Coding Problems...');
        // Assuming server is running on localhost:5000 from default config 
        // If not, this might fail, but it's a dev script.
        const response = await axios.post('http://localhost:5000/api/coding-problems/seed');
        console.log('Response:', response.data);
    } catch (err) {
        console.error('Error seeding:', err.message);
    }
}

seed();
