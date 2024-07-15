import { HeadProvider, Link, } from 'react-head'
import { useEffect, useState } from 'react'

import favicon from './lib/common/assets/favicon.png'
import { Peer } from './lib/p2p'

import './App.css'


function Host() {
  const [ id, setId ] = useState<string>()
  const [ peers, setPeers ] = useState<string[]>([])
  
  useEffect(() => {
    const peer = Peer.create()

    peer.on('open', setId)
    peer.on('connection', connection => {
      setPeers(peers => [...peers, connection.peer])
    })
  }, [])

  return <>
    {id
      ? <p>Share link: {location.href}/?join={id}</p>
      : <p>Generating link...</p>
    }
    {peers.map(id => <p>
      {id} 
    </p>)}
  </>
}

function Client({ host }: { host: string }) {
  const [ id, setId ] = useState<string>()

  useEffect(() => {
    const peer = Peer.create()

    peer.on('open', id => {
      setId(id)
      peer.connect(host, { metadata: { displayName: `peer-${id}` }})
    })
  }, [])

  return <>
    <p>{id}</p>
  </>
}

function App() {
  const host = new URLSearchParams(location.search).get('join')

  return <>
    <HeadProvider>
      <Link rel="icon" type="image/svg+xml" href={favicon} />
    </HeadProvider>
    {host ? <Client host={host} /> : <Host />}
  </>
}

export default App
