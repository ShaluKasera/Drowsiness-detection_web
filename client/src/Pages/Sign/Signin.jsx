import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const Signin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
  
    try {
        const response = await axios.post("https://drowsiness-detection-web-4.onrender.com/signin", formData);
    
        console.log("Response:", response.data); // Debugging
    
        if (response.status === 200) {
          localStorage.setItem("userToken", response.data.token);
          setMessage({ text: "Login successful! Redirecting...", type: "success" });
    
          setFormData({
            email: "",
            password: "",
          });
    
          setTimeout(() => navigate("/"), 1000);
        }
      } catch (err) {
        console.error("Login error:", err.response?.data || err.message);
    
        if (err.response) {
          switch (err.response.status) {
            case 403:
              setMessage({ text: "Account not approved by admin.", type: "error" });
              break;
            case 404:
              setMessage({ text: "User not found!", type: "error" });
              break;
            case 401:
              setMessage({ text: "Incorrect password!", type: "error" });
              break;
            default:
              setMessage({ text: "Login failed. Please try again.", type: "error" });
          }
        } else {
          setMessage({ text: "Network error. Please check your connection.", type: "error" });
        }
      }
  };
  
  return (
    <Layout>
      <div className="text-xs sm:text-base flex justify-center items-center min-h-screen">
        <div className="w-[30%] min-w-[250px] shadow-2xl shadow-gray-700/60 p-4 bg-white rounded-lg md:w-1/3 lg:w-1/4">
          <h1 className="text-center font-bold mb-5 ">User Login</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                name="email"
                onChange={handleChange}
                value={formData.email}
                required
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                onChange={handleChange}
                value={formData.password}
                required
              />
            </div>
            <button
              type="submit"
              className="link w-full py-2 rounded mt-3 transition-colors duration-500"
            >
              Login
            </button>
            {message.text && (
              <p
                className={`mt-3 text-center text-sm ${
                  message.type === "error" ? "text-red-600" : "text-green-600"
                }`}
              >
                {message.text}
              </p>
            )}

            <Link to="/forgotPassword" className="no-underline mt-2 me-0">
              Forgot Password?
            </Link>
            <p className="mt-2 text-center">
              Not registered?
              <span>
                <Link to="/signup" className="no-underline ms-2">
                  Register
                </Link>
              </span>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Signin;
