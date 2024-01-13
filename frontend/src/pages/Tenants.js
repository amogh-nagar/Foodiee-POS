import React, { useEffect, useState } from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import { IoMdAdd } from "react-icons/io";
import EntityCard from "../components/Entity/EntityCard";
import debounce from "lodash.debounce";
import {
  useCreateTenantMutation,
  useGetAllTenantsQuery,
} from "../services/tenant";
import FlexDiv from "../components/Wrappers/FlexDiv";
import Modal from "../components/Modals/Modal";
import CustomForm from "../components/forms/Form";
import Loader from "../UI/Loaders/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { itemsPerPage, showToast } from "../utils/constants";
import InfiniteLoader from "../UI/Loaders/InfiniteLoader";
const Tenants = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [tenants, setTenants] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [
    createTenant,
    { isLoading: isCreateTenantLoading, isError: isCreateTenantError },
  ] = useCreateTenantMutation();
  const {
    data,
    isError: isGetAllTenantsError,
    isLoading: isGetAllTenantsLoading,
    refetch,
  } = useGetAllTenantsQuery({ name: debouncedTerm, page: page });
  const totalItems = data?.totalItems ?? 0;
  useEffect(() => {
    if (data && data.tenants) {
      const newTenants = data.tenants.filter(
        (newTenant) =>
          !tenants.some(
            (existingTenant) => existingTenant._id === newTenant._id
          )
      );
      setTenants((prev) => [...prev, ...newTenants]);
    }
  }, [data]);
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
        formData.append(key, values[key]);
      }
      await createTenant(formData).unwrap();
      refetch();
      showToast("Tenant Created Successfully", "success");
    } catch (err) {
      console.log("Some error occurred", err);
      showToast(err.message);
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
  let tenantClickHandler = (tenantId) => {
    console.log("tenantId", tenantId);
  };
  useEffect(() => {
    let itemsTillNow = (page - 1) * itemsPerPage + itemsPerPage;
    setHasNextPage(itemsTillNow <= totalItems);
  }, [page, totalItems]);
  let fetchMoreData = () => {
    if (hasNextPage) {
      setPage((currentPage) => currentPage + 1);
    }
  };
  return (
    <div>
      <PageNameWithDate name="Tenants" />
      <div>
        {isCreateTenantLoading || isGetAllTenantsLoading ? (
          <Loader />
        ) : (
          <>
            <div className=" items-center gap-x-3 mx-3 my-5 flex h-fit">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-600 text-white font-sans p-2 rounded-lg outline-none w-[80%]"
                placeholder="Search Tenants"
              />
              <Modal
                PopUpButton={
                  <button className="flex gap-x-1 items-center bg-secondary-500 p-3 rounded-lg">
                    <IoMdAdd />
                    <p>Tenant</p>
                  </button>
                }
                isJSX={true}
                HeaderText={() => <h3>Add New Tenant</h3>}
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
                    buttonText="Create"
                    isTrusted={true}
                  />
                }
              />
            </div>
            <div className="mx-3">
              <InfiniteScroll
                dataLength={tenants.length}
                next={fetchMoreData}
                height={690}
                className="hide-scrollbar"
                hasMore={hasNextPage || false}
                loader={<InfiniteLoader />}
              >
                <FlexDiv
                  className="gap-y-4"
                  Component={EntityCard}
                  items={tenants}
                  onClick={tenantClickHandler}
                />
              </InfiniteScroll>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tenants;
