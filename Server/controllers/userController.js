import imageKit from "../Configs/imageKit,js";
import User from "../Models/User.js";
import  fs from 'fs'


// get user data 

export const  getUserData = async (req,res) => {
    try {
        const {userId}   = await req.auth();
        const user = await User.findById(userId)
        if(!user){
            return res.json({success:false, message: "user not found"})
        }
          return res.json({success:true, user})


    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.mesage})
        
    }
}


//update the user data

export const  updateUserData= async (req,res) => {
    try {
        const {userId}   = await req.auth();
        const {username,bio,location,full_name} = req.body;

        const tempUser = await User.findById(userId);

        !username && (username= tempUser.username)

        if(tempUser.username !== username){
          const user = User.findOne({username})
         if(user){
            username = tempUser.username
         }
        }

    const updatedData = {
          username,
          bio,
          location,
          full_name
    }

    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];

   if(profile){
    const buffer = fs.readFileSync(profile.path)
    const response = await imageKit.upload({
        file : buffer,
        filename : profile.originalname,
    })
   
    const url = imageKit.url({
        path: response.filepath,
        transformation :[
           {quality : 'auto'},
           {format : 'webp'},
           {width : '512'},
        ]
    })
    updatedData.profile_picture = url
}

 if(cover){
    const buffer = fs.readFileSync(cover.path)
    const response = await imageKit.upload({
        file : buffer,
        filename : profile.originalname,
    })
   
    const url = imageKit.url({
        path: response.filepath,
        transformation :[
           {quality : 'auto'},
           {format : 'webp'},
           {width : '1280'},
        ]
    })
    updatedData.cover_photo = url
}

const user = await User.findByIdAndUpdate(userId,updatedData, {new :true})
    
     res.json({succes:true ,user, message: "profile Updated Successfully"})
 


    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.mesage})
        
    }
}

//find all file user username ,etc..

export const  discoverUsers = async (req,res) => {
    try {
        const {userId}   = await req.auth();
        const {input}   = req.body;

        const allusers = await User.find({
            $or :[
               {username : new RegExp(input , 'i')},
               {email : new RegExp(input , 'i')},
               {full_name : new RegExp(input , 'i')},
               {location : new RegExp(input , 'i')}
            ]
        })

        const filteredUsers = allusers.filter(user => user._id !== userId)
        res.json({success:true, users: filteredUsers})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.mesage})
        
    }
}

//follow user 

export const  followUser = async (req,res) => {
    try {
        const {userId}   = await req.auth();
        const { id }   = req.body;

     const user = await User.findById(userId);

    if(user.following.includes(id)){
        return  res.json({success:false, message:'you are already following this user'})

    }
    user.following.push(id);
    await user.save()

    const toUser = await User.findById(id)
    toUser.followers.push(userId);
    await toUser.save();
      
    return  res.json({success:true, message:'Now you are folloeing this user'})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.mesage})
        
    }
}


// unfollow user


export const  unfollowUser = async (req,res) => {
    try {
        const {userId}   = await req.auth();
        const { id }   = req.body;

     const user = await User.findById(userId);

     user.following = user.following.filter(user => user!== id);
     await user.save();

     const toUser = await User.findById(id);
     toUser.followers = toUser.followers.filter(user => user!== userId);
     await toUser.save();
    return  res.json({success:true, message:'you are no longer following this user'})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.mesage})
        
    }
}
