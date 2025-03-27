import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import { HiUserCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        console.log(" No token found in localStorage");
        return;
      }
      try {
        const decoded = jwtDecode(token); // Decode token

        setRole(decoded.role); // Set role

        if (!decoded.role) {
          console.error(" Role is missing in decoded token!");
        } else {
          console.log(" Role from token:", decoded.role);
        }
        const userId = decoded.id; // Extract user ID from token

        const response = await axios.get(
          `http://localhost:8000/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(decoded.role);

        setUser(response.data); // Set user data from backend
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) {
    return (
      <Layout>
        <div className="text-sm sm:text-base flex justify-center items-center min-h-screen  p-6">
          <p className="text-black text-xl font-semibold">Loading Profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-xs sm:text-base flex justify-center items-center min-h-screen p-4 sm:p-6">
        <div className="shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-md">
          {/* Profile Icon */}
          <div className="flex justify-center mb-4">
            <HiUserCircle className="text-6xl sm:text-7xl text-gray-700" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-center text-transparent">
            Profile
          </h1>

          <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 text-sm sm:text-lg break-words">
            <div className="flex justify-between">
              <label className="font-semibold text-gray-700">Name:</label>
              <p className="text-gray-800">{user.name}</p>
            </div>
            <div className="flex justify-between">
              <label className="font-semibold text-gray-700">Phone:</label>
              <p className="text-gray-800">{user.phone || "N/A"}</p>
            </div>
            <div className="flex justify-between">
              <label className="font-semibold text-gray-700">DOB:</label>
              <p className="text-gray-800">{user.dob || "N/A"}</p>
            </div>
            <div className="flex justify-between">
              <label className="font-semibold text-gray-700">Email:</label>
              <p className="text-gray-800 break-words">{user.email}</p>
            </div>
            <div className="flex justify-between">
              <label className="font-semibold text-gray-700">Gender:</label>
              <p className="text-gray-800">{user.gender || "N/A"}</p>
            </div>
          </div>

          {/* Admin Only Button */}
          {role === "admin" && (
            <div className="mt-4 sm:mt-6 text-center">
              <Link
                to="/pendingApproval"
                className="no-underline py-2 sm:py-3 px-3 sm:px-4 rounded-2xl transition-colors duration-300 link"
              >
                View Pending Approvals
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
