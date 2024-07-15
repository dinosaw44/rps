import alphabet from 'nanoid-dictionary'
import { customAlphabet, customRandom } from 'nanoid'
import { XORShift } from 'random-seedable'
import { ExpressPeerServer } from 'peer'

import express from 'express'

import { digest } from './testing'

const app = express();

const port = Number(process.env.npm_package_config_port)

const server = app.listen(port, () => {
    console.log(`PeerJS server running on port ${port}`)
})

const ids: string[] = []
const env = process.env.NODE_ENV

const generateClientId = env !== 'development'
  ? customAlphabet(alphabet.nolookalikesSafe, 16)
  : (() => {

        console.log(`Running in ${env} mode: using deterministic id generation`)

        return customRandom(alphabet.nolookalikesSafe, 16, size => {
            const seed = digest(ids)
            const random = new XORShift(seed)

            return new Uint8Array(size).map(() => 256 * random.float())
        })
    })()

const peerServer = ExpressPeerServer(server, {
    allow_discovery: true,
    generateClientId,
});

app.use(express.json())
app.use('/', peerServer)

if (env === 'development') {
    app.post('/dev/register', (req) => {
        ids.push(req.body.id)
    })

    app.post('/dev/unregister', (req) => {
        const index = ids.indexOf(req.body.id)
        
        if (index >= 0) {
            ids.splice(index, 1)
        }
    })
}