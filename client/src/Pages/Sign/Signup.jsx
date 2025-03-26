import React, { useState } from "react";
import Layout from "../../Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    phone: "",
    gender: "",
    email: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(
        "http://localhost:8000/signup",
        formData
      );

      console.log("Response:", response.data); // Debugging

      if (response.status === 201) {
        setMessage({
          text: "Signup successful! Awaiting admin approval.",
          type: "success",
        });

        setFormData({
          name: "",
          dob: "",
          phone: "",
          gender: "",
          email: "",
          password: "",
          role: "", // Reset role as well
        });

        setTimeout(() => navigate("/signin"), 2000); // Redirect to login page
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);

      if (err.response) {
        if (err.response.status === 400) {
          setMessage({ text: err.response.data.msg, type: "error" });
        } else if (err.response.status === 401) {
          setMessage({ text: err.response.data.message, type: "error" });
        } else {
          setMessage({
            text: "Signup failed. Please try again.",
            type: "error",
          });
        }
      } else {
        setMessage({
          text: "Network error. Please check your connection.",
          type: "error",
        });
      }
    }
  };

  return (
    <Layout>
      <div className="container col-xl-10 col-xxl-8 px-4 py-5 text-xs sm:text-base">
        <div className="row align-items-center g-lg-5 py-5">
          <div className="col-lg-6 text-center lg:text-start">
            <h1 className=" font-bold leading-tight text-body-emphasis mb-3">
              Stay Alert, Stay Safe!
            </h1>
            <p className="text-sm sm:text-base lg:text-2xl col-lg-10">
              Sign up to access our AI-powered drowsiness detection system.
              Whether you're a driver, a supervisor, or a safety manager, our
              smart technology helps you monitor alertness in real-time. Sign up
              now and take a step toward safer journeys!
            </p>
          </div>

          <div className="col-md-10 mx-auto col-lg-6 min-w-">
            <form
              className="p-4 p-md-5 border rounded-3 bg-body-tertiary"
              onSubmit={handleSubmit}
            >
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder=""
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingInput">
                  Enter your Name <span className="text-danger">*</span>
                </label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="DATE"
                  className="form-control"
                  id="floatingInput"
                  placeholder=""
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingInput">
                  Enter your DOB <span className="text-danger">*</span>
                </label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  placeholder=""
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingInput">
                  Enter your Phone <span className="text-danger">*</span>
                </label>
              </div>
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelect"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select your gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <label htmlFor="floatingSelect">
                  Gender <span className="text-danger">*</span>
                </label>
              </div>

              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="floatingSelect"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="user">Regular User</option>
                </select>
                <label htmlFor="floatingSelect">Role</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="example@gmail.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingInput">
                  Enter your Email<span className="text-danger">*</span>
                </label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="floatingPassword">
                  Password<span className="text-danger">*</span>
                </label>
              </div>

              <button className="w-100 link py-2 rounded transition-colors duration-500" type="submit">
                Sign up
              </button>
              {message.text && (
                <p
                  className={`mt-3 text-center text-sm ${
                    message.type === "error" ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {message.text}
                </p>
              )}
              <hr className="my-4" />
              <small className="text-body-secondary">
                By clicking Sign up, you agree to the{" "}
                <span>
                  <Link to="/terms" className="no-underline ms-1">
                    terms of use.
                  </Link>
                </span>
              </small>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
