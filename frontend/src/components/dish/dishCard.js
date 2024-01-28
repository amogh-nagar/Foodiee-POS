import { CiEdit } from "react-icons/ci";
import { checkForSame, getColor, showToast } from "../../utils/constants";
import Modal from "../Modals/Modal";
const DishCard = ({ image, name, rate, description, onSubmit, _id }) => {
  let styleObj = getColor(image, name);
  const initialValues = {
    name,
    description,
    rate,
  };
  return (
    <div className="bg-primary-700 shadow-lg shadow-primary-700 w-48 h-60 border-2 border-[#393C49] rounded-xl">
      <div className="w-full py-2 h-4/5 flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-full" style={styleObj}></div>
        <div className="w-full flex items-center justify-start flex-col py-3">
          <p className="text-base">{name}</p>
          <p className="text-sm text-gray-400">{rate}</p>
        </div>
      </div>
      <Modal
        PopUpButton={
          <button className="w-full h-1/5 flex justify-center items-center bg-secondary-light text-secondary-700 gap-x-2 text-lg rounded-b-xl">
            <CiEdit />
            <p>Edit</p>
          </button>
        }
        isForm={true}
        HeaderText={() => "Update Dish"}
        initialValues={initialValues}
        onSubmit={(values) => {
          if (!checkForSame(values, initialValues)) {
            onSubmit({
              ...values,
              dishId: _id
            })
          } else showToast("Nothing to Update", "info");
        }}
        fields={[
          {
            type: "text",
            name: "name",
            label: "Name",
            placeholder: "Dish Name",
          },
          {
            type: "textarea",
            name: "description",
            label: "Description",
            placeholder: "Dish Description",
          },
          {
            type: "file",
            name: "image",
            label: "Image",
            placeholder: "Category Image",
          },
          {
            type: "number",
            name: "rate",
            label: "Rate",
            placeholder: "Dish Rate",
          },
        ]}
        buttonText="Update"
      />
    </div>
  );
};

export default DishCard;
