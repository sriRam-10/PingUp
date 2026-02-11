// import { Inngest } from "inngest";
// import User from "../Models/User.js";

// // Create a client to send and receive events
// export const inngest = new Inngest({ id: "PingUp-app" });

// // Create an empty array where we'll export future Inngest functions
// export const syncUserCreation = inngest.createFunction(
//     {id : 'sync-user-from-clerk'},
//     {event :'clerk/user.created'},
//     async (event) => {
//         const {id,first_name,last_name,email_addresses,image_url} = event.data
//         let username = email_addresses[0].email_addresses.split('@')[0]

//         const user = await User.findOne({username})

//         if(user){
//             username = username + Math.floor(Math.random()* 10000)
//         }

//         const userData = {
//             _id : id,
//             username:first_name+ " "+last_name,
//             email: email_addresses.email_addresses[0],
//             profile_picture:image_url,
//             username
//         }
//         await user.createdAt(userData)
//     }
// )
// //updation of data in the database

// export const syncUserUpdation = inngest.createFunction(
//     {id : 'update-user-from-clerk'},
//     {event :'clerk/user.updated'},
//     async (event) => {
//         const {id,first_name,last_name,email_addresses,image_url} = event.data
  
//         const updatedUserData = {
            
//             username:first_name+ " "+last_name,
//             email: email_addresses.email_addresses[0],
//             profile_picture:image_url,
           
//         }
//          await User.findByIdAndUpdate(id,updatedUserData)
//     }
// )

// // delete the user data from the database

// export const syncUserDeletion = inngest.createFunction(
//     {id : 'delete-user-from-clerk'},
//     {event :'clerk/user.deleted'},
//     async (event) => {
//         const {id} = event.data
     
//         await User.findByIdAndDelete(id)
//     }
// )




//     export const functions =[
//         syncUserCreation,
//         syncUserUpdation,
//         syncUserDeletion
//     ];


import { Inngest } from "inngest";
import User from "../Models/User.js";
import connectDB from "../Configs/db.js";

// Create Inngest client
export const inngest = new Inngest({ id: "PingUp-app" });

// Ensure DB connection per execution (important for serverless)
async function ensureDB() {
  if (User.db.readyState !== 1) {
    await connectDB();
  }
}

/* =========================
   CREATE USER
========================= */
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await ensureDB();

    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    let username =
      email_addresses?.[0]?.email_address?.split("@")[0];

    if (!username) return;

    // Ensure unique username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      username = `${username}${Math.floor(Math.random() * 10000)}`;
    }

    const userData = {
      _id: id,
      name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      username,
      email: email_addresses[0].email_address,
      profile_picture: image_url,
    };

    await User.create(userData);
  }
);

/* =========================
   UPDATE USER
========================= */
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    await ensureDB();

    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    const updatedUserData = {
      name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      email: email_addresses?.[0]?.email_address,
      profile_picture: image_url,
    };

    await User.findByIdAndUpdate(id, updatedUserData);
  }
);

/* =========================
   DELETE USER
========================= */
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await ensureDB();
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

/* =========================
   EXPORT FUNCTIONS
========================= */
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];