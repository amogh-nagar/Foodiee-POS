import { AiOutlineHome } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import Home from "../pages/Home";
import Analysis from "../pages/Analysis";
export const routesList = [
  {
    path: "/",
    text: "Home",
    icon: <AiOutlineHome className="w-10 h-10 icon" />,
    component: <Home />,
  },
  {
    path: "/analysis",
    text: "Analysis",
    icon: <FiSettings className="w-10 h-10 icon" />,
    component: <Analysis />,
  },
];
