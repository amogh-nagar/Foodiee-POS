import React from "react";
import ShimmerCards from "../components/Loaders/ShimmerCards";
import { showToast } from "../utils/constants";

const useRTKQuery = (useMethod, inputQuery = {}, skipQuery = {}, Loader = ShimmerCards) => {
  const { data, isError, isLoading, error, refetch } = useMethod(
    inputQuery,
    skipQuery
  );
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    showToast(error?.data?.message || "Some error occurred");
  }
  return { data, refetch, isLoading };
};

export default useRTKQuery;
