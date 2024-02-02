import { TbListSearch } from "react-icons/tb";
import Popup from "reactjs-popup";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
const SearchModal = ({ PopUpButton, searchText, elements, Card }) => {
  return (
    <Popup
      trigger={PopUpButton}
      modal
      nested
      overlayStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      {(close) => (
        <div className="modal relative bg-slate-900 text-white w-full">
          <div className="header px-5 py-3 bg-secondary-dark rounded-t-lg flex items-center gap-x-2">
            <TbListSearch className="w-7 h-7 text-secondary-600" />
            <input
              className="w-full bg-transparent outline-none"
              placeholder={`Search ${searchText}`}
            />
          </div>
          <div className=" px-16 py-3 flex justify-start items-start flex-wrap gap-x-3 gap-y-2 overflow-y-auto h-[35rem] w-[65vw] hide-scrollbar content-start">
            {elements.map((item, index) => (
              <Card key={index} {...item} />
            ))}
          </div>
          <div className="absolute px-4 top-[50%] w-full flex items-center justify-between">
            <button>
              <FaCircleChevronLeft className="w-8 h-8 text-secondary-500" />
            </button>
            <button>
              <FaCircleChevronRight className="w-8 h-8 text-secondary-500" />
            </button>
          </div>
          <div className="actions px-5 py-3">
            <button
              className="button text-base w-20 h-9 bg-secondary-500 hover:bg-secondary-700"
              onClick={() => {
                close();
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default SearchModal;
