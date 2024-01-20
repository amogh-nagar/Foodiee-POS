import Select from "react-select";
import BreadcrumbItem from "./BreadcrumbItem";
const Breadcrumbs = ({ options: breadcrumbOptions }) => (
  <ul className="flex items-center gap-x-1 w-full">
    {breadcrumbOptions.map((item, index) => (
      <BreadcrumbItem
        key={index}
        item={item}
        isLast={index === breadcrumbOptions.length - 1}
      />
    ))}
  </ul>
);

export default Breadcrumbs;
