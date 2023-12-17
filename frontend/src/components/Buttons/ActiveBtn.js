import React from "react";

const ActiveBtn = ({ text, ...args }) => {
  let textToShow = text || "Active";
  return (
    <button {...args} className="text-white w-16 rounded-2xl bg-green-600">
      {textToShow}
    </button>
  );
};

export default ActiveBtn;
