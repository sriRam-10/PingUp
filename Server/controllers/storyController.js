import fs from 'fs'
import Story from '../Models/Story.js';
import User from '../Models/User.js';
import imageKit from '../Configs/imageKit.js';
import { inngest } from '../Inngest/index.js';

//add story

export  const addUserStroy = async (req,res) => {
    try {
         const {userId}   = await req.auth();
         const { content, media_type , background_color }   = req.body;
         const media = req.file
         let media_url = '';

         // upload media to image kit

         if(media_type === 'image' || media_type === 'video'){
            const fileBuffer = fs.readFileSync(media.path)
            const response = await imageKit.upload({
                file : fileBuffer,
                filename : media.originalname,
            })
            media_url = response.url
         }
         // create story

         const story = await Story.create({
            user : userId,
            content,
            media_url,
            media_type,
            background_color
         })

         // schedule for the dleting story 
      await inngest.send({
        name : 'app/story-delete',
        data : {storyId : story._id}
      })

       res.json({ success:true }) 
        
    } catch (error) {
         console.log(error);
        res.json({success:false, message: error.mesage}) 
    }
}


//get user stories

export  const getStories = async (req,res) => {
    try {
        const {userId}   = await req.auth();
        const user = await User.findById(userId)

        // user connection and following

        const userIds = [userId, ...user.connections, ...user.following]

        const stories = await Story.find({
            user : {$in : userIds}
        }).populate('user').sort({createdAt : -1});

        res.json({ success:true , stories }) 
        
    } catch (error) {
         console.log(error);
        res.json({success:false, message: error.mesage}) 
    }
}


