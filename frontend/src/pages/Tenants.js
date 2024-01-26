import React, { useEffect, useState } from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import EntityCard from "../components/Entity/EntityCard";
import debounce from "lodash.debounce";
import {
  useCreateTenantMutation,
  useDeleteTenantMutation,
  useGetAllTenantsQuery,
  useUpdateTenantMutation,
} from "../services/tenant";
import ReactPaginate from "react-paginate";
import FlexDiv from "../components/Wrappers/FlexDiv";
import Loader from "../UI/Loaders/Loader";
import { itemsPerPage, showToast } from "../utils/constants";
import SearchDiv from "../components/Containers/SearchDiv";
import { useSelector } from "react-redux";
const Tenants = () => {
  const [page, setPage] = useState(1);
  const [searchedTerm, setSearchedTerm] = useState("");
  const [
    createTenant,
    { isLoading: isCreateTenantLoading, isError: isCreateTenantError },
  ] = useCreateTenantMutation();
  const [
    updateTenant,
    { isLoading: isUpdateTenantLoading, isError: isUpdateTenantError },
  ] = useUpdateTenantMutation();
  const [
    deleteTenant,
    { isLoading: isDeleteTenantLoading, isError: isDeleteTenantError },
  ] = useDeleteTenantMutation();
  const auth = useSelector((state) => state.auth);
  const {
    data,
    isError: isGetAllTenantsError,
    isLoading: isGetAllTenantsLoading,
  } = useGetAllTenantsQuery({
    name: searchedTerm,
    page: page,
    tenantIds: auth.tenantIds ?? '',
  });
  const totalItems = data?.totalItems ?? 0;
  const tenants = data?.tenants ?? [];
  const isLoading =
    isCreateTenantLoading ||
    isGetAllTenantsLoading ||
    isUpdateTenantLoading ||
    isDeleteTenantLoading;
  const isError =
    isCreateTenantError ||
    isGetAllTenantsError ||
    isUpdateTenantError ||
    isDeleteTenantError;
  const initialValues = {
    name: "",
    description: "",
    image: "",
  };
  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      for (var key in values) {
        formData.append(
          key,
          typeof values[key] === "string" ? values[key]?.trim() : values[key]
        );
      }
      await createTenant(formData).unwrap();
      showToast("Tenant Created Successfully", "success");
    } catch (err) {
      console.log("Some error occurred", err);
      showToast(err?.data?.message || "Some error occurred!");
    }
  };
  const validate = (values) => {
    const errors = {};

    if (!values.name || !values.name.length) {
      errors.name = "Name is required";
    }
    if (!values.description || !values.description.length) {
      errors.description = "Description is required";
    }

    return errors;
  };
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  const handlePageClick = (event) => {
    setPage(event.selected + 1);
  };
  const onEditBtnClick = async (values) => {
    try {
      const formData = new FormData();
      for (var key in values) {
        formData.append(
          key,
          typeof values[key] === "string" ? values[key]?.trim() : values[key]
        );
      }
      await updateTenant(formData).unwrap();
      showToast("Tenant Updated Successfully", "success");
    } catch (err) {
      console.log("Some error occurred", err);
      showToast(err?.data?.message || "Some error occurred!");
    }
  };
  return (
    <div>
      <PageNameWithDate name="Tenants" />
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <SearchDiv
              name={"Tenant"}
              setSearchedTerm={setSearchedTerm}
              initialValues={initialValues}
              onSubmit={onSubmit}
              validate={validate}
              fields={[
                {
                  type: "text",
                  name: "name",
                  label: "Name",
                  placeholder: "Tenant Name",
                },
                {
                  type: "textarea",
                  name: "description",
                  label: "Description",
                  placeholder: "Tenant Description",
                },
                {
                  type: "file",
                  name: "image",
                  label: "Image",
                  placeholder: "Tenant Image",
                },
              ]}
            />
            <div className="mx-3">
              {tenants?.length ? (
                <>
                  {" "}
                  <FlexDiv
                    className="gap-y-4"
                    Component={EntityCard}
                    items={tenants}
                    showEditBtn={true}
                    validateUpdate={validate}
                    onEditBtnClick={onEditBtnClick}
                    cardOnClickURL="/brands"
                    updateHeaderText={() => <h3>Update Tenant</h3>}
                    updateFields={[
                      {
                        type: "text",
                        name: "name",
                        label: "Name",
                        placeholder: "Tenant Name",
                      },
                      {
                        type: "textarea",
                        name: "description",
                        label: "Description",
                        placeholder: "Tenant Description",
                      },
                      {
                        type: "file",
                        name: "image",
                        label: "Image",
                        placeholder: "Tenant Image",
                      },
                      {
                        type: "toggle",
                        name: "isActive",
                        label: "Active",
                      },
                    ]}
                  />
                  {pageCount > 1 && (
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=">"
                      breakClassName=""
                      containerClassName="bg-primary-700 h-12 px-3 flex items-center gap-x-3 w-fit m-auto rounded-xl absolute bottom-4 left-1/2"
                      pageClassName="bg-primary-100 rounded-xl hover:bg-slate-500 w-8 h-8 flex items-center justify-center"
                      activeClassName="bg-slate-500"
                      previousClassName="rounded-xl bg-secondary-700 w-8 h-8 flex items-center justify-center"
                      nextClassName="rounded-xl bg-secondary-700 w-8 h-8 flex items-center justify-center"
                      disabledClassName=""
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel="<"
                      renderOnZeroPageCount={null}
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <h4>No Tenants Available</h4>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tenants;
