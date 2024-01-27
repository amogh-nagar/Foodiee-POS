import React, { useEffect, useState } from "react";
import Modal from "../Modals/Modal";
import { IoMdAdd } from "react-icons/io";
import debounce from "lodash.debounce";

const SearchDiv = ({
  name,
  initialValues,
  onSubmit,
  validate,
  fields,
  setSearchedTerm,
  isDisabled = false,
  cntClass = "",
  buttonClass = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const debouncer = debounce((newTerm) => {
      setSearchedTerm(newTerm);
    }, 500);
    if (searchTerm) {
      debouncer(searchTerm);
    } else {
      setSearchedTerm("");
    }
    return () => {
      debouncer.cancel();
    };
  }, [searchTerm]);
  let popUpButton = (
    <button
      className={`flex ${buttonClass} gap-x-1 items-center bg-secondary-500 p-3 rounded-lg`}
    >
      <IoMdAdd />
      <p>{name}</p>
    </button>
  );

  if (isDisabled) {
    popUpButton = (
      <button
        disabled
        className={`flex ${buttonClass} items-center justify-between w-28 rounded-md opacity-50 bg-secondary-500 text-white px-3 py-2`}
      >
        <IoMdAdd />
        <p>{name}</p>
      </button>
    );
  }
  return (
    <div className={`items-center gap-x-3 mx-3 my-5 flex h-fit ${cntClass}`}>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-gray-600 text-white font-sans p-2 rounded-lg outline-none w-[80%]"
        placeholder={`Search ${name}`}
      />
      <Modal
        PopUpButton={popUpButton}
        validate={validate}
        isForm={true}
        HeaderText={() => <h3>Add New {name}</h3>}
        buttonText={"Create"}
        fields={fields}
        initialValues={initialValues}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default SearchDiv;
