import React from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { useGetAllTenantsQuery } from "../services/tenant";
import Loader from "../UI/Loaders/Loader";
const Brands = () => {
  const location = useLocation();
  const selectedTenant = location.state?.selectedTenant;
  const {
    data,
    isError: isGetAllTenantsError,
    isLoading: isGetAllTenantsLoading,
  } = useGetAllTenantsQuery();
  const tenants =
    data?.tenants?.map((tenant) => {
      return {
        label: tenant.name,
        value: tenant._id,
      };
    }) ?? [];
  if (isGetAllTenantsLoading) {
    return <Loader />;
  }
  return (
    <div>
      <PageNameWithDate
        name="Brands"
        MultiSelect={() => (
          <Select
            defaultValue={
              selectedTenant
                ? {
                    value: selectedTenant._id,
                    label: selectedTenant.name,
                  }
                : null
            }
            isMulti
            name="colors"
            options={tenants}
            placeholder="Select Tenants"
            className="basic-multi-select w-96 bg-primary-700 rounded-lg text-secondary-600"
            styles={{
              control: (provided, state) => ({
                ...provided,
                boxShadow: "none",
                border: "none",
                backgroundColor: "#EA7C6",
                color: "white",
              }),
            }}
          />
        )}
      />
    </div>
  );
};

export default Brands;
