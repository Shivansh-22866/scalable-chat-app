import { Server } from "socket.io";
import Redis from 'ioredis'

const pub = new Redis({
    host: '',
    port: 0,
    username: '',
    password: ''
})
const sub = new Redis({
    host: '',
    port: 0,
    username: '',
    password: ''
})

class SocketService {
    private _io: Server;

    constructor() {
        console.log('init SocketService')
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            }
        });
        sub.subscribe('MESSAGES')
    }

    public initListeners() {
        console.log("Init Socket listeners")
        const io = this.io
        io.on("connect", (socket) => {
            console.log("a user connected", socket.id)

            socket.on("event:message", async ({message}: {message: string}) => {
                console.log(message)
                const response = await pub.publish('MESSAGES', JSON.stringify({message}))
                console.log(response)
            })
        })

        sub.on('message', async(channel, message) => {
            if(channel === 'MESSAGES') {
                console.log("Message received: ", message)
                io.emit("message", message)
            }
        })
    }

    get io() {
        return this._io
    }
}

export default SocketService