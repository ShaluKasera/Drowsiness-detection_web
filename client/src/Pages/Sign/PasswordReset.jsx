import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const PasswordReset = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Password do not match. please");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/reset-password/${resetToken}`,
        { newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.msg || "Error resetting password.");
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen  p-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-center text-xl font-semibold text-gray-700 mb-4">
            Reset Password
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="block text-gray-600 mb-1">
                Enter your New Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-gray-200 outline-none"
                id="newPassword"
                placeholder="Enter your new password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-600 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-gray-200 outline-none"
                id="confirmPassword"
                placeholder="Confirm password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full link py-2 rounded transition-colors duration-500"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PasswordReset;
