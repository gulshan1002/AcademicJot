const {Client} = require("pg");

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: true
});

// Function to connect to the database
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');
    } 
    catch (error) {
        console.error('Error connecting to database:', error);
    }
}
connectToDatabase();
module.exports = client;