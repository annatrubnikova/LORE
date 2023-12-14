import Model from './model.js';
import dbconnection from '../database/db.js';

class User extends Model {
    constructor() {
        super();
        this.table = 'users';
        this.dbconnection = dbconnection;
    }
    
    async getByLogin(login) {
        const queryRequest = `SELECT * FROM ${this.table} WHERE login = "${login}";`;
        const [rows] = await this.dbconnection.query(queryRequest);
    
        if (rows.length > 0) {
            return rows[0]; 
        } else {
            return null;
        }
    }

    async getByEmail(email) {
        const queryRequest = `SELECT * FROM ${this.table} WHERE email = "${email}";`;
        const [rows] = await this.dbconnection.query(queryRequest);
      
        if (rows.length > 0) {
            return rows[0]; 
        } else {
            return null;
        }
    }

    async getById(id) {
        const queryRequest = `SELECT * FROM ${this.table} WHERE id = "${id}";`;
        const [rows] = await this.dbconnection.query(queryRequest);
      
        if (rows.length > 0) {
            return rows[0]; 
        } else {
            return null;
        }
    }

    async save(data) {
        const dataes = [];
        const renew = [];
        const clues = [];
        let queryRequest;

        for (const arg in data) {
            if (arg !== 'id') {
            clues.push(arg);
            dataes.push(`'${data[arg]}'`);
            renew.push(`${arg}='${data[arg]}'`);
            }
        }
        try{
            if(!data.id) {
                queryRequest = `INSERT ${this.table} (${clues}) VALUES (${dataes});`;
            } else {
                queryRequest = "UPDATE " + this.table + " SET " + renew + " WHERE id=" + data.id + ';';
            }
            await this.dbconnection.query(queryRequest);
            return true;
        }
        catch {
            return false;
        }
    }

    async deleteUser(id) {
        if (!id) {
            return false;
        }
        const queryRequest = `DELETE FROM ${this.table} WHERE id=${id};`;
        const [result] = await this.dbconnection.query(queryRequest);
        if (result.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    }

    async getAll() {
        const queryRequest = `SELECT * FROM ${this.table} ORDER BY rating DESC;`;
        const [rows] = await this.dbconnection.query(queryRequest);
      
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    }
}

export default new User();