import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connnectDB from './Configs/db.js'
import { inngest,functions } from './Inngest/index.js'
import { serve } from "inngest/express";
import {clerkMiddleware} from '@clerk/express'
import userRouter from './routes/userRoutes.js'
import postRouter from './routes/postRoutes.js'
import storyRouter from './routes/storyRoutes.js'
import messageRouter from './routes/messageRoutes.js'

//import connectDb from './Configs/Db.js'

const app = express();

 await connnectDB()

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get('/', (req, res) => res.send('server is running'));
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/user',userRouter)
app.use('/api/post',postRouter)
app.use('/api/story',storyRouter)
app.use('/api/message',messageRouter)


const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>console.log(`server is running on ${PORT}`))
 // console.log(process.env.MONGO_URI)