import React from "react";

const FlexDiv = ({ className, items, Component }) => {
  return (
    <div className={"flex items-center flex-wrap gap-x-5 gap-y-4 " + className}>
      {items.map((item, index) => (
        <Component key={index} {...item} />
      ))}
    </div>
  );
};

export default FlexDiv;
