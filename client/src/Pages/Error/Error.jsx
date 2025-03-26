import React from 'react'
import { Link } from 'react-router-dom'


const Error = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center">
    <h1 className="text-4xl font-bold">ERROR 404!</h1>
    <h3 className="text-xl mt-2">Page not found</h3>
    <Link 
        to="/" 
        className="mt-4 no-underline link py-2 px-4 rounded-2xl  transition duration-300"
    >
        Go to Home
    </Link>
</div>


  )
}

export default Error
