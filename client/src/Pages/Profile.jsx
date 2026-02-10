// import React, { useEffect, useState } from 'react'
// import {Link, useParams} from 'react-router-dom'
// import { dummyPostsData, dummyUserData } from '../assets/assets'
// import Loading from '../Components/Loading'
// import UserProfileInfo from '../Components/UserProfileInfo'
// import PostCard from '../Components/PostCard'
// import moment from 'moment'

// const Profile = () => {
//   const{profileId} = useParams()
//   const [user, setuser] = useState(null)
//   const [posts, setPosts] = useState([])
//   const [activeTab, setActiveTab] = useState('posts')
//   const [showEdit, setShowEdit] = useState(false)

//    const fetchUser = async (params) => {
//      setuser(dummyUserData)
//      setPosts(dummyPostsData)
//    }

//    useEffect(() => {
//      fetchUser()
//    }, [])
   

// return user ? (
//     <div className='realtive h-full overflow-y-scroll bg-gray-50 p-6'>
//     <div className='max-w-3xl mx-auto'>
//        {/* profile card */}
//        <div className='bg-white rounded-2xl shadow overflow-hidden'>
//         {/* cover photo */}
//         <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'>
//             {user.cover_photo && <img src={user.cover_photo} alt=''className='w-full h-full object-cover'/>  }
//         </div>

//         {/* user info */}
//         <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit}/>
        
//        </div>
//        {/* tabs */}
//             <div className='mt-6'>
//               <div className='bg-white rounded-xl shadow p-1 max-w-md mx-auto flex'>
//                 {['posts','media','likes'] .map((tab)=>(
//                 <button onClick={()=>setActiveTab(tab)} key={tab}
//                          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg 
//                                      transition-colors cursorpointer ${activeTab === tab ?
//                                       "bg-indigo-600 text-white ":
//                                       "text-gray-600 hover:text-gray-900"
//                                      }`} >
//                     {tab.charAt(0).toUpperCase()+ tab.slice(1)}
                   
//                 </button>
//                 ))}
               
//               </div>
//               {/* posts */}

//               {activeTab === 'posts'  && (
//                 <div className='mt-6 flex flex-col items-center gap-6'>
//                   {posts.map((post)=> <PostCard key={post._id} post={post}/>)}
//                 </div>
//               )}

//                  {/* { media} */}

//                {activeTab === 'media'  && (
//                 <div className='mt-6 flex flex-wrap max-w-6xl'>
//                   {posts.filter((post)=> post.image_urls.length > 0).map((post)=>(
//                       <>
//                       {
//                         post.image_urls.map((image,index)=>(
//                           <Link> 
//                           <img src={image} alt=""  key={index} className='-64 aspect-video object-cover'/>
//                           <p>Posted{moment(post.createdAt().froNow())}</p>
//                           </Link>
//                         ))
//                       }
//                       </>
//                   ))} 
              
//                 </div>
// </div>
//         <div>
          
//         </div>
//     </div>

//     </div>
//   ) : <Loading/>


// export default Profile;

import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyPostsData, dummyUserData } from '../assets/assets'
import Loading from '../Components/Loading'
import UserProfileInfo from '../Components/UserProfileInfo'
import PostCard from '../Components/PostCard'
import moment from 'moment'
import ProfileModal from '../Components/profileModal'
const Profile = () => {
  const { profileId } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)

  const fetchUser = async () => {
    setUser(dummyUserData)
    setPosts(dummyPostsData)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return user ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* profile card */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {/* cover photo */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* user info */}
          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
          />
        </div>

        {/* tabs */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow p-1 max-w-md mx-auto flex">
            {['posts', 'media', 'likes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* posts */}
          {activeTab === 'posts' && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* media */}
          {activeTab === 'media' && (
            <div className="mt-6 flex flex-wrap max-w-6xl gap-4">
              {posts
                .filter((post) => post.image_urls.length > 0)
                .map((post) => (
                  <React.Fragment key={post._id}>
                    {post.image_urls.map((image, index) => (
                      <Link to={image} key={index} target='_blank' className='relative group'>
                        <img
                          src={image}
                          alt=""
                          className="w-60 aspect-video object-cover"
                        />
                        <p className=" absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl 
                                       text-white opacity-0 group-hover:opacity-100 transition duartion-300">
                          Posted {moment(post.createdAt).fromNow()}
                        </p>
                      </Link>
                    ))}
                  </React.Fragment>
                ))}
            </div>
          )}
        </div>
      </div>
      {/* edit profile model */}
     {showEdit && <ProfileModal  setShowEdit={setShowEdit}/> }
    </div>
  ) : (
    <Loading />
  )
}

export default Profile
