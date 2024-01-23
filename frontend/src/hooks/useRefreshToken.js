import { useReloginMutation } from "../services/auth";
import { login, logout } from "../store/authSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useDispatch } from "react-redux";
const useRefreshToken = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [reloginApi, { isError, isLoading, isSuccess, data }] = useReloginMutation();
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
            user: response.user
          })
        );
        history.push("/");
      } catch (err) {
        dispatch(logout());
        history.push("/auth");
      }
    }
  }
  return {reAttemptLogin, reLogin : {isLoading, isError, isSuccess, data}};
};

export default useRefreshToken;
