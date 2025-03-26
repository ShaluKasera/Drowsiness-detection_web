import React from "react";
import Layout from "../../Layout/Layout";
import { Link } from "react-router-dom";
import Pic from "../../assets/drowzyPerson.avif";
const Home = () => {
  return (
    <Layout>
      <div className=" container my-5 ">
        <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
          <div className="col-lg-7 p-3 p-lg-5 pt-lg-3 text-center lg:text-start">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-body-emphasis">
              Detect Drowsiness Before It's Too Late
            </h1>
            <p className="text-sm sm:text-base lg:text-lg">
              Our AI-powered system monitors signs of drowsiness in real-time
              and alerts you instantly. Whether driving or working late, stay
              safe and alert with smart fatigue detection.
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
              <Link
                to="/livedetect"
                type="button"
                className="no-underline link text-center py-2 rounded-2xl transition-colors duration-500 px-5 fw-bold"
              >
                Try Now
              </Link>
            </div>
          </div>

          <div className="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
            <img className="rounded-2xl" src={Pic} alt="" width="720" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
