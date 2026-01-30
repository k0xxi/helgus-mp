import { useState, useRef, useEffect } from 'react'
import type { Message, Seller } from '../types'

interface ChatDrawerProps {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
  seller: Seller
  onSendMessage?: (content: string) => void
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Heute'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Gestern'
  }
  return date.toLocaleDateString('de-AT', { day: 'numeric', month: 'long' })
}

export function ChatDrawer({ isOpen, onClose, messages, seller, onSendMessage }: ChatDrawerProps) {
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isOpen, messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      onSendMessage?.(newMessage.trim())
      setNewMessage('')
    }
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = []
  messages.forEach((message) => {
    const dateKey = formatDate(message.timestamp)
    const lastGroup = groupedMessages[groupedMessages.length - 1]
    if (lastGroup?.date === dateKey) {
      lastGroup.messages.push(message)
    } else {
      groupedMessages.push({ date: dateKey, messages: [message] })
    }
  })

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
              {seller.avatar ? (
                <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white truncate">{seller.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{seller.responseTime}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {groupedMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Noch keine Nachrichten</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Schreiben Sie {seller.name} eine Nachricht
              </p>
            </div>
          ) : (
            groupedMessages.map((group) => (
              <div key={group.date}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{group.date}</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="space-y-3">
                  {group.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                          message.isOwn
                            ? 'bg-red-500 text-white rounded-br-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isOwn ? 'text-red-200' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nachricht schreiben..."
                rows={1}
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl resize-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="flex-shrink-0 w-12 h-12 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl flex items-center justify-center transition-colors disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
