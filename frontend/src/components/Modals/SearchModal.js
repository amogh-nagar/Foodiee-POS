import { TbListSearch } from "react-icons/tb";
import Popup from "reactjs-popup";
import ReactPaginate from "react-paginate";
const SearchModal = ({ PopUpButton, searchText, elements, Card }) => {
  return (
    <Popup
      trigger={PopUpButton}
      modal
      nested
      overlayStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      {(close) => (
        <div className="modal bg-slate-900 text-white w-full">
          <div className="header px-5 py-3 flex items-center gap-x-2">
            <TbListSearch className="w-7 h-7 text-secondary-600" />
            <input
              className="w-full bg-transparent outline-none"
              placeholder={`Search ${searchText}`}
            />
          </div>
          <div className=" px-5 py-3 flex justify-start items-start flex-wrap gap-x-3 gap-y-2 overflow-y-auto h-[35rem] w-[65vw] hide-scrollbar content-start">
            {elements.map((item, index) => (
              <Card key={index} {...item} />
            ))}
          </div>
          <div className="w-full flex items-center">
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              breakClassName=""
              containerClassName="bg-primary-700 h-12 px-3 flex items-center gap-x-3 w-fit m-auto rounded-xl "
              pageClassName="bg-primary-100 rounded-xl hover:bg-slate-500 w-8 h-8 flex items-center justify-center"
              activeClassName="bg-slate-500"
              previousClassName="rounded-xl bg-secondary-700 w-8 h-8 flex items-center justify-center"
              nextClassName="rounded-xl bg-secondary-700 w-8 h-8 flex items-center justify-center"
              disabledClassName=""
              pageRangeDisplayed={5}
              pageCount={5}
              previousLabel="<"
              renderOnZeroPageCount={null}
            />
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
