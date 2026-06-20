const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let dbInstance = null;

const initDb = async () => {
    if (!dbInstance) {
        dbInstance = await open({
            filename: './database.sqlite',
            driver: sqlite3.Database
        });

        // Initialize schema
        await dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'candidate',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employer_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                location TEXT NOT NULL,
                salary TEXT NOT NULL,
                posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_id INTEGER NOT NULL,
                candidate_id INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
                FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE (job_id, candidate_id)
            );
        `);
    }
    return dbInstance;
};

const pool = {
    query: async (sql, params = []) => {
        const db = await initDb();
        
        // MySQL params are sometimes '?' in sqlite it works the same for basic usage
        // But sqlite doesn't return rows for run() and mysql does [result] where result.insertId is the id.
        if (sql.trim().toUpperCase().startsWith('INSERT') || sql.trim().toUpperCase().startsWith('UPDATE') || sql.trim().toUpperCase().startsWith('DELETE')) {
            const result = await db.run(sql, params);
            return [{ insertId: result.lastID }];
        } else {
            const rows = await db.all(sql, params);
            return [rows]; // Wrap in array to match MySQL [rows, fields]
        }
    }
};

module.exports = pool;
