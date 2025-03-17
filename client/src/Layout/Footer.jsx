import React from 'react'
import {Link} from 'react-router-dom'
const Footer = () => {
  return (
    <div className="container">
  <footer className="py-3 my-4">
    <ul className="nav justify-content-center border-bottom pb-3 mb-3 gap-3">
      <li className="nav-item">
        <Link to='/' className='no-underline text-black'>Home</Link>
       </li>
       <li className="nav-item ">
        <Link to='/modelcheck' className='no-underline text-black'>Model Check</Link>
       </li>
       <li className="nav-item">
        <Link to='/about' className='no-underline text-black '>About</Link>
       </li>
       <li className="nav-item">
        <Link to='/Contact' className='no-underline text-black'>Contact</Link>
       </li>
       
    </ul>
    <p className="text-center text-body-secondary">© 2024 Company, Inc</p>
  </footer>
</div>
  )
}

export default Footer
