import { Inngest } from "inngest";
import User from "../Models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "PingUp-app" });

// Create an empty array where we'll export future Inngest functions
export const syncUserCreation = inngest.createFunction(
    {id : 'sync-user-from-clerk'},
    {event :'clerk/user.created'},
    async (event) => {
        const {id,first_name,last_name,email_addresses,image_url} = event.data
        let username = email_addresses[0].email_addresses.split('@')[0]

        const user = await User.findOne({username})

        if(user){
            username = username + Math.floor(Math.random()* 10000)
        }

        const userData = {
            _id : id,
            username:first_name+ " "+last_name,
            email: email_addresses.email_addresses[0],
            profile_picture:image_url,
            username
        }
        await user.createdAt(userData)
    }
)
//udation of data in the database

export const syncUserUpdation = inngest.createFunction(
    {id : 'update-user-from-clerk'},
    {event :'clerk/user.updated'},
    async (event) => {
        const {id,first_name,last_name,email_addresses,image_url} = event.data
  
        const updatedUserData = {
            
            username:first_name+ " "+last_name,
            email: email_addresses.email_addresses[0],
            profile_picture:image_url,
           
        }
         await User.findByIdAndUpdate(id,updatedUserData)
    }
)

// delete the user data from the database

export const syncUserDeletion = inngest.createFunction(
    {id : 'delete-user-from-clerk'},
    {event :'clerk/user.deleted'},
    async (event) => {
        const {id} = event.data
     
        await User.findByIdAndDelete(id)
    }
)




    export const functions =[
        syncUserCreation,
        syncUserUpdation,
        syncUserDeletion
    ];