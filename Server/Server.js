import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connnectDB from './Configs/db.js'
import { inngest,functions } from './Inngest/index.js'
import { serve } from "inngest/express";

//import connectDb from './Configs/Db.js'

const app = express();

 await connnectDB()

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('server is running'));
app.use("/api/inngest", serve({ client: inngest, functions }));

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>console.log(`server is running on ${PORT}`))
 // console.log(process.env.MONGO_URI)