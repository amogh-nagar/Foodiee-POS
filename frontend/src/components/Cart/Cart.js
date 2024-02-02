import { useSelector } from "react-redux";
import { currencyMap } from "../../utils/constants";
import CheckOutModal from "../Modals/CheckOutModal";
import CartItem from "./CartItem";
const Cart = ({ currency = "INR" }) => {
  var cart = useSelector((state) => state.cart);
  const cartItems = cart.items ?? [];
  let popUpButton = (
    <button className="rounded-2xl text-lg font-bold bg-slate-200 hover:bg-white text-primary-600 w-full h-12">
      Checkout
    </button>
  );
  const isItemsAvailable = cartItems && Object.keys(cartItems).length > 0;
  if (!isItemsAvailable) {
    popUpButton = (
      <button
        disabled
        className="rounded-2xl opacity-10 backdrop-blur-sm text-lg font-bold bg-white text-primary-600 w-full h-12"
      >
        Checkout
      </button>
    );
  }
  return (
    <div className="w-3/12 h-full p-5">
      <div className="w-full h-5">
        <h3 className="text-xl font-semibold">Cart</h3>
      </div>
      <div className="flex flex-col justify-between items-center h-[90%]">
        <div className="w-full overflow-auto my-4">
          <ul className="w-full h-full overflow-auto hide-scrollbar">
            {isItemsAvailable ? (
              Object.entries(cartItems).map(([index, item]) => {
                return <CartItem item={item} key={index} />;
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
        <div className="bg-primary-700 w-full p-8 rounded-md">
          <div className="h-44">
            <div className="text-2xl flex justify-between">
              <h2>Total</h2>
              <p>
                {currencyMap[currency]}
                {cart.totalPrice ?? 0}
              </p>
            </div>
          </div>
          <div>
            <div>
              <CheckOutModal PopUpButton={popUpButton} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
