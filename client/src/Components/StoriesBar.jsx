import React, { useEffect, useState } from 'react'
import { dummyStoriesData } from '../assets/assets';
import { Plus } from 'lucide-react';
import moment from 'moment'
import StoryModel from './StoryModal';
import StoryViewer from './StoryViewer';
const StoriesBar = () => {

    const [stories, setStories] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [viewStory, setViewStory] = useState(null)
    const fetchstories = async (params) => {
        setStories(dummyStoriesData)
    }

    useEffect(() => {
      fetchstories()
    }, [])
    
  return (
    <div className='w-screen sm:w-[calc-(100vh-250px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>
    <div className='flex gap-4 pb-5'>
       {/* add stories */}
        <div onClick={()=>setShowModal(true)} className='rounded-lg shadow-sm min-w-[7.5rem] max-w-[7.5rem] max-h-[10rem]
                        aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200
                        border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white'>
    <div className='h-full flex flex-col items-center justify-center p-4'>
        <div className='size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3'>
         <Plus className='text-white h-5 w-5'/>
          </div>
        <p className='text-sm font-medium text-slate-700 text-center'>Create Story</p>

   </div>

        </div>
        {/* stories list */}
          {
            stories.map((story,index)=>(
                <div onClick={()=>setViewStory(story)} key={index} className={` relative rounded-lg shadow-sm min-w-[7.5rem] max-w-[7.5rem] max-h-[10rem]
                         cursor-pointer hover:shadow-lg transition-all duration-200
                         bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 
                         hover:to-indigo-800 active:scale-95`}>
                    <img src={story.user.profile_picture} alt="" className='absolute size-8 top-3 left-3 rounded-full ring ring-gray-100 shadow z-20' />
                    <p className='absolute top-18 left-3 text-white/60 text-sm truncate max-w-24'>{story.content}</p>
                    <p className='text-white absolute bottom-1 right-2 z-10 text-xs'>{moment(story.createdAt).fromNow()}</p>
                    {
                        story.media_type !== 'text' && (
                            <div className='absolute inset-0 z-1 rounded-lg bg-black
                                            overflow-hidden'>
                       {
                        story.media_type === 'image' ?
                      <img src={story.media_url} alt="" className='h-full w-full object-cover hover:scale-110 
                                             transition duration-500 opacity-70 hover:opacity-80' />
                      :
                    <video src={story.media_url} className='h-full w-full object-cover hover:scale-110 
                                        transition duration-500 opacity-70 hover:opacity-80'/>                                          
                    }
         </div>
                        )
                    }
                   
                </div>
            ))
          }
    </div>
    {/* add story model */}
    {
      showModal && <StoryModel setShowModal={setShowModal} fetchstories={fetchstories}/>
    }
   {/* view story model */}
   {
    viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
   }
    </div>
  )
}

export default StoriesBar