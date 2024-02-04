import { useState } from "react";
import AuthImage from "../../assets/AuthImage.jpg";
import WithOTPLogin from "./WithOTPLogin";
import WithoutOTPLogin from "./WithoutOTPLogin";
import { HiDevicePhoneMobile } from "react-icons/hi2";
import { signInWithGooglePopup } from "../../utils/firebase.utils";
import { FcGoogle } from "react-icons/fc";
import { login } from "../../store/authSlice";
import useRTKMutation from "../../hooks/useRTKMutation";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useLoginMutation } from "../../services/auth";
const Login = () => {
  const [withOTPLogin, setWithOTPLogin] = useState(false);
  const { trigger: loginApi } = useRTKMutation(useLoginMutation);
  const dispatch = useDispatch();
  const history = useHistory();
  const clickHandler = () => {
    setWithOTPLogin((prev) => !prev);
  };
  const googleLoginHandler = async () => {
    const values = await signInWithGooglePopup();
    try {
      localStorage.setItem("trustedDevice", true);
      var payload = {
        firebaseAccessToken: values?.user?.accessToken,
      };
      const data = await loginApi(payload).unwrap();
      localStorage.setItem("token", data?.token);
      dispatch(
        login({
          user: data?.user ?? values,
        })
      );
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-center">
      <div
        className="w-6/12 h-full "
        style={{
          backgroundImage: `url(${AuthImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="w-6/12 h-full bg-primary-700">
        <div className="w-full h-full flex justify-center items-center">
          <div className="bg-primary-50 w-7/12 px-6 py-8 text-gray-200 rounded-lg shadow-2xl">
            <h3 className="text-3xl font-bold my-4">Sign In</h3>
            {!withOTPLogin && <WithoutOTPLogin />}
            {withOTPLogin && <WithOTPLogin />}
            <div className="flex flex-col items-center gap-y-2 mt-4">
              <p>OR</p>
              <button
                className="bg-[#f5674e] flex items-center justify-center mt-4 h-11 rounded-md w-48 font-bold hover:bg-secondary-100"
                onClick={clickHandler}
              >
                {withOTPLogin ? (
                  <p>Login With Email</p>
                ) : (
                  <div className="flex rounded-xl items-center justify-center gap-x-2 w-full h-full">
                    <HiDevicePhoneMobile className="w-5 h-5" />
                    <p>Login With OTP</p>
                  </div>
                )}
              </button>
              <button
                className="bg-[#f5674e] flex items-center justify-center mt-4 h-11 rounded-md w-56 font-bold hover:bg-secondary-100"
                onClick={googleLoginHandler}
              >
                <div className="flex w-full justify-center items-center gap-x-2">
                  <FcGoogle className="w-6 h-6" />
                  <p>Login With Google</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
