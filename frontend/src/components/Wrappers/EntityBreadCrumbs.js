import EntityBreadcrumbItem from "./EntityBreadCrumbItem";
const EntityBreadCrumbsWrapper = ({ options: breadcrumbOptions }) => (
  <ul className="flex items-center gap-x-1 w-full">
    {breadcrumbOptions.map((item, index) => (
      <EntityBreadcrumbItem
        key={index}
        item={item}
        isLast={index === breadcrumbOptions.length - 1}
      />
    ))}
  </ul>
);

export default EntityBreadCrumbsWrapper;
