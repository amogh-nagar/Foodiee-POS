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
import { itemsPerPage, selectCustomStyle, showToast } from "../utils/constants";
import Select from "react-select";
import FlexDiv from "../components/Wrappers/FlexDiv";
import Loader from "../UI/Loaders/Loader";
import ReactPaginate from "react-paginate";
import CustomDropdownIndicator from "../components/CustomDropdownIndicator";
import SearchDiv from "../components/Containers/SearchDiv";
import { useSelector } from "react-redux";

const Outlets = () => {
  const location = useLocation();
  const [selectedBrand, setSelectedBrand] = useState({});
  const [page, setPage] = useState(1);
  const [searchedTerm, setSearchedTerm] = useState("");
  const auth = useSelector((state) => state.auth);
  const [searchBrands, setSearchBrands] = useState("");
  const [
    createOutlet,
    { isLoading: isCreateOutletLoading, isError: isCreateOutletError },
  ] = useCreateOutletMutation();
  const [
    updateOutlet,
    { isLoading: isUpdateOutletLoading, isError: isUpdateOutletError },
  ] = useUpdateOutletMutation();
  const brandsQuery = {
    name: searchBrands,
    page: 1,
  };
  if (auth.isSuperAdmin) {
    brandsQuery.tenantIds = "";
  }
  if (auth.tenantIds) {
    brandsQuery.tenantIds = auth.tenantIds;
  }
  if (auth.brandIds) {
    brandsQuery.brandIds = auth.brandIds;
  }
  const {
    data: brandsData,
    isError: isGetAllBrandsError,
    isLoading: isGetAllBrandsLoading,
  } = useGetAllBrandsQuery(brandsQuery, {
    skip: !auth.isSuperAdmin && !auth.tenantIds && !auth.brandIds,
  });
  const outletsQuery = {
    name: searchedTerm,
    page: page,
  };
  if (auth.outletIds) {
    outletsQuery.outletIds = auth.outletIds;
  }
  if (selectedBrand?.value) {
    outletsQuery.brandId = selectedBrand?.value;
  }
  const {
    data,
    isError: isGetAllOutletsError,
    isLoading: isGetAllOutletsLoading,
    refetch,
  } = useGetAllOutletsQuery(outletsQuery, {
    skip: !selectedBrand.value && !auth.outletIds,
  });
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
        name="Outlets"
        MultiSelect={() =>
          brands && brands.length ? (
            <Select
              components={{ DropdownIndicator: CustomDropdownIndicator }}
              defaultValue={selectedBrand}
              onChange={handleSelectChange}
              name="colors"
              onInputChange={(e) => setSearchBrands(e)}
              options={brands}
              placeholder="Select Brands"
              className="basic-multi-select w-96 bg-primary-700 rounded-lg text-secondary-600"
              styles={selectCustomStyle}
            />
          ) : (
            ""
          )
        }
      />
      <div>
        {isLoading ? (
          <Loader />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Outlets;
