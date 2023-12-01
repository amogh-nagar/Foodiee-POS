import { RiHomeSmile2Line } from "react-icons/ri";
import { MdOutlineAutoGraph } from "react-icons/md";
import { BsFillMenuButtonWideFill } from "react-icons/bs"
import Dashboard from "../pages/Dashboard";
import Analysis from "../pages/Analysis";
import Billing from "../pages/Billing";
import Profile from "../pages/Profile";
export const routesList = [
  {
    path: "/",
    text: "Dashboard",
    icon: <RiHomeSmile2Line className="w-10 h-10 icon" />,
    component: <Dashboard />,
    permissions : ['isVisitDashboardPage']
  },
  {
    path: "/billing",
    text: "Billing",
    icon: <BsFillMenuButtonWideFill className="w-10 h-10 icon" />,
    component: <Billing />,
    permissions:['isVisitBillingPage']
  },
  {
    path: "/analysis",
    text: "Analysis",
    icon: <MdOutlineAutoGraph className="w-10 h-10 icon" />,
    component: <Analysis />,
    permissions:['isVisitAnalysisPage']
  },
  {
    path: "/profile",
    text: "Profile",
    component: <Profile />,
    onlyRoute: true,
    permissions:[]
  }
];