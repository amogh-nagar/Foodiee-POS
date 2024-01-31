import React from "react";

const SuperCategoryCard = ({ item }) => {
  return (
    <div
      onClick={() => {}}
      className="font-sans bg-slate-400 px-2 py-1 w-20 h-10 flex items-center justify-center rounded-2xl text-white"
    >
      <p>{item.name}</p>
    </div>
  );
};

export default SuperCategoryCard;
