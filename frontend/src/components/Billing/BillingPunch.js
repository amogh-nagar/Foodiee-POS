import BillingCategories from "./BillingCategories";
import BillingItems from "./BillingItems";
import BillingSuperCategories from "./BillingSuperCategories";

const BillingPunch = () => {
  return (
  <div className="h-full w-9/12 py-4 px-10 flex flex-col gap-3">
      <BillingSuperCategories/>
      <BillingCategories/>
      <BillingItems/>
    </div>
  );
};

export default BillingPunch;
