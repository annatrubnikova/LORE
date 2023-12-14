import mysql from 'mysql2/promise';
import config from '../config.js'

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('The connection to the database was successful');
        connection.release();
    } catch (error) {
        console.error('An error occurred while connecting to the database', error);
    }
})();

export default pool;
