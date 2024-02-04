import PhoneInput from "react-phone-input-2";
import OtpInput from "react-otp-input";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../utils/firebase.utils";
import { showToast } from "../../utils/constants";
import { useState } from "react";
import useRTKMutation from "../../hooks/useRTKMutation";
import { useLoginMutation } from "../../services/auth";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../store/authSlice";
import toast from "react-hot-toast";
const WithOTPLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const generateRecaptcha = () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
        callback: () => onSignup(),
      });
    } catch (err) {
      showToast("Some error occurred!");
    }
  };
  const { trigger: loginApi } = useRTKMutation(useLoginMutation);
  const dispatch = useDispatch();
  const history = useHistory();
  const onSubmit = async (values) => {
    try {
      localStorage.setItem("trustedDevice", "true");
      console.log("values", values);
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
      showToast(err.message);
    }
  };
  function onSignup(event) {
    try {
      event.preventDefault();
      generateRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = "+" + phone;
      toast.dismiss();
      toast.promise(
        signInWithPhoneNumber(auth, phoneNumber, appVerifier),
        {
          loading: "Loading...",
          success: (confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setShowOTP(true);
            toast.dismiss();
            return "OTP Sent Sucessfully to +" + phone;
          },
          error: (err) => {
            console.log("err is", err);
            toast.dismiss();
            switch (err.code) {
              case "auth/too-many-requests": {
                return `Please Try Again After Some Time`;
              }
              case "auth/invalid-verification-code": {
                return `Invalid Code`;
              }
              default: {
                return "Some error occurred!";
              }
            }
          },
        },
        {
          style: {
            color: "white",
          },
          loading: {
            style: {
              color: "black",
            },
          },
        }
      );
    } catch (err) {
      showToast("Some error occurred!");
    }
  }
  function onOtpverify() {
    window.confirmationResult
      .confirm(otp)
      .then((result) => {
        onSubmit(result);
      })
      .catch((error) => {
        console.log("err is", error);
        showToast(() => {
          switch (error.code) {
            case "auth/too-many-requests": {
              return `Please Try Again After Some Time`;
            }
            case "auth/invalid-verification-code": {
              return `Invalid Code`;
            }
            default: {
              return "Some error occurred!";
            }
          }
        });
      });
  }
  return (
    <div>
      {!showOTP && (
        <div>
          <PhoneInput
            containerClass="w-full"
            inputStyle={{
              backgroundColor: "#1a1e30",
              color: "white",
              outline: "none",
              border: "1px solid #1a1e30",
              width: "100%",
            }}
            country={"in"}
            value={phone}
            onChange={setPhone}
          />
          <button
            className="bg-secondary-300 mt-4 rounded-md font-bold hover:bg-secondary-500 h-11 w-full"
            onClick={onSignup}
          >
            Send OTP Via SMS
          </button>
        </div>
      )}
      {showOTP && (
        <div className="w-full">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            shouldAutoFocus
            containerStyle={{
              columnGap: "10px",
            }}
            renderInput={(props) => (
              <input
                {...props}
                className="bg-secondary-25 p-2 rounded-lg outline-none text-white border-2 border-secondary-25"
                style={{
                  width: "16%",
                }}
              />
            )}
          />
          <button
            className="bg-secondary-300 mt-4 rounded-md font-bold hover:bg-secondary-500 h-11 w-full"
            onClick={onOtpverify}
          >
            Verify OTP
          </button>
        </div>
      )}
      <div id="recaptcha"></div>
    </div>
  );
};

export default WithOTPLogin;
