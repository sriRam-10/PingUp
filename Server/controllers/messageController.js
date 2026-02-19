import fs from 'fs';
import imageKit from '../Configs/imageKit.js';
import Message from '../Models/Message.js';

//create a empty object for the server side connections

const connections = {};

//controller function for the SSe endpoint

export const sseController = (req,res) => {
     const { userId } = req.params;
     console.log("new client connected :", userId);

     // set SSE headers
      res.setHeader('Content-Type' , 'text/event-stream');
      res.setHeader('Cache-Control' , 'no-cache');
      res.setHeader('Connection' , 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin' , '*');

      // add the client response object to the connection object 

      connections[userId] = res

      // send an initial event to the client

      res.write('log-Connecto to SSE stream/n/n')

      // handling the client disconnection

      req.on('close', ()=>{
        // remove the response from the connection array
      delete connections[userId];
      console.log('Client disconnected');
      

      })
}

//send message 

export const sendMessage = async (req,res) => {
    try {
        const { userId } = req.auth();
        const {to_user_id, text } = req.body;
        const image = req.file;

        let media_url = '';
        let message_type = image ? 'image' : 'text';

        if(message_type === 'image'){
             const fileBuffer = fs.readFileSync(image.path)
            
              const response = await imageKit.upload({
                 file : fileBuffer,
                 filename : image.originalname,
              });
              media_url = imageKit.baseURL({
                path : response.filepath,
                transformation:[
                    {quality : 'auto'},
                    {format : 'webp'},
                    {width : '1280'},


                ]
              })

        }
        const message = await Message.create({
            from_user_id : userId,
            to_user_id,
            text,
            message_type,
            media_url
        })

         res.json({success:true, message})


// send this message to to_user_id using sse
      
const messageWithUserData = await Message.findById(message._id).populate('from_user_id');
    
   if(connections(to_user_id)){
    connections[to_user_id].write(`data : ${JSON.stringify(messageWithUserData)}\n\n`)
   }


    } catch (error) {
         console.log(error);
        res.json({success:false, message: error.mesage})
    }

}

//get chat messages

export const getChatMessages = async (req,res) => {
 try {
      const { userId } = req.auth();
      const { to_user_id } = req.body;

   const messages = await Message.find({
    $or: [
        {from_user_id: userId, to_user_id},
        {from_user_id: to_user_id, to_user_id :userId}
    ]
   }).sort({createdAt : -1})

   // mark messages as seen

   await Message.updateMany({from_user_id: to_user_id, to_user_id :userId},{seen : true})
    
   res.json({success:true, messages})

    } catch (error) {
         res.json({success:false, message: error.mesage})
    }
}

//getting the recent message function

export const getUserRecentMessages = async (req,res) => {
    try {
        const { userId } = req.auth();
        const messages = await Message.find({to_user_id : userId}.populate('from_user_id to_user-id')).sort({createdAt : -1})
      
        res.json({success:true, messages})
        
    } catch (error) {
         res.json({success:false, message: error.mesage})
    }
}


