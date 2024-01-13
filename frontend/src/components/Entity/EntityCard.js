import React from "react";
import "./EntityCard.css";
import { getColor } from "../../utils/constants";
import { Link } from "react-router-dom";
const EntityCard = React.forwardRef(
  ({ image, name, description, onClick, ...args }, ref) => {
    console.log(image, name)
    let styleObj = getColor(image, name);
    return (
      <Link to={{ pathname: "/brands", state: { selectedTenant: {_id: args?._id, name: name} } }}>
        <div
          onClick={() => {
            onClick(args?._id);
          }}
          ref={ref}
          style={styleObj}
          className="h-72 max-h-96 w-56 rounded-lg flex items-end cursor-pointer"
        >
          <div className="inner-div rounded-lg before:rounded-lg w-full h-32 max-h-80 px-2 py-3">
            <h4 className="text-xl">{name}</h4>
            <p className="text-md">{description}</p>
          </div>
        </div>
      </Link>
    );
  }
);

export default EntityCard;
