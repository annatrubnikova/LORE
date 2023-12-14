import multer from 'multer';
import path from 'path';

const storagePost = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, './assets/posts')
    },
    filename: (_req, file, cb)=>{
        cb(null, `${file.fieldname}_${Date.now()}${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`)
    }
});

const uploadPost = multer ({
    storage: storagePost
})

export default uploadPost;