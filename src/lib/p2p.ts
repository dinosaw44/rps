import { Peer as PeerJS, type PeerOptions } from 'peerjs'

const server = process.env.NODE_ENV === 'production' ? {} : {
    host: 'localhost',
    port: 9000,
}

const devApi = (endpoint: string) => `http://${server.host}:${server.port}/dev/${endpoint}`

const post = (endpoint: 'register' | 'unregister', id: string) => fetch(devApi(endpoint), {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        id,
    }),
})

const register = (id: string) => post('register', id)
const unregister = (id: string) => post('unregister', id)

class DevMode extends PeerJS {
    constructor(config: PeerOptions) {
        super(config)
        this.on('open', id => {

            this.on('disconnected', () => unregister(id))

            window.addEventListener('beforeunload', () => {
                this.emit('disconnected', this.id)
            })

            register(id)
        })
    }
}

const PeerConstructor = process.env.NODE_ENV === 'production'
    ? PeerJS
    : DevMode

export class Peer {
    static create() {
        return new PeerConstructor(server)
    }

    private constructor() {}
}