import React from "react";
import "./Loader.css";
const Loader = () => {
  return (
    <div className="w-screen h-screen bg-primary-200 flex justify-center items-center">
      <div className="sk-folding-cube">
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>
    </div>
  );
};

export default Loader;
