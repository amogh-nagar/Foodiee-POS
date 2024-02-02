import { useSelector } from "react-redux";
import Popup from "reactjs-popup";
import CheckOutItem from "../Cart/CheckOutItem";
import { useState } from "react";
import { checkoutMethods } from "../../utils/constants";
const CheckOutModal = ({ PopUpButton, currency = "INR" }) => {
  var cart = useSelector((state) => state.cart);
  const cartItems = cart.items ?? [];
  const isItemsAvailable = cartItems && Object.keys(cartItems).length > 0;
  const [checkoutMethod, setCheckoutMethod] = useState("Cash");
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: "",
    mobile: null,
    address: "",
  });
  const checkoutHandler = () => {};
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
            <p>CheckOut</p>
          </div>
          <div className="px-5 py-3 flex justify-between items-center flex-wrap gap-x-3 gap-y-2 h-[38rem] w-[68vw] hide-scrollbar content-start">
            <div className="flex flex-1 justify-start items-start h-full">
              <ul className="w-full flex flex-col gap-y-4 h-full overflow-auto hide-scrollbar">
                {cartItems && Object.keys(cartItems).length > 0 ? (
                  Object.entries(cartItems).map(([index, item]) => {
                    return <CheckOutItem item={item} key={index} />;
                  })
                ) : (
                  <div>
                    <h4 className="text-slate-300">
                      No Cart Items Found, Punch Some Items!
                    </h4>
                  </div>
                )}
              </ul>
            </div>
            <div className="flex flex-col justify-between items-center h-full">
              <div className="w-full">
                <div className="my-2 w-full">
                  <label className="block mb-1 text-gray-400" htmlFor={"name"}>
                    Name
                  </label>
                  <input
                    placeholder="Customer Name"
                    minLength={1}
                    onChange={(e) =>
                      setCustomerForm((prev) => {
                        return {
                          ...prev,
                          name: e.target.value,
                        };
                      })
                    }
                    className="border-2 rounded-xl border-primary-700 p-2 w-full focus:outline-none focus:border-neutral-400 bg-slate-600 relative right-1"
                  />
                </div>
                <div className="my-2 w-full">
                  <label className="block mb-1 text-gray-400" htmlFor={"name"}>
                    Email
                  </label>
                  <input
                    placeholder="Customer Email"
                    type="email"
                    onChange={(e) =>
                      setCustomerForm((prev) => {
                        return {
                          ...prev,
                          email: e.target.value,
                        };
                      })
                    }
                    className="border-2 rounded-xl border-primary-700 p-2 w-full focus:outline-none focus:border-neutral-400 bg-slate-600 relative right-1"
                  />
                </div>
                <div className="my-2 w-full">
                  <label className="block mb-1 text-gray-400" htmlFor={"name"}>
                    Mobile
                  </label>
                  <input
                    placeholder="Customer Mobile"
                    type="mobile"
                    minLength={1}
                    onChange={(e) =>
                      setCustomerForm((prev) => {
                        return {
                          ...prev,
                          mobile: e.target.value,
                        };
                      })
                    }
                    className="border-2 rounded-xl border-primary-700 p-2 w-full focus:outline-none focus:border-neutral-400 bg-slate-600 relative right-1"
                  />
                </div>
                <div className="my-2 w-full">
                  <label className="block mb-1 text-gray-400" htmlFor={"name"}>
                    Address
                  </label>
                  <textarea
                    placeholder="Customer Address"
                    minLength={1}
                    onChange={(e) =>
                      setCustomerForm((prev) => {
                        return {
                          ...prev,
                          address: e.target.value,
                        };
                      })
                    }
                    className="border-2 rounded-xl border-primary-700 p-2 w-full focus:outline-none focus:border-neutral-400 bg-slate-600 relative right-1"
                  />
                </div>
              </div>
              <div className=" w-[20rem]">
                <div className="h-28 w-full">
                  <div className="mb-2">
                    <h3 className="font-semibold text-base">Payment Methods</h3>
                  </div>
                  <div className="flex w-full justify-between items-cente">
                    {checkoutMethods.map((method, index) => {
                      return (
                        <div
                          className="w-4/12 flex-col flex items-center justify-center mr-2"
                          key={index}
                        >
                          <button
                            onClick={() => setCheckoutMethod(method.name)}
                            className={`border-2 w-20 h-11 justify-center flex items-center rounded-xl border-gray-500 ${
                              checkoutMethod === method.name
                                ? "hover:bg-primary-700 border-secondary-600 bg-secondary-600"
                                : "border-gray-500 hover:border-secondary-600 hover:bg-secondary-600"
                            }`}
                          >
                            {method.icon}
                          </button>
                          <p>{method.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  {isItemsAvailable ? (
                    <button
                      onClick={checkoutHandler}
                      className="rounded-2xl text-lg font-bold bg-slate-200 hover:bg-white text-primary-600 w-full h-12"
                    >
                      Place Order
                    </button>
                  ) : (
                    <button
                      disabled
                      className="rounded-2xl opacity-10 backdrop-blur-sm text-lg font-bold bg-white text-primary-600 w-full h-12"
                    >
                      Place Order
                    </button>
                  )}
                </div>
              </div>
            </div>
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

export default CheckOutModal;
