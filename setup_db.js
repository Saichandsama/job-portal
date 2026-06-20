const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');

async function setupDatabase() {
    try {
        console.log('Connecting to MySQL to create database...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`Database ${process.env.DB_NAME} created or already exists.`);
        
        await connection.changeUser({database: process.env.DB_NAME});
        
        const initSql = fs.readFileSync('init.sql', 'utf8');
        const statements = initSql.split(';').filter(stmt => stmt.trim() !== '');
        
        for (let stmt of statements) {
            await connection.query(stmt);
        }
        
        console.log('Database tables initialized successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase();
