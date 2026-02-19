import  fs  from "fs";
import imageKit from '../Configs/imageKit.js';
import Post from "../Models/Post.js";
import User from "../Models/User.js";

// creting a new post
     export  const addPost = async (req,res) => {
      try {
        const {userId}   = await req.auth();
         const { content , post_type }   = req.body;
         const images = req.files

         let image_urls = []

         if(images.length ){
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path)

                     const response = await imageKit.upload({
                            file : fileBuffer,
                            filename : image.originalname,
                            folder : "posts"
                        })
                       
                        const url = imageKit.url({
                            path: response.filepath,
                            transformation :[
                               {quality : 'auto'},
                               {format : 'webp'},
                               {width : '1280'},
                            ]
                        })
                        return url
                })
            )
        }
           await  Post.create({
            user : userId,
            content,
            image_urls,
            post_type
           })
         res.json({success:true, message: "Post created succesfully"})
        }
      
       catch (error) {
        console.log(error);
        res.json({success:false, message: error.mesage})
      }  

} 

//to get the fee posts

export  const getFeedPosts = async (req,res) => {
try {
     const {userId}   = await req.auth();
     const user =  await User.findById(userId)

        //user connection and following
   
    const userIds = [userId, ...user.connections, ...userser.following]
    const posts = await Post.find({user : {$in:userIds}}).populate('user').sort({createdAt : -1})
     res.json({success:true, posts})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.mesage})
    }
}

//like posts 

export  const likePost = async (req,res) => {
   try {
         const {userId}   = await req.auth();
         const {postId}   = req.body;

         const post = await Post.findById(postId)
         if(post.likes_count.includes(userId)){
            post.likes_count = post.likes_count.filter(user => user !== userId)
             await post.save();
            res.json({success:true, message: "Post unliked"})
            
         }
         else{
             post.likes_count.push(userId);
             await post.save()
             res.json({success:true, message: "Post liked"})
         }


    
   } catch (error) {
     console.log(error);
        res.json({success:false, message: error.mesage})
   }

}