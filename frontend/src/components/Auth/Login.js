import { useState } from "react";
import AuthImage from "../../assets/AuthImage.jpg";
import WithOTPLogin from "./WithOTPLogin";
import WithoutOTPLogin from "./WithoutOTPLogin";
import { HiDevicePhoneMobile } from "react-icons/hi2";
const Login = () => {
  const [withOTPLogin, setWithOTPLogin] = useState(false);
  const clickHandler = () => {
    setWithOTPLogin((prev) => !prev);
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
