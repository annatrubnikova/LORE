import Model from './model.js';
import dbconnection from '../database/db.js';

class Like extends Model{
    constructor() {
        super();
        this.dbconnection = dbconnection;
    }

    async save(data, table) {
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
        try {
            if (!data.id) {
                queryRequest = `INSERT INTO ${table} (${clues.join(', ')}) VALUES (${dataes.join(', ')});`;
            } else {
                queryRequest = `UPDATE ${table} SET ${renew.join(', ')} WHERE id=${data.id};`;
            }
    
            const [result] = await this.dbconnection.query(queryRequest);
    
            if (result.insertId) {
                const selectQuery = `SELECT * FROM ${table} WHERE id=${result.insertId};`;
                const [createdRecord] = await this.dbconnection.query(selectQuery);
    
                return createdRecord[0];
            } else {
                return data;
            }
        } catch (error) {
            console.error("Error in save:", error);
            return null;
        }
    }

    async getById(id, table, usid) {
        let compost;
        if (table == "likes_post") compost = "post_id";
        else compost = "comment_id";
        const queryRequest = `SELECT * FROM ${table} WHERE ${compost} = ${id} AND author_id = ${usid};`;
        const [rows] = await this.dbconnection.query(queryRequest);
      
        if (rows.length > 0) {
            return rows[0]; 
        } else {
            return null;
        }
    }

    async getByIdForDel(id, table, usid, type) {
        let compost;
        if (table == "likes_post") compost = "post_id";
        else compost = "comment_id";
        const queryRequest = `SELECT * FROM ${table} WHERE ${compost} = ${id} AND author_id = ${usid} AND type = "${type}";`;
        const [rows] = await this.dbconnection.query(queryRequest);
      
        if (rows.length > 0) {
            return rows[0]; 
        } else {
            return null;
        }
    }

    async getAllLikesById(id, table, from) {
        const queryRequest = `SELECT * FROM ${table} WHERE ${from} =${id};`;
        const [rows] = await this.dbconnection.query(queryRequest);
      
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    }

    async deleteById(id, table) {
        if (!id || !table) {
            return false;
        }
        const queryRequest = `DELETE FROM ${table} WHERE id=${id};`;
        const [result] = await this.dbconnection.query(queryRequest);
        if (result.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    }
}

export default new Like();