import React, { useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulating login state


  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token); // Convert token existence to boolean
  }, [])

  const handleLogout = () => {
  localStorage.removeItem("userToken"); // Remove token
  setIsLoggedIn(false);
  setShowDropdown(false);
  console.log("User logged out");
};

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        {/* Logo with blue glow effect */}
        <Link
          to="/"
          className="text-[3rem] font-extrabold bg-gradient-to-r from-blue-800 via-blue-500 to-blue-300 text-transparent bg-clip-text drop-shadow-lg animate-pulse no-underline"
          style={{
            fontFamily: "Goldman",
            textShadow: "0 0 10px rgba(0, 123, 255, 0.8)",
          }}
        >
          DrowzeX
        </Link>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler duration-300"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div
          className={`navbar-collapse ${isOpen ? "d-block" : "d-none"} d-lg-flex justify-content-between`}
        >
          {/* Left-aligned Links */}
          <ul className="navbar-nav gap-3 flex-column flex-lg-row lg:ms-10">
            <li className="nav-item">
              <Link to="/livedetect" className="no-underline text-black font-bold" onClick={() => setIsOpen(false)}>
                Live Detect
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="no-underline text-black font-bold" onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="no-underline text-black font-bold" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/faqs" className="no-underline text-black font-bold" onClick={() => setIsOpen(false)}>
                FAQs
              </Link>
            </li>
          </ul>

          {/* User Profile Dropdown */}
          <div className="relative">
      {/* User Icon Button */}
      <button className="p-2 rounded-full" onClick={() => setShowDropdown(!showDropdown)}>
        <HiUserCircle className="text-4xl" />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute mt-2 flex flex-col bg-white shadow-lg rounded-lg p-2 left-0 lg:left-auto lg:-translate-x-[100px] w-40">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="px-4 py-2 text-black hover:bg-gray-100 no-underline"
                onClick={() => setShowDropdown(false)}
              >
                View Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-black hover:bg-gray-100 text-left w-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="px-4 py-2 hover:bg-gray-100 no-underline text-black"
                onClick={() => setShowDropdown(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-black hover:bg-gray-100 no-underline"
                onClick={() => setShowDropdown(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
