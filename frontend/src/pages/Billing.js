import PageNameWithDate from "../components/PageNameWithDate";
import Cart from "../components/Cart";
import PunchItems from "../components/PunchItems";
const Billing = () => {
  return (
    <div className="w-full h-full hide-scrollbar nonScrollable-div">
      <PageNameWithDate name="Billing" searchBox={true} />
      <div className="w-full h-full flex overflow-hidden">
        <div className="h-full w-[74%]">
         <PunchItems/>
        </div>
        <div className="w-3/12 h-full p-5">
            <Cart/>
        </div>
      </div>
    </div>
  );
};

export default Billing;
