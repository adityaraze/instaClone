import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'

const Comment = ({comment}) => {
  return (
    <div className='my-2 '>
    <div className='flex gap-3 items-center'>
        <Avatar>
            <AvatarImage src={comment?.author?.profilePicture} height={35} width={35} className='rounded-full object-cover'/>
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className='font-bold text-sm '>{comment?.author?.name} <span className='font-normal pl-1'>{comment?.text}</span></h1>
    </div>

    </div>
  )
}

export default Comment