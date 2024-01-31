import PageNameWithDate from "../components/PageNameWithDate";
import Cart from "../components/Cart/Cart";
import BillingPunch from "../components/Billing/BillingPunch";
const Billing = () => {
  return (
    <div className="w-full h-full hide-scrollbar nonScrollable-div">
      <PageNameWithDate name="Billing" />
      <div className="w-full h-full flex overflow-hidden">
        <BillingPunch />
        <Cart />
      </div>
    </div>
  );
};

export default Billing;
