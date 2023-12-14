import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, './assets/avatars')
    },
    filename: (_req, file, cb)=>{
        cb(null, `${file.fieldname}_${Date.now()}${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`)
    }
});

const uploadAv = multer ({
    storage: storage
})

export default uploadAv;