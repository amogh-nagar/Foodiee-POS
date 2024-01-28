import RoleCard from "./RoleCard";
import { useUpdateRoleMutation } from "../../services/role";
import { showToast } from "../../utils/constants";
import Loader from "../../UI/Loaders/Loader";
import useRTKMutation from "../../hooks/useRTKMutation";
const Roles = ({ roles, allPermissions, entityId }) => {
  const { trigger: updateRole } = useRTKMutation(useUpdateRoleMutation, Loader);
  const onEditBtnClick = async (values) => {
    try {
      await updateRole(values).unwrap();
      showToast("Role Updated Successfully", "success");
    } catch (err) {
      console.log("Some error occurred", err);
      showToast(err?.data?.message || "Some error occurred!");
    }
  };
  const onDeleteHandler = () => {};
  const validateUpdate = () => {};
  return (
    <div className="flex bg-primary-700 w-full items-center justify-start flex-wrap gap-5 mt-4 p-7 rounded-lg">
      {roles && roles.length ? (
        roles.map((role) => (
          <RoleCard
            key={role}
            entityId={entityId}
            role={role}
            onDeleteHandler={onDeleteHandler}
            onEditBtnClick={onEditBtnClick}
            validateUpdate={validateUpdate}
            allPermissions={allPermissions}
          />
        ))
      ) : (
        <div className="h-full w-full p-10 flex item-center justify-center">
          <h3>No Roles Found</h3>
        </div>
      )}
    </div>
  );
};

export default Roles;
