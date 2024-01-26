import React, { useEffect, useState } from "react";
import Modal from "./Modals/Modal";
import { IoMdAdd } from "react-icons/io";
import debounce from "lodash.debounce";

const SearchDiv = ({
  name,
  initialValues,
  onSubmit,
  validate,
  fields,
  setSearchedTerm,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const debouncer = debounce((newTerm) => {
      setSearchedTerm(newTerm);
    }, 1000);
    if (searchTerm) {
      debouncer(searchTerm);
    } else {
        setSearchedTerm("");
    }
    return () => {
      debouncer.cancel();
    };
  }, [searchTerm]);
  return (
    <div className=" items-center gap-x-3 mx-3 my-5 flex h-fit">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-gray-600 text-white font-sans p-2 rounded-lg outline-none w-[80%]"
        placeholder="Search Outlets"
      />
      <Modal
        PopUpButton={
          <button className="flex gap-x-1 items-center bg-secondary-500 p-3 rounded-lg">
            <IoMdAdd />
            <p>{name}</p>
          </button>
        }
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
