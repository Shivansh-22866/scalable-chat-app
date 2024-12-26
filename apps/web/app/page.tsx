"use client"

import React, { useState } from 'react'
import classes from './page.module.css'
import { useSocket } from '../context/SocketProvider'

export default function Page() {
  const {sendMessage, messages} = useSocket()
  const [message, setMessage] = useState("")
  return (
    <div>
      <div>
        {messages.map((e, index) => (
            <p key={index}>{e}</p>))}
      </div>
      <div className={classes['chat-input-container']}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} className={classes['chat-input']} placeholder='Type...' />
        <button onClick={() => sendMessage(message)} className={classes['button']}>
          Send
        </button>
      </div>
    </div>
  )
}