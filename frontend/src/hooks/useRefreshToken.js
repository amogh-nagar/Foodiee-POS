import { useReloginMutation } from "../services/auth";
import { login, logout } from "../store/authSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Loader from "../components/Loaders/Loader";
import { showToast } from "../utils/constants";
const useRefreshToken = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [reloginApi, { isError, isLoading, isSuccess, data, error }] =
    useReloginMutation();
  async function reAttemptLogin() {
    const trustedDevice =
      localStorage.getItem("trustedDevice") === "true" ? true : false;
    const token = localStorage.getItem("token");
    if (trustedDevice && token) {
      try {
        const response = await reloginApi().unwrap();
        localStorage.setItem("token", response?.token);
        dispatch(
          login({
            user: response.user,
          })
        );
        history.push("/");
      } catch (err) {
        dispatch(logout());
        history.push("/auth");
      }
    }
  }
  useEffect(() => {
    try {
      reAttemptLogin();
    } catch (e) {
      console.error(e);
    }
  }, []);
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    showToast(error?.data?.message || "Some error occurred");
  }
  return { isLoading, isError, isSuccess, data };
};

export default useRefreshToken;
