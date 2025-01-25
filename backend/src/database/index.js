import mysql from "mysql2"
import dotenv from "dotenv"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../../../.env');
dotenv.config({ path: envPath });

export const startDbConnection = () => {
    db.connect(error => {
        if (error) {
            console.error(error);
            return;
        }
        console.log("db connection success! thread_id: " + db.threadId);
    });
}
export const endDbConnection = () => {
    db.end();
}

export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


