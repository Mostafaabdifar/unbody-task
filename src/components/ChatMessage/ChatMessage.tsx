import { Avatar } from '@nextui-org/react'
import React, { useState } from 'react'
import { useAnimatedText } from '../AnimatedText'

export interface ChatMessageProps {
  messageId: string
  message: string
  role: 'user' | 'assistant'
  disableAnimation?: boolean
  onEdit?: () => void
  onSave: (messageId: string, editedMessage: string) => void
  onStartNewChat: (editedMessage: string) => void
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  messageId,
  message,
  role,
  disableAnimation = false,
  onEdit,
  onSave,
  onStartNewChat,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedMessage, setEditedMessage] = useState(message)
  const [edited, setEdited] = useState(false)

  const content = useAnimatedText(editedMessage, {
    maxTime: 1000,
    disabled: role === 'user' || disableAnimation,
  })

  const handleEditClick = () => {
    setIsEditing(true)
    if (onEdit) onEdit()
  }

  const handleSaveClick = () => {
    setIsEditing(false)
    setEdited(true)
    onSave(messageId, editedMessage)
  }

  const handleStartNewChat = () => {
    onStartNewChat(editedMessage)
  }

  return (
    <div className={`flex flex-row gap-4 items-start`}>
      <Avatar
        className="flex-shrink-0"
        showFallback
        color={role === 'assistant' ? 'primary' : 'default'}
        name={role === 'assistant' ? 'A' : ''}
        classNames={{ name: 'text-[16px]' }}
      />
      <div className="flex-grow border border-gray-200 rounded-lg p-4 text-md bg-white shadow-sm mt-[-4px]">
        {isEditing ? (
          <textarea
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
          />
        ) : (
          <div
            className="whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        {!isEditing && role === 'user' && !edited && (
          <button onClick={handleEditClick}>Edit</button>
        )}
        {!isEditing && edited && (
          <>
            <button className="mr-4" onClick={handleStartNewChat}>
              Start New Chat
            </button>
            {role === 'user' && (
              <button onClick={handleEditClick}>Edit Again</button>
            )}
          </>
        )}
        {isEditing && <button onClick={handleSaveClick}>Save</button>}
      </div>
    </div>
  )
}
