import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {router} from './routes/allModules.js';
import path from 'path';
const hostname = 'localhost';
const port = 5000;

const options ={
    origin:`http://${hostname}:3000`,
    credentials:true,            
    optionSuccessStatus:200
}

const app = express();

app.use(express.json());
app.use(cors(options))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api', router);
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(new URL(import.meta.url).pathname).substring(1);

app.use('/avatars', express.static(`${__dirname}/assets/avatars`));

app.use('/posts', express.static(`${__dirname}/assets/posts`));

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});