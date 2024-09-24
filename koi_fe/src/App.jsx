import { useState } from 'react'
import './App.css'
import RegisterPage from './page/RegisterPage/RegisterPage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <RegisterPage/>
  )
}

export default App
