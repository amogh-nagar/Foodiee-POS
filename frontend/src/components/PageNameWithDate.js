import React from "react";
import moment from "moment";
const PageNameWithDate = ({ name, searchBox }) => {
  return (
    <div className="border-b-gray-400 border-b-2 w-full px-7 py-3 flex justify-between">
      <div className="w-6/12 flex items-end gap-x-4">
        <h2 className="text-4xl">{name}
        </h2>
        <span className="py-2 text-sm">({moment().format("DD/MM/YYYY")})</span>
      </div>
      {searchBox && (
        <div className="w-6/12 flex items-end justify-end">
          <input
            className="bg-gray-600 text-white font-sans p-2 rounded-lg w-8/12 outline-none"
            placeholder="Search for food, coffee etc."
          />
        </div>
      )}
    </div>
  );
};

export default PageNameWithDate;
