import React from "react";
import moment from "moment";
const PageNameWithDate = ({name}) => {
  return (
    <div className="border-b-gray-400 border-b-2 w-full px-7 py-5">
      <h2 className="text-4xl">{name}</h2>
      <p className="py-2">{moment().format("DD/MM/YYYY")}</p>
    </div>
  );
};

export default PageNameWithDate;
