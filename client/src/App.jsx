import { useState } from 'react'

import './css/App.css'

import Header from './components/Header'


function App() {
  const [count, setCount] = useState(0) // this is clicks on page by user

  return (
    <>
      <Header />
    </>
  )
}


export default App
