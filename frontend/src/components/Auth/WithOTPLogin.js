import PhoneInput from "react-phone-input-2";
import OtpInput from "react-otp-input";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../utils/firebase.utils";
import { showToast } from "../../utils/constants";
import { useState } from "react";
const WithOTPLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(true);
  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
      size: "invisible",
      callback: () => {
        onSignup();
      },
    });
  };
  function onSignup(event) {
    event.preventDefault();
    generateRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const phoneNumber = "+" + phone;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setShowOTP(true);
        showToast("OTP Sended Sucessfully", "success");
      })
      .catch((error) => {
        showToast(error.message);
      });
  }
  function onOtpverify() {
    window.confirmationResult
      .confirm(otp)
      .then(async (result) => {
        console.log("result is", result);
      })
      .catch((error) => {
        console.log(error.message);
        showToast(error.message);
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
              columnGap: "10px"
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
