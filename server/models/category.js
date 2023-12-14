import Model from './model.js';
import dbconnection from '../database/db.js';

class Category extends Model{
    constructor() {
        super();
        this.table = "categories";
        this.tablePostCat = "posts_categories"
        this.dbconnection = dbconnection;
    }

    async getAll() {
        const queryRequest = `SELECT * FROM ${this.table};`;
        const [rows] = await this.dbconnection.query(queryRequest);
      
        if (rows.length > 0) {
            return rows;
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

    async getNamesById(rows){
        if (rows.length <= 0) return null; 
        const categoryIds = rows.map(row => row.category_id);
        const categoryNames = [];

        for (const categoryId of categoryIds) {
            const categoryQuery = `SELECT title FROM ${this.table} WHERE id = ${categoryId};`;
            const [categoryRows] = await this.dbconnection.query(categoryQuery);
            if (categoryRows.length > 0) {
                categoryNames.push(categoryRows[0].title);
            }
        }
        return categoryNames;
        
    }

    async getCatByIds(categoryIds){
        if (categoryIds.length <= 0) return null; 
        const categoryNames = [];

        for (const categoryId of categoryIds) {
            const categoryQuery = `SELECT * FROM ${this.table} WHERE id = ${categoryId};`;
            const [categoryRows] = await this.dbconnection.query(categoryQuery);
            if (categoryRows.length > 0) {
                categoryNames.push(categoryRows[0]);
            }
        }
        return categoryNames;
        
    }

    async getByName(name){
        const queryRequest = `SELECT * FROM ${this.table} WHERE title = "${name}";`;
        const [rows] = await this.dbconnection.query(queryRequest);
      
        if (rows.length > 0) {
            return rows[0]; 
        } else {
            return null;
        }
    }

    async deleteAllByPostId(id){
        if (!id) {
            return false;
        }
        const queryRequest = `DELETE FROM ${this.tablePostCat} WHERE post_id=${id};`;
        const [result] = await this.dbconnection.query(queryRequest);
        if (result.affectedRows > 0) {
            return true;
        } else {
            return false;
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

    async delete(id) {
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

export default new Category();