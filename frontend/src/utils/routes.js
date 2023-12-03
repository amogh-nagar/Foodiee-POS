import { RiHomeSmile2Line } from "react-icons/ri";
import { MdOutlineAutoGraph } from "react-icons/md";
import { BsFillMenuButtonWideFill } from "react-icons/bs"
import { IoStorefrontSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { PiTreeStructureBold } from "react-icons/pi";
import { MdFastfood } from "react-icons/md";
import { GoGitBranch } from "react-icons/go";
import Dashboard from "../pages/Dashboard";
import Analysis from "../pages/Analysis";
import Billing from "../pages/Billing";
import Profile from "../pages/Profile";
import Tenants from "../pages/Tenants";
import Dishes from "../pages/Dishes";
import Brands from "../pages/Brands";
import Outlets from "../pages/Outlets";
import Users from "../pages/Users";
export const routesList = [
  {
    path: "/",
    text: "Dashboard",
    icon: <RiHomeSmile2Line className="w-10 h-10 icon" />,
    component: <Dashboard />,
    permissions : ['isVisitDashboardPage'],
    exact : true
  },
  {
    path: "/billing",
    text: "Billing",
    icon: <BsFillMenuButtonWideFill className="w-10 h-10 icon" />,
    component: <Billing />,
    permissions:['isVisitBillingPage'],
    exact : true
  },
  {
    path: "/analysis",
    text: "Analysis",
    icon: <MdOutlineAutoGraph className="w-10 h-10 icon" />,
    component: <Analysis />,
    permissions:['isVisitAnalysisPage'],
    exact : true
  },
  {
    path: "/profile",
    text: "Profile",
    component: <Profile />,
    onlyRoute: true,
    permissions:[],
    exact : true
  },
  {
    path: "/tenants",
    text: "Tenants",
    icon: <PiTreeStructureBold className="w-10 h-10 icon" />,
    component: <Tenants />,
    permissions:["isVisitTenantsPage"],
    exact : true
  },
  {
    path: "/brands",
    text: "Brands",
    icon: <GoGitBranch className="w-10 h-10 icon"/>,
    component: <Brands />,
    permissions:["isVisitBrandsPage"],
    exact : true
  },
  {
    path: "/dishes",
    text: "Dishes",
    icon: <MdFastfood className="w-10 h-10 icon"/>,
    component: <Dishes />,
    permissions:["isVisitDishesPage"]
  },
  {
    path: "/outlets",
    text: "outlets",
    icon: <IoStorefrontSharp className="w-10 h-10 icon"/>,
    component: <Outlets />,
    permissions:["isVisitOutletsPage"],
    exact : true
  },
  {
    path: "/users",
    text: "Users",
    icon: <FaUsers className="w-10 h-10 icon"/>,
    component: <Users />,
    permissions:["isVisitUsersPage"]
  }
];