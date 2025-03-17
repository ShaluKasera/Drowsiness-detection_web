import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState(""); // Email input state
  const [submitted, setSubmitted] = useState(false); // Controls success message display
  const [loading, setLoading] = useState(false); // Loading state
  const [message, setMessage] = useState({ text: "", type: "" }); // Feedback message state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
  
    try {
      const response = await axios.post("http://localhost:8000/forgotpassword", {
        email,
      });
  
      if (response.status === 200) {
        setSubmitted(true);
        setMessage({
          text: "We've sent a password reset link to your email. Check your inbox and follow the instructions to reset your password.",
          type: "success",
        });
      } else {
        setMessage({
          text: "Failed to send reset link. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setMessage({
        text: error.response?.data?.msg || "Something went wrong. Try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="w-[90%] max-w-md bg-white  shadow-lg p-6 rounded-xl border border-white/20">
          {submitted ? (
            <div className="text-center mt-5">
              <FaCheckCircle className="text-green-400 text-6xl mx-auto animate-bounce" />
              <h1 className="text-2xl font-bold text-gray-900 mt-4">Email Sent Successfully </h1>
              <p className="text-gray-900 font-medium mt-3">{message.text}</p>
              <p className="text-gray-900 text-sm mt-2">
                If you don’t see the email, check your spam folder or try again later.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-3xl font-semibold text-center text-gray-900">
                Reset Your Password 🔐
              </h2>
              <p className="text-center text-gray-900">
                Enter your registered email, and we’ll send you a reset link.
              </p>

              <div className="flex flex-col">
                <label className="font-medium text-gray-900 mb-1">Email Address</label>
                <input
                  type="email"
                  className="p-3 border border-gray-900 rounded-lg bg-white/20 backdrop-blur-lg text-gray-900 focus:ring focus:ring-purple-200 outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-gray-200 font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              {/* Display error message if exists */}
              {message.text && !submitted && (
                <p
                  className={`text-center font-medium text-sm mt-3 ${
                    message.type === "error" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForgetPassword;
