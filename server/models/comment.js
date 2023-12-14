import Model from './model.js';
import dbconnection from '../database/db.js';

class Comment extends Model{
    constructor() {
        super();
        this.dbconnection = dbconnection;
        this.table = "comments";
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
    
    async getAllByPostID(id) {
        let orderByClause = `
        ORDER BY (
            SELECT COUNT(*) FROM likes_comment
            WHERE likes_comment.comment_id = comments.id AND likes_comment.type = 'like'
        ) DESC
    `;
        const queryRequest = `SELECT * FROM ${this.table} WHERE postId = ${id} ${orderByClause};`;
        const [rows] = await this.dbconnection.query(queryRequest);
      
        if (rows.length > 0) {
            return rows;
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
                queryRequest = `INSERT INTO ${this.table} (${clues}) VALUES (${dataes});`;
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

    async deleteComment(id) {
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
}

export default new Comment();