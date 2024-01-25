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
import debounce from "lodash.debounce";
import { itemsPerPage, selectCustomStyle, showToast } from "../utils/constants";
import Select from "react-select";
import Modal from "../components/Modals/Modal";
import { IoMdAdd } from "react-icons/io";
import CustomForm from "../components/forms/Form";
import FlexDiv from "../components/Wrappers/FlexDiv";
import Loader from "../UI/Loaders/Loader";
import ReactPaginate from "react-paginate";
import CustomDropdownIndicator from "../components/CustomDropdownIndicator";

const Outlets = () => {
  const location = useLocation();
  const [selectedBrand, setSelectedBrand] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [
    createOutlet,
    { isLoading: isCreateOutletLoading, isError: isCreateOutletError },
  ] = useCreateOutletMutation();
  const [
    updateOutlet,
    { isLoading: isUpdateOutletLoading, isError: isUpdateOutletError },
  ] = useUpdateOutletMutation();
  const {
    data: brandsData,
    isError: isGetAllBrandsError,
    isLoading: isGetAllBrandsLoading,
  } = useGetAllBrandsQuery({ getAll: true });
  const {
    data,
    isError: isGetAllOutletsError,
    isLoading: isGetAllOutletsLoading,
    refetch,
  } = useGetAllOutletsQuery(
    {
      name: debouncedTerm,
      page: page,
      brandId: selectedBrand?.value,
    },
    {
      skip: !selectedBrand.value,
    }
  );
  useEffect(() => {
    if (location.state?.selectedEntity)
      setSelectedBrand({
        label: location.state?.selectedEntity?.name,
        value: location.state?.selectedEntity?._id,
        tenantId: location.state?.selectedEntity?.entityId,
      });
    else if (brandsData?.brands?.length)
      setSelectedBrand({
        label: brandsData?.brands[0]?.name,
        value: brandsData?.brands[0]?._id,
        tenantId: brandsData?.brands[0]?.tenantId,
      });
  }, [brandsData?.brands]);
  const totalItems = data?.totalItems ?? 0;
  let outlets = data?.outlets ?? [];
  const isLoading =
    isCreateOutletLoading ||
    isGetAllBrandsLoading ||
    isUpdateOutletLoading ||
    isGetAllOutletsLoading;
  const isError =
    isCreateOutletError ||
    isGetAllBrandsError ||
    isUpdateOutletError ||
    isGetAllOutletsError;
  const initialValues = {
    name: "",
    address: "",
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
  let brands =
    brandsData?.brands?.map((brand) => {
      return {
        label: brand.name,
        value: brand._id,
        tenantId: brand.tenantId,
      };
    }) ?? [];

  const handleSelectChange = (option) => {
    setSelectedBrand(option);
    refetch();
  };
  return (
    <div>
      <PageNameWithDate
        name="Brands"
        MultiSelect={() => (
          <Select
            components={{ DropdownIndicator: CustomDropdownIndicator }}
            defaultValue={selectedBrand}
            onChange={handleSelectChange}
            name="colors"
            options={brands}
            placeholder="Select Brands"
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
                placeholder="Search Outlets"
              />
              <Modal
                PopUpButton={
                  <button className="flex gap-x-1 items-center bg-secondary-500 p-3 rounded-lg">
                    <IoMdAdd />
                    <p>Outlet</p>
                  </button>
                }
                isJSX={true}
                HeaderText={() => <h3>Add New Outlet</h3>}
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
                    buttonText="Create"
                    isTrusted={true}
                  />
                }
              />
            </div>
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
        )}
      </div>
    </div>
  );
};

export default Outlets;
