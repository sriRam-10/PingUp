import { Inngest } from "inngest";
import User from "../Models/User.js";
import Connection from "../Models/Connections.js";
import { connections } from "mongoose";
import sendEmail from "../Configs/nodeMailer.js";
import  Message  from '../models/Message.js';
import Story from "../Models/Story.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "PingUp-app" });

// Create an empty array where we'll export future Inngest functions
 const syncUserCreation = inngest.createFunction(
    {id : 'sync-user-from-clerk'},
    {event :'clerk/user.created'},
    async ({event}) => {
        const {id,first_name,last_name,email_addresses,image_url} = event.data
        let username = email_addresses[0].email_address.split('@')[0]

        const user = await User.findOne({username})

        if(user){
            username = username + Math.floor(Math.random()* 10000)
        }

        const userData = {
            _id :id,
            email: email_addresses[0].email_address,
            full_name:first_name+ " "+last_name,
            profile_picture:image_url,
            username
        }
        await user.create(userData)
    }
)
//updation of data in the database

 const syncUserUpdation = inngest.createFunction(
    {id : 'update-user-from-clerk'},
    {event :'clerk/user.updated'},
    async ({event}) => {
       
        const {id,first_name,last_name,email_addresses,image_url} = event.data
  
        const updatedUserData = {
           full_name:first_name+ " "+last_name,
           email: email_addresses[0].email_address, 
           profile_picture:image_url,
           
        }
         await User.findByIdAndUpdate(id,updatedUserData)
    }
)

// delete the user data from the database

 const syncUserDeletion = inngest.createFunction(
    {id : 'delete-user-with-clerk'},
    {event :'clerk/user.deleted'},
    async ({event}) => {
        const {id} = event.data
     
        await User.findByIdAndDelete(id)
    }
)

// inngest function to remain the connection request is still pending

 const sendNewConnectionRequestRemainder = inngest.createFunction(
    {id : 'send-new-connection-request-remainder'},
    {event :'app/connection-request'},
    async ({event, step}) => { 
        const {connectionId} = event.data;

        await step.run('send-connection-request-mail' , async () => {
            const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');
        const subject = `New Connection Request`
        const body = `
        <div style="font-family : Arial, sans-serif padding: 20px;">
          <h2>Hi ${connection.to_user_id.full_name},</h2>
         <p>you have new connection request from ${connection.from_user_id.full_name}
                                              - ${connection.to_user_id.full_name} </p>
    <p>Click <a href = "${proccess.env.FRONTEND_URL}/connections" style ="color:#10b981;">here<a/> to accept or reject the request</p>
    </br>
    <p>Thanks </br> PingUp-Stay connected</p>
        </div>`;

        await sendEmail({
            to: connection.to_user_id.email,
            subject,
            body
        })

           })
           const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 100)
           await step.sleepUntil("wait-for-24-hours",in24Hours);
           await step.run("send-connection-request-remainder" ,async (params) => {
              const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');
              if(connection.status === 'accepted'){
                return {message : 'Already accepted'}
              }

       const subject = `New Connection Request`
        const body = `
        <div style="font-family : Arial, sans-serif padding: 20px;">
          <h2>Hi ${connection.to_user_id.full_name},</h2>
         <p>you have new connection request from ${connection.from_user_id.full_name}
                                              - ${connection.to_user_id.full_name} </p>
    <p>Click <a href = "${proccess.env.FRONTEND_URL}/connections" style ="color:#10b981;">here<a/> to accept or reject the request</p>
    </br>
    <p>Thanks </br> PingUp-Stay connected</p>
        </div>`;

        await sendEmail({
            to: connection.to_user_id.email,
            subject,
            body
        })

        return {message:'Remainder sent'}

           })
    }
)

//inngest function to delete the story after 24 hours 

 const deleteStory = inngest.createFunction(
    {id : 'story-delete'},
    {event :'app/story.delete'},
    async ({event,step}) => {
   const {storyId} = event.data;
   const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 100)

   await step.sleepUntil('wait-for-24-hours', in24Hours);
   await step.run("delete-stroy", async () => {
       await Story.findByIdAndDelete(storyId)
       return {message :"story deleted."}
   })


    }
)
 const sendNotificationofUnseenMessages = inngest.createFunction(
       {id : 'send-unseen-messages-notification'},
       {cron :"TZ=America/New_York 0 9 * * *"}, //everyday at 9am

       async ({step}) => {
        const messages = await Message.find({seen : false}).populate('to_user_id')
        const unseenCount =  {}
        messages.map(message =>{
            unseenCount[message.to_user_id._id] = (unseenCount[message.to_user_id._id] || 0) + 1
        })

        for (const userId in unseenCount){
           const user = await User.findById(userId);

           const subject = `You have ${unseenCount[userId]} unseen messages `;
           const body = 
            `<div style="font-family : Arial, sans-serif padding: 20px;">
          <h2>Hi ${user.full_name},</h2>
         <p>You have ${unseenCount[userId]} unseen messages </p>
    <p>Click <a href = "${proccess.env.FRONTEND_URL}/connections" style ="color:#10b981;">here<a/>to view them</p>
    </br>
    <p>Thanks </br> PingUp-Stay connected</p>
        </div>`;

        await sendEmail({
            to : user.email,
            subject,
            body
        })
        }
     return {message : "Notification sent."}

       }


)

    export const functions =[
        syncUserCreation,
        syncUserUpdation,
        syncUserDeletion,
        sendNewConnectionRequestRemainder,
        deleteStory,
        sendNotificationofUnseenMessages
    ];




// import { Inngest } from "inngest";
// import User from "../Models/User.js";
// import Connection from "../Models/Connections.js";
// import sendEmail from "../Configs/nodeMailer.js";
// import Message from '../models/Message.js';
// import Story from "../Models/Story.js";

// export const inngest = new Inngest({ id: "PingUp-app" });

// // 1. User Creation
// const syncUserCreation = inngest.createFunction(
//     { id: 'sync-user-from-clerk' },
//     { event: 'clerk/user.created' },
//     async ({ event, step }) => {
//         const data = event?.data;
//         if (!data) return { message: "No data received" };

//         const { id, first_name, last_name, email_addresses, image_url } = data;
//         const email = email_addresses[0].email_address;
        
//         let username = email.split('@')[0].toLowerCase();

//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             username = username + Math.floor(Math.random() * 10000);
//         }

//         const userData = {
//             _id: id,
//             email: email,
//             full_name: `${first_name || ""} ${last_name || ""}`.trim(),
//             profile_picture: image_url,
//             username
//         };

//         // FIXED: Use User.create instead of user.createdAt
//         await User.create(userData);
//         return { message: "User created" };
//     }
// );

// // 2. User Update
// const syncUserUpdation = inngest.createFunction(
//     { id: 'update-user-from-clerk' },
//     { event: 'clerk/user.updated' },
//     async ({ event }) => {
//         const data = event?.data;
//         if (!data) return;

//         const { id, first_name, last_name, email_addresses, image_url } = data;

//         const updatedUserData = {
//             full_name: `${first_name || ""} ${last_name || ""}`.trim(),
//             email: email_addresses[0].email_address,
//             profile_picture: image_url,
//         };
//         await User.findByIdAndUpdate(id, updatedUserData);
//     }
// );

// // 3. User Deletion
// const syncUserDeletion = inngest.createFunction(
//     { id: 'delete-user-with-clerk' },
//     { event: 'clerk/user.deleted' },
//     async ({ event }) => {
//         const id = event?.data?.id;
//         if (id) await User.findByIdAndDelete(id);
//     }
// );

// // 4. Connection Reminder
// const sendNewConnectionRequestRemainder = inngest.createFunction(
//     { id: 'send-new-connection-request-remainder' },
//     { event: 'app/connection-request' },
//     async ({ event, step }) => {
//         const { connectionId } = event.data;

//         const connection = await step.run('fetch-connection', async () => {
//             return await Connection.findById(connectionId).populate('from_user_id to_user_id');
//         });

//         if (!connection) return { message: "Connection not found" };

//         const emailTemplate = (conn) => ({
//             subject: `New Connection Request`,
//             body: `
//                 <div style="font-family: Arial, sans-serif; padding: 20px;">
//                     <h2>Hi ${conn.to_user_id.full_name},</h2>
//                     <p>You have a new connection request from ${conn.from_user_id.full_name}</p>
//                     <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">here</a> to accept or reject.</p>
//                     <p>Thanks,<br>PingUp Team</p>
//                 </div>`
//         });

//         await step.run('send-initial-mail', async () => {
//             const { subject, body } = emailTemplate(connection);
//             await sendEmail({ to: connection.to_user_id.email, subject, body });
//         });

//         // Wait 24 Hours (Corrected math: 1000ms)
//         await step.sleep("wait-for-24-hours", "24h");

//         await step.run("send-remainder", async () => {
//             const currentConn = await Connection.findById(connectionId).populate('from_user_id to_user_id');
//             if (!currentConn || currentConn.status === 'accepted') return { message: 'Skipped' };

//             const { subject, body } = emailTemplate(currentConn);
//             await sendEmail({ to: currentConn.to_user_id.email, subject, body });
//             return { message: 'Reminder sent' };
//         });
//     }
// );

// // 5. Story Deletion
// const deleteStory = inngest.createFunction(
//     { id: 'story-delete' },
//     { event: 'app/story.delete' },
//     async ({ event, step }) => {
//         const { storyId } = event.data;
//         await step.sleep("wait-24h", "24h");
//         await step.run("delete-story-db", async () => {
//             await Story.findByIdAndDelete(storyId);
//             return { message: "Story deleted" };
//         });
//     }
// );

// // 6. Unseen Messages Cron
// const sendNotificationofUnseenMessages = inngest.createFunction(
//     { id: 'send-unseen-messages-notification' },
//     { cron: "0 9 * * *" }, // 9 AM daily
//     async ({ step }) => {
//         const messages = await Message.find({ seen: false }).populate('to_user_id');
//         const unseenCount = {};
        
//         messages.forEach(msg => {
//             const userId = msg.to_user_id?._id;
//             if (userId) unseenCount[userId] = (unseenCount[userId] || 0) + 1;
//         });

//         for (const userId in unseenCount) {
//             await step.run(`email-user-${userId}`, async () => {
//                 const user = await User.findById(userId);
//                 if (!user) return;

//                 await sendEmail({
//                     to: user.email,
//                     subject: `You have ${unseenCount[userId]} unseen messages`,
//                     body: `<h2>Hi ${user.full_name},</h2><p>You have ${unseenCount[userId]} new messages.</p>`
//                 });
//             });
//         }
//     }
// );

// export const functions = [
//     syncUserCreation,
//     syncUserUpdation,
//     syncUserDeletion,
//     sendNewConnectionRequestRemainder,
//     deleteStory,
//     sendNotificationofUnseenMessages
// ];
   