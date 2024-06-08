import { ChatMessages } from '@/components/ChatMessages'
import { MessageBar } from '@/components/MessageBar'
import { Search } from '@/components/Search'
import { ChatLayout } from '@/layouts/ChatLayout/Chat.layout'
import { useSearch } from '@/queries/useSearch'
import { ApiChatMessage, chatApi } from '@/services/api'
import { populateDirs } from '@/utils/populateDirs.util'
import React, { useEffect, useMemo, useState } from 'react'

export type HomePageProps = React.HTMLProps<HTMLDivElement>

export const HomePage: React.FC<HomePageProps> = ({ className, ...props }) => {
  const [query, setQuery] = useState('')
  const [prompt, setPrompt] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [messages, setMessages] = useState<ApiChatMessage[]>([])
  const [generating, setGenerating] = useState(false)
  const [lastChatMessage, setLastChatMessage] = useState<string>('')

  const search = useSearch(
    { query },
    {
      cacheTime: 0,
      enabled: false,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  const fileList = useMemo(
    () => populateDirs(search.data?.files || []),
    [search.data],
  )

  const onSearch = async () => {
    search.refetch()
  }

  const onPrompt = async (prompt: string) => {
    setGenerating(true)

    const userMessage: ApiChatMessage = {
      role: 'user',
      message: prompt,
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    const { message } = await chatApi({
      prompt,
      files: fileList.filter((f) => selectedFiles.includes(f.id)),
      history: updatedMessages,
    })

    setGenerating(false)
    setMessages((prevMessages) => [...prevMessages, message])
    setPrompt('')
    setLastChatMessage(prompt)
  }

  const handleEdit = () => {
    console.log('Editing message')
  }

  const handleSave = (messageId: string, editedMessage: string) => {
    console.log(`Saving message ${messageId}: ${editedMessage}`)
    const updatedMessages = messages.map((msg) =>
      msg.message === messageId ? { ...msg, message: editedMessage } : msg,
    )
    setMessages(updatedMessages)
  }

  const handleStartNewChat = (editedMessage?: string) => {
    if (editedMessage) {
      onPrompt(editedMessage)
    } else {
      onPrompt(lastChatMessage)
    }
  }

  useEffect(() => {
    setSelectedFiles([])
  }, [search.data])

  useEffect(() => {
    onSearch()
  }, [])

  return (
    <ChatLayout
      messageBar={
        <MessageBar
          hide={selectedFiles.length === 0}
          prompt={prompt}
          onPromptChange={setPrompt}
          onSubmit={(prompt) => onPrompt(prompt)}
          loading={generating}
          disabled={generating}
        />
      }
    >
      <Search
        compact={messages.length > 0}
        searching={search.isFetching}
        query={query}
        onQueryChange={(v) => setQuery(v)}
        onSearch={onSearch}
        results={fileList}
        onSelect={(selected) => setSelectedFiles(selected)}
        selectedFiles={selectedFiles}
      />
      <ChatMessages
        className="py-[20px]"
        data={messages.map((msg, index) => ({
          messageId: `msg-${index}`,
          role: msg.role,
          message: msg.message,
        }))}
        onEdit={handleEdit}
        onSave={handleSave}
        onStartNewChat={handleStartNewChat}
      />
    </ChatLayout>
  )
}
