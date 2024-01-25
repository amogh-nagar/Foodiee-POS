import React, { useEffect, useState } from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { useGetAllTenantsQuery } from "../services/tenant";
import Loader from "../UI/Loaders/Loader";
import {
  useCreateBrandMutation,
  useGetAllBrandsQuery,
  useUpdateBrandMutation,
} from "../services/brand";
import EntityCard from "../components/Entity/EntityCard";
import debounce from "lodash.debounce";
import { itemsPerPage, selectCustomStyle, showToast } from "../utils/constants";
import Modal from "../components/Modals/Modal";
import { IoMdAdd } from "react-icons/io";
import CustomForm from "../components/forms/Form";
import FlexDiv from "../components/Wrappers/FlexDiv";
import ReactPaginate from "react-paginate";
import CustomDropdownIndicator from "../components/CustomDropdownIndicator";
const Brands = () => {
  const location = useLocation();
  const [selectedTenant, setSelectedTenant] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [
    createBrand,
    { isLoading: isCreateBrandLoading, isError: isCreateBrandError },
  ] = useCreateBrandMutation();
  const [
    updateBrand,
    { isLoading: isUpdateBrandLoading, isError: isUpdateBrandError },
  ] = useUpdateBrandMutation();
  const {
    data: tenantsData,
    isError: isGetAllTenantsError,
    isLoading: isGetAllTenantsLoading,
  } = useGetAllTenantsQuery({ getAll: true });
  const {
    data,
    isError: isGetAllBrandsError,
    isLoading: isGetAllBrandsLoading,
    refetch,
  } = useGetAllBrandsQuery(
    {
      name: debouncedTerm,
      page: page,
      tenantId: selectedTenant?.value,
    },
    {
      skip: !selectedTenant.value,
    }
  );
  useEffect(() => {
    if (location.state?.selectedEntity)
      setSelectedTenant({
        label: location.state?.selectedEntity?.name,
        value: location.state?.selectedEntity?._id,
      });
    else if (tenantsData?.tenants?.length)
      setSelectedTenant({
        label: tenantsData?.tenants[0]?.name,
        value: tenantsData?.tenants[0]?._id,
      });
  }, [tenantsData?.tenants]);
  const totalItems = data?.totalItems ?? 0;
  let brands = data?.brands ?? [];
  const isLoading =
    isCreateBrandLoading ||
    isGetAllTenantsLoading ||
    isUpdateBrandLoading ||
    isGetAllBrandsLoading;
  const isError =
    isCreateBrandError ||
    isGetAllTenantsError ||
    isUpdateBrandError ||
    isGetAllBrandsError;
  const initialValues = {
    name: "",
    description: "",
    image: "",
  };
  useEffect(() => {
    const debouncer = debounce((newTerm) => {
      setDebouncedTerm(newTerm);
    }, 1000);
    if (searchTerm) {
      debouncer(searchTerm);
    } else {
      setDebouncedTerm("");
    }
    return () => {
      debouncer.cancel();
    };
  }, [searchTerm]);
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
      await createBrand(formData).unwrap()
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
  let tenants =
    tenantsData?.tenants?.map((tenant) => {
      return {
        label: tenant.name,
        value: tenant._id,
      };
    }) ?? [];

  const handleSelectChange = (option) => {
    setSelectedTenant(option);
    refetch();
  };
  return (
    <div>
      <PageNameWithDate
        name="Brands"
        MultiSelect={() => (
          <Select
            components={{ DropdownIndicator: CustomDropdownIndicator }}
            defaultValue={selectedTenant}
            onChange={handleSelectChange}
            name="colors"
            options={tenants}
            placeholder="Select Tenants"
            className="basic-multi-select w-96 bg-primary-700 rounded-lg text-secondary-600"
            styles={selectCustomStyle}
          />
        )}
      />
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className=" items-center gap-x-3 mx-3 my-5 flex h-fit">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-600 text-white font-sans p-2 rounded-lg outline-none w-[80%]"
                placeholder="Search Brands"
              />
              <Modal
                PopUpButton={
                  <button className="flex gap-x-1 items-center bg-secondary-500 p-3 rounded-lg">
                    <IoMdAdd />
                    <p>Brand</p>
                  </button>
                }
                isJSX={true}
                HeaderText={() => <h3>Add New Brand</h3>}
                BodyContent={
                  <CustomForm
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validate={validate}
                    btnClass="w-40 h-10"
                    validator={() => {}}
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
                    buttonText="Create"
                    isTrusted={true}
                  />
                }
              />
            </div>
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
        )}
      </div>
    </div>
  );
};

export default Brands;
