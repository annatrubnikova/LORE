import Model from './model.js';
import dbconnection from '../database/db.js';

class Favorites extends Model{
    constructor() {
        super();
        this.dbconnection = dbconnection;
        this.table = "category_favorites";
    }

    async getAllByUsID(id, sortBy) {
        let orderByClause;

        if (sortBy === 'date') {
            orderByClause = 'ORDER BY publishDate DESC';
        } else {
            orderByClause = `
                ORDER BY (
                    SELECT COUNT(*) FROM likes_post
                    WHERE likes_post.post_id = category_favorites.post_id AND likes_post.type = 'like'
                ) DESC
            `;
        }
        const queryRequest = `SELECT posts.*
        FROM ${this.table}
        JOIN posts ON category_favorites.post_id = posts.id
        WHERE category_favorites.user_id = ${id}
        ${orderByClause};`;
        const [rows] = await this.dbconnection.query(queryRequest);
      
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    }

    async save(data, table = this.table) {
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

    async getById(postid, usid) {
        const queryRequest = `SELECT * FROM ${this.table} WHERE post_id = ${postid} AND user_id = ${usid};`;
        const [rows] = await this.dbconnection.query(queryRequest);
      
        if (rows.length > 0) {
            return rows[0]; 
        } else {
            return null;
        }
    }

    async delete(postid, usid) {
        const queryRequest = `DELETE FROM ${this.table} WHERE post_id = ${postid} AND user_id = ${usid};`;
        const [result] = await this.dbconnection.query(queryRequest);
        if (result.affectedRows > 0) {
            return true;
        } else {
            return false;
        }
    }
}

export default new Favorites();