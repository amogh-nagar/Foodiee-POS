import React from "react";

const FlexDiv = ({ className, items, Component, ...args }) => {
  return (
    <div className={"flex items-center flex-wrap gap-x-5 gap-y-4 " + className}>
      {items &&
        items.map((item, index) => (
          <Component key={index} {...item} {...args} />
        ))}
    </div>
  );
};

export default FlexDiv;
