import express from 'express'
import { protect } from '../middlewares/auth.js';
import { getChatMessages, sendMessage, sseController } from '../controllers/messageController.js';
import { upload } from '../Configs/multer.js';




const messageRouter = express.Router();

messageRouter.get('/:userId', sseController);
messageRouter.post('/send',upload.single('image'),protect,sendMessage );
messageRouter.post('/get',protect,getChatMessages );

export default messageRouter;