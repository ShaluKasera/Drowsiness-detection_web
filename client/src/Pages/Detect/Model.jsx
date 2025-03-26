import React, { useRef, useState } from "react";
import Layout from "../../Layout/Layout";

const Model = () => {
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true }); // Request camera access
      setStream(videoStream);
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }
      setCameraOn(true); // ✅ Show the video
    } catch (error) {
      console.error("Error accessing the camera: ", error);
      alert("Please allow camera access.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop()); // ✅ Properly stop all tracks
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOn(false); // ✅ Hide the video
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen">
        {!cameraOn ? (
          <button
            onClick={startCamera}
            className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-800 transition"
          >
            Start Camera
          </button>
        ) : (
          <div className="flex flex-col items-center">
            <video
              ref={videoRef}
              autoPlay
              className="mt-4 border-4 border-gray-300 rounded-lg shadow-md"
              width="640"
              height="480"
            />
            <button
              onClick={stopCamera}
              className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl shadow-md hover:bg-red-800 transition"
            >
              Stop Camera
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Model;
