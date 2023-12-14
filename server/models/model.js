import dbconnection from '../database/db.js';

class Model {
    constructor() {
        this.database = dbconnection;
    }
}
export default Model;