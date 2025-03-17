import React, { useState, useEffect } from "react";
import Layout from "../../Layout/Layout";
import { HiUserCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null); // Store user details
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
            console.error("❌ Role is missing in decoded token!");
          } else {
            console.log("✅ Role from token:", decoded.role);
          }





        const userId = decoded.id; // Extract user ID from token

        const response = await axios.get(`http://localhost:8000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(decoded.role)

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
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-800 to-purple-700 p-6">
          <p className="text-white text-xl font-semibold">Loading Profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-800 to-purple-700 p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          {/* Profile Icon */}
          <div className="flex justify-center mb-4">
            <HiUserCircle className="text-7xl text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">
            Profile
          </h1>

          <div className="mt-6 space-y-4 text-lg">
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
              <p className="text-gray-800">{user.email}</p>
            </div>
            <div className="flex justify-between">
              <label className="font-semibold text-gray-700">Gender:</label>
              <p className="text-gray-800">{user.gender || "N/A"}</p>
            </div>
          </div>

          {/* Admin Only Button */}
          {role === "admin" && (
            <div className="mt-6 text-center">
              <Link
                to="/pendingApproval"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white no-underline px-6 py-2 rounded-lg text-lg font-semibold shadow-lg"
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
