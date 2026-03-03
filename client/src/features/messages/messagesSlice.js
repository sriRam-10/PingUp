import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  messages : []
}


const messagesSlice = createSlice({
    name:'messsages',
    initialState,
    reducers :{

    }
})

export default messagesSlice.reducer
