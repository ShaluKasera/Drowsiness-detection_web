import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../Layout/Layout";

const PendingApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem("userToken");

  // Fetch pending users from backend
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/unapproved-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching unapproved users:", error);
        setLoading(false);
      }
    };
    fetchPendingUsers();
  }, [token]);

  // Approve user
  const handleApprove = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/approve-user",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("API Response:", response); // Log the response for debugging
  
      setPendingUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
      setMessage({ text: "User approved successfully!", type: "success" });
    } catch (error) {
      console.error("Axios error:", error);
  
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
        console.error("Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received. Request details:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
  
      setMessage({ text: "Failed to approve user.", type: "error" });
    }
  };
  

  // Reject user
  const handleReject = async (email) => {
    try {
      await axios.post(
        "http://localhost:8000/reject-user",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingUsers(pendingUsers.filter((user) => user.email !== email));
      setMessage({ text: "User rejected and deleted!", type: "success" });
    } catch (error) {
      console.error("Error rejecting user:", error);
      setMessage({ text: "Failed to reject user.", type: "error" });
    }
  };

  return (
    <Layout>
      <div className="text-xs sm:text-base min-h-screen flex flex-col items-center p-6 ">
        <h1 className="text-3xl font-bold text-white mb-6">Pending Approvals</h1>

        {message && (
          <p className={`mb-4 text-lg ${message.type === "error" ? "text-red-800" : "text-green-800"}`}>
            {message.text}
          </p>
        )}

        {loading ? (
          <p className="text-white text-lg">Loading pending approvals...</p>
        ) : pendingUsers.length > 0 ? (
          <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-900">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3 flex justify-center space-x-3">
                      <button
                        onClick={() => handleApprove(user.email)}
                        className="link px-3 py-1 rounded transition-colors duration-500 me-3"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(user.email)}
                        className="bg-gray-500 text-white px-4 py-1 rounded  hover:bg-gray-800 transition-colors duration-500"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white text-lg mt-6">No pending approvals</p>
        )}
      </div>
    </Layout>
  );
};

export default PendingApproval;
