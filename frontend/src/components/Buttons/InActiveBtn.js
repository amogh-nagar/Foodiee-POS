import React from "react";

const InActiveBtn = ({ text, ...args }) => {
  let textToShow = text || "Inactive";
  return (
    <button {...args} className="text-white w-20 rounded-2xl bg-red-600">
      {textToShow}
    </button>
  );
};

export default InActiveBtn;
