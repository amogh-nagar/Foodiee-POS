import React, { useEffect, useState } from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import { useLocation } from "react-router-dom";
import { useGetAllTenantsQuery } from "../services/tenant";
import {
  useCreateBrandMutation,
  useGetAllBrandsQuery,
  useUpdateBrandMutation,
} from "../services/brand";
import EntityCard from "../components/Entity/EntityCard";
import { itemsPerPage, showToast } from "../utils/constants";
import FlexDiv from "../components/Wrappers/FlexDiv";
import ReactPaginate from "react-paginate";
import SearchDiv from "../components/Containers/SearchDiv";
import { useDispatch, useSelector } from "react-redux";
import { alterFilters } from "../store/uiSlice";
import useRTKMutation from "../hooks/useRTKMutation";
import useRTKQuery from "../hooks/useRTKQuery";
const Brands = () => {
  const location = useLocation();
  let selectedTenant = useSelector((state) => state.ui.filters.selectedTenant);
  const dispatch = useDispatch();
  selectedTenant = selectedTenant ?? {};
  const [page, setPage] = useState(1);
  const [searchedTerm, setSearchedTerm] = useState("");
  const { trigger: createBrand } = useRTKMutation(useCreateBrandMutation);
  const { trigger: updateBrand } = useRTKMutation(useUpdateBrandMutation);
  const auth = useSelector((state) => state.auth);
  const { data } = useRTKQuery(
    useGetAllBrandsQuery,
    {
      ...auth.brandsQuery,
      tenantId : selectedTenant?.value,
      name: searchedTerm,
      page: page,
    },
    {
      skip: !selectedTenant.value && !auth.brandIds,
    }
  );
  const totalItems = data?.totalItems ?? 0;
  let brands = data?.brands ?? [];
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
      formData.append("tenantId", selectedTenant.value);
      formData.append("tenantName", selectedTenant.label);
      await createBrand(formData).unwrap();
      showToast("Brand Created Successfully", "success");
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
      formData.append("tenantId", selectedTenant.value);
      await updateBrand(formData).unwrap();
      showToast("Brand Updated Successfully", "success");
    } catch (err) {
      console.log("Some error occurred", err);
      showToast(err?.data?.message || "Some error occurred!");
    }
  };

  const handleSelectChange = (option) => {
    dispatch(
      alterFilters({
        type: "SET_FILTER",
        name: "selectedTenant",
        value: option,
      })
    );
  };
  return (
    <div>
      <PageNameWithDate
        name="Brands"
        isMultiSelect={true}
        defaultValue={selectedTenant}
        handleSelectChange={handleSelectChange}
        useGetOptionsQuery={useGetAllTenantsQuery}
        skip={!auth.isSuperAdmin && !auth.tenantIds}
        inputQuery={auth.tenantsQuery}
        field={"tenants"}
      />
      <div>
        <>
          <SearchDiv
            name={"Brand"}
            setSearchedTerm={setSearchedTerm}
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
            fields={[
              {
                type: "text",
                name: "name",
                label: "Name",
                placeholder: "Brand Name",
              },
              {
                type: "textarea",
                name: "description",
                label: "Description",
                placeholder: "Brand Description",
              },
              {
                type: "file",
                name: "image",
                label: "Image",
                placeholder: "Brand Image",
              },
            ]}
          />
          <div className="mx-3">
            {brands?.length ? (
              <>
                <FlexDiv
                  className="gap-y-4"
                  Component={EntityCard}
                  items={brands}
                  entityIdType="tenantId"
                  showEditBtn={true}
                  cardOnClickURL="/outlets"
                  validateUpdate={validate}
                  onEditBtnClick={onEditBtnClick}
                  updateHeaderText={() => <h3>Update Brand</h3>}
                  updateFields={[
                    {
                      type: "text",
                      name: "name",
                      label: "Name",
                      placeholder: "Brand Name",
                    },
                    {
                      type: "textarea",
                      name: "description",
                      label: "Description",
                      placeholder: "Brand Description",
                    },
                    {
                      type: "file",
                      name: "image",
                      label: "Image",
                      placeholder: "Brand Image",
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
                <h4>No Brands Available</h4>
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default Brands;
