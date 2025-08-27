import React from 'react'

const AvatarGroup = ({ avatars, maxVisible }) => {
  return (
    <div className='flex -space-x-2'>
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`User Avatar ${index + 1}`}
          className='w-8 h-8 rounded-full border-2 border-white'
        />
      ))}
      {avatars.length > maxVisible && (
        <span className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-200'>
          +{avatars.length - maxVisible}
        </span>
      )}
    </div>
  )
}

export default AvatarGroup
