import Model from './model.js';
import dbconnection from '../database/db.js';
import Category from '../models/category.js';


class Post extends Model {
    constructor() {
        super();
        this.table = 'posts';
        this.dbconnection = dbconnection;
        this.tablePostCat = 'posts_categories'
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

    async getAllPaginated(offset, pageSize, sortBy, filterOptions = {}) {
        let orderByClause;

        if (sortBy === 'date') {
            orderByClause = 'ORDER BY publishDate DESC';
        } else {
            orderByClause = `
                ORDER BY (
                    SELECT COUNT(*) FROM likes_post
                    WHERE likes_post.post_id = posts.id AND likes_post.type = 'like'
                ) DESC
            `;
        }

        const { categories, startDate, endDate, status } = filterOptions;
        const whereConditions = [];

        if (categories && categories.length > 0) {
            whereConditions.push(`posts.category = ?`);
        }

        if (startDate) {
            whereConditions.push('posts.publishDate >= ?');
        }

        if (endDate) {
            whereConditions.push('posts.publishDate <= ?');
        }

        if (status) {
            whereConditions.push('posts.status = ?');
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';


        const queryRequest = `
            SELECT * FROM ${this.table}
            ${whereClause}
            ${orderByClause}
            LIMIT ${pageSize} OFFSET ${offset};
        `;


        const queryParams = [];

        if (categories) {
            queryParams.push(...categories);
        }

        if (startDate) {
            queryParams.push(startDate);
        }

        if (endDate) {
            queryParams.push(endDate);
        }

        if (status) {
            queryParams.push(status);
        }

        queryParams.push(pageSize, offset);

        const [rows] = await this.dbconnection.query(queryRequest, queryParams);
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    }

    async getById(id) {
        const queryRequest = `SELECT * FROM ${this.table} WHERE id = ${id};`;
        const [rows] = await this.dbconnection.query(queryRequest);
      
        if (rows.length > 0) {
            return rows[0]; 
        } else {
            return null;
        }
    }

    async getByUser(id, sortBy) {
        let orderByClause;
        
        if (sortBy === 'date') {
            orderByClause = 'ORDER BY publishDate DESC';
        } else {
            orderByClause = `
                ORDER BY (
                    SELECT COUNT(*) FROM likes_post
                    WHERE likes_post.post_id = posts.id AND likes_post.type = 'like'
                ) DESC
            `;
        }

        const queryRequest = `SELECT * FROM ${this.table} WHERE author_id = ${id} ${orderByClause};`;
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

    async getAllCategoriesByIdPost(postId){
        const queryRequest = `SELECT category_id FROM ${this.tablePostCat} WHERE post_id = ${postId};`;
        const [rows] = await this.dbconnection.query(queryRequest);
        if (rows) {
            return rows; 
        } else {
            return null;
        }
    }

    async getNamesById(rows, orderByClause=''){
        if (rows.length <= 0) return null; 
        const postIds = rows.map(row => row.post_id);
        const postNames = [];

        for (const postId of postIds) {
            const categoryQuery = `SELECT * FROM ${this.table} WHERE id = ${postId};`;
            const [categoryRows] = await this.dbconnection.query(categoryQuery);
            if (categoryRows.length > 0) {
                postNames.push(categoryRows[0]);
            }
        }
        return postNames;
        
    }

    async getAllByIdCat(catId, sortBy){
        let orderByClause;
        
        if (sortBy === 'date') {
            orderByClause = 'ORDER BY publishDate DESC';
        } else {
            orderByClause = `
                ORDER BY (
                    SELECT COUNT(*) FROM likes_post
                    WHERE likes_post.post_id = posts.id AND likes_post.type = 'like'
                ) DESC
            `;
        }

        const queryRequest = `SELECT post_id FROM ${this.tablePostCat} WHERE category_id = ${catId};`;
        const [rows] = await this.dbconnection.query(queryRequest);
        
        const result = await this.getNamesById(rows, orderByClause);
        if (result) {
            return result; 
        } else {
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

export default new Post();