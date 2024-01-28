import React, { useEffect, useState } from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import { useLocation } from "react-router-dom";
import {
  useCreateOutletMutation,
  useGetAllOutletsQuery,
  useUpdateOutletMutation,
} from "../services/outlet";
import { useGetAllBrandsQuery } from "../services/brand";
import EntityCard from "../components/Entity/EntityCard";
import { itemsPerPage, showToast } from "../utils/constants";
import FlexDiv from "../components/Wrappers/FlexDiv";
import Loader from "../UI/Loaders/Loader";
import ReactPaginate from "react-paginate";
import SearchDiv from "../components/Containers/SearchDiv";
import { useDispatch, useSelector } from "react-redux";
import { alterFilters } from "../store/uiSlice";
import useRTKMutation from "../hooks/useRTKMutation";
import useRTKQuery from "../hooks/useRTKQuery";

const Outlets = () => {
  const location = useLocation();
  let selectedBrand = useSelector((state) => state.ui.filters.selectedBrand);
  const dispatch = useDispatch();
  selectedBrand = selectedBrand ?? {};
  const [page, setPage] = useState(1);
  const [searchedTerm, setSearchedTerm] = useState("");
  const auth = useSelector((state) => state.auth);
  const { trigger: createOutlet } = useRTKMutation(useCreateOutletMutation);
  const { trigger: updateOutlet } = useRTKMutation(useUpdateOutletMutation);
  const { data } = useRTKQuery(
    useGetAllOutletsQuery,
    {
      ...auth.outletsQuery,
      brandId: selectedBrand.value,
      name: searchedTerm,
      page: page,
    },
    {
      skip: !selectedBrand.value && !auth.outletIds,
    }
  );
  const totalItems = data?.totalItems ?? 0;
  let outlets = data?.outlets ?? [];
  const initialValues = {
    name: "",
    address: "",
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
      selectedBrand.value && formData.append("brandId", selectedBrand.value);
      selectedBrand.tenantId &&
        formData.append("tenantId", selectedBrand.tenantId);
      await createOutlet(formData).unwrap();
      showToast("Outlet Created Successfully", "success");
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
    if (!values.address || !values.address.length) {
      errors.address = "Address is required";
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
      selectedBrand.value && formData.append("brandId", selectedBrand.value);
      await updateOutlet(formData).unwrap();
      showToast("Outlet Updated Successfully", "success");
    } catch (err) {
      console.log("Some error occurred", err);
      showToast(err?.data?.message || "Some error occurred!");
    }
  };

  const handleSelectChange = (option) => {
    dispatch(
      alterFilters({
        type: "SET_FILTER",
        name: "selectedBrand",
        value: option,
        resetFields: ["selectedSuperCategory", "selectedCategory"],
      })
    );
  };
  return (
    <div>
      <PageNameWithDate
        name="Outlets"
        isMultiSelect={true}
        defaultValue={selectedBrand}
        handleSelectChange={handleSelectChange}
        useGetOptionsQuery={useGetAllBrandsQuery}
        skip={!auth.isSuperAdmin && !auth.tenantIds && !auth.brandIds}
        inputQuery={auth.brandsQuery}
        field={"brands"}
        customField={["tenantId"]}
      />
      <div>
        <>
          <SearchDiv
            setSearchedTerm={setSearchedTerm}
            name={"Outlet"}
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
            fields={[
              {
                type: "text",
                name: "name",
                label: "Name",
                placeholder: "Outlet Name",
              },
              {
                type: "textarea",
                name: "address",
                label: "Address",
                placeholder: "Outlet Address",
              },
              {
                type: "file",
                name: "image",
                label: "Image",
                placeholder: "Outlet Image",
              },
            ]}
          />
          <div className="mx-3">
            {outlets?.length ? (
              <>
                <FlexDiv
                  className="gap-y-4"
                  Component={EntityCard}
                  items={outlets}
                  showEditBtn={true}
                  validateUpdate={validate}
                  onEditBtnClick={onEditBtnClick}
                  updateHeaderText={() => <h3>Update Outlet</h3>}
                  updateFields={[
                    {
                      type: "text",
                      name: "name",
                      label: "Name",
                      placeholder: "Outlet Name",
                    },
                    {
                      type: "textarea",
                      name: "address",
                      label: "Address",
                      placeholder: "Outlet Address",
                    },
                    {
                      type: "file",
                      name: "image",
                      label: "Image",
                      placeholder: "Outlet Image",
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
                <h4>No Outlets Available</h4>
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default Outlets;
