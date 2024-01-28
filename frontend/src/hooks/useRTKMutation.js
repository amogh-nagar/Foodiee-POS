import React from "react";
import ShimmerCards from "../components/Loaders/ShimmerCards";
import { showToast } from "../utils/constants";

const useRTKMutation = (useMethod, Loader = ShimmerCards) => {
  const [trigger, { isLoading, data, error, isError }] = useMethod();
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    showToast(error?.data?.message || "Some error occurred");
  }
  return { trigger, data };
};

export default useRTKMutation;
