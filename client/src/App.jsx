import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Login from './Pages/Login'
import Feed from './Pages/Feed'
import Messages from './Pages/Messages'
import ChatBox from './Pages/ChatBox'
import Connections from './Pages/Connections'
import Discover from './Pages/Discover'
import Profile from './Pages/Profile'
import CreatePost from './Pages/CreatePost'
import {useUser,useAuth} from '@clerk/clerk-react'
import  Layout from './Pages/Layout'
import {Toaster} from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {fetchUser} from './features/user/userSlice'

const App = () => {
  const {user} = useUser()
  const {getToken} = useAuth();

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      if(user){
    const token = await getToken()
    dispatch(fetchUser(token))
    
    
   }
    }
    fetchData()
   
    
   
  }, [user,getToken,dispatch])
  


  return (
    <>
    <Toaster/>
    <Routes>
      <Route path='/' element={ !user? <Login/>: <Layout/>}> 
       <Route index element={<Feed/>}/>
       <Route  path='messages' element={<Messages/>}/>
       <Route  path='messages/:userId' element={<ChatBox/>}/>
       <Route  path='connections' element={<Connections/>}/>
       <Route  path='discover' element={<Discover/>}/>
       <Route  path='profile' element={<Profile/>}/>
       <Route  path='profile/:profileId' element={<Profile/>}/>
       <Route  path='createpost' element={<CreatePost/>}/>

      </Route>
    </Routes>
    </>
  )
}

export default App