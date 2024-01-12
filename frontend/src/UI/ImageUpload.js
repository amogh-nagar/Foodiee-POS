import React, { useRef, useState } from "react";

const ImageUpload = ({ field, form: { touched, errors }, ...props }) => {
  const isError = touched[field.name] && errors[field.name];
  const [image, setImage] = useState(null);
  const [styleObj, setstyleObj] = useState({});
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleFile = (file) => {
    setImage(file);
    let obj = {};
    obj.backgroundImage =
      "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), url(" +
      URL.createObjectURL(file) +
      ")";
    obj.backgroundSize = "cover";
    obj.color = "white";
    obj.backgroundPosition = "center";
    setstyleObj(obj);
  };
  const handleOnDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let imageFile = event.dataTransfer.files[0];
    handleFile(imageFile);
  };
  const fileInput = useRef(null);
  return (
    <div className="my-2">
      <label className="block mb-1 text-gray-400" htmlFor={field.name}>
        {props.label}
      </label>
      <div className="w-full flex items-center justify-between gap-x-6">
        <div
          onDragOver={handleDragOver}
          onDrop={handleOnDrop}
          onClick={() => fileInput.current.click()}
          className="cursor-pointer bg-primary-700 shadow-lg shadow-primary-700 w-1/2 h-36 border-2 border-dashed border-secondary-500 text-secondary-500 rounded-xl flex items-center justify-center"
        >
          Click to Select or Drag and Drop File Here
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>
        <div
          style={styleObj}
          className="bg-primary-700 shadow-lg shadow-primary-700 w-1/2 h-36 text-secondary-500 rounded-xl flex items-center justify-center"
        >
          {styleObj.backgroundImage ? image.name : <p>Preview</p>}
        </div>
      </div>
      {isError && (
        <div className="text-warning-500 text-sm mt-1">
          {errors[field.name]}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
