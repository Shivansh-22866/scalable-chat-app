"use client"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"

interface SocketProviderProps {
  children?: React.ReactNode
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
  messages: string[]
}

const SocketContext = React.createContext<ISocketContext | null>(null)

export const useSocket = () => {
  const state = useContext(SocketContext)

  if(!state) {
    throw new Error("State undefined")
  }

  return state
}


export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {

  const [socket, setSocket] = useState<Socket>()
  const [messages, setMessages] = useState<string[]>([])

  const sendMessage : ISocketContext["sendMessage"] = useCallback((msg: string) => {
    if(socket) {
      console.log("Socket: ", socket)
      socket.emit('event:message', {message: msg})
    }
    else {
      console.log("No socket found")
    }
    console.log(msg)
  }, [socket])

  const onMessageReceived = useCallback((msg: string) => {
    console.log('Message received: ', msg)
    const {message} = JSON.parse(msg) as {message: string}
    setMessages((prev) => [...prev, message])
  }, [])

  useEffect(() => {
    const _socket = io('http://localhost:8003')

    _socket.on('message', onMessageReceived)
    setSocket(_socket)

    return () => {
      _socket.off('message', onMessageReceived)
      _socket.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{sendMessage, messages}}>
      {children}
    </SocketContext.Provider>
  )
}