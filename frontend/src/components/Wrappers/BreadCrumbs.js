import BreadCrumbItem from "./BreadCrumbItem";
const Breadcrumbs = ({ breadcrumbItems }) => (
  <ul className="flex items-center gap-x-1 w-full px-4 my-3">
    {breadcrumbItems.map((item, index) => {
      const isLast = index === breadcrumbItems.length - 1;
      return (
        <li
          key={index}
          className={`flex items-center text-sm ${
            isLast ? "text-orange-500" : "text-gray-400"
          }`}
        >
          {item.type == "array" ? (
            <BreadCrumbItem item={item} isLast={isLast} />
          ) : (
            <span className="cursor-default">{item.title}</span>
          )}

          {!isLast && <span className="mx-2">/</span>}
        </li>
      );
    })}
  </ul>
);

export default Breadcrumbs;
