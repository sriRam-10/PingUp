import express from 'express'
import { addUserStroy, getStories } from '../controllers/storyController.js';
import { upload } from '../Configs/multer.js';
import { protect } from '../middlewares/auth.js';


const storyRouter = express.Router();

storyRouter.post('/create', upload.single('media'),protect,addUserStroy);
storyRouter.get('/get',protect, getStories);


export default storyRouter;
