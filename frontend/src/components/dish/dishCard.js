import { CiEdit } from "react-icons/ci";
import { getColor } from "../../utils/constants";
const DishCard = ({ img , name = "XYZ", price = 12 }) => {
  let styleObj = getColor(img, name);
  return (
    <div className="bg-primary-700 shadow-lg shadow-primary-700 w-48 h-60 border-2 border-[#393C49] rounded-xl">
      <div className="w-full py-2 h-4/5 flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full" style={styleObj}></div>
        <div className="w-full flex items-center justify-start flex-col py-3">
            <p className="text-base">{name}</p>
            <p className="text-sm text-gray-400">{price}</p>
        </div>
      </div>
      <button className="w-full h-1/5 flex justify-center items-center bg-secondary-light text-secondary-700 gap-x-2 text-lg rounded-b-xl">
        <CiEdit />
        <p>Edit</p>
      </button>
    </div>
  );
};

export default DishCard;
