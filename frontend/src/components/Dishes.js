import React from "react";
import DishCard from "./dish/dishCard";
import { IoMdAdd } from "react-icons/io";
import Modal from "./Modals/Modal";
import MultiStepModal from "./Modals/MultiStepModal";
const Dishes = () => {
  return (
    <div className="py-4 px-5 flex flex-wrap gap-x-4 gap-y-3">
      <div className="cursor-pointer bg-primary-700 shadow-lg shadow-primary-700 w-48 h-60 border-2 border-dashed border-secondary-500 text-secondary-500 rounded-xl">
        <Modal
          PopUpButton={
            <div className="w-full h-full flex flex-col items-center justify-center">
              <IoMdAdd />
              <p>Add Dish</p>
            </div>
          }
          HeaderText={() => <h3>Add New Dish</h3>}
          BodyContent={() => <div>
            <h3>Hello</h3>
          </div>}
        />
      </div>
    </div>
  );
};

export default Dishes;
