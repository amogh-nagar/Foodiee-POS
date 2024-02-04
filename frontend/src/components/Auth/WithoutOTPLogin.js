import useRTKMutation from "../../hooks/useRTKMutation";
import { useLoginMutation } from "../../services/auth";
import CustomForm from "../forms/Form";
import { login } from "../../store/authSlice";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

const WithoutOTPLogin = () => {
  const { trigger: loginApi } = useRTKMutation(useLoginMutation);
  const dispatch = useDispatch();
  const history = useHistory();
  const initialValues = {
    email: "",
    password: "",
  };
  const onSubmit = async (values) => {
    try {
      localStorage.setItem("trustedDevice", values?.staySignedIn);
      var payload = {
        email: values.email,
        password: values.password,
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

  const validate = (values) => {
    const errors = {};

    if (!values.email || !values.email.length) {
      errors.email = "Email is required";
    }
    if (
      !values.email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      errors.email = "Email is not valid";
    }

    if (!values.password || !values.password.length) {
      errors.password = "Password is required";
    }

    return errors;
  };
  return (
      <CustomForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
        validator={() => {}}
        fields={[
          {
            type: "email",
            name: "email",
            label: "Email",
            placeholder: "Your Email",
          },
          {
            type: "password",
            name: "password",
            label: "Password",
            placeholder: "Your Password",
          },
          {
            type: "checkbox",
            name: "staySignedIn",
            label: "Stay Signed In",
          },
        ]}
        buttonText="Login"
      />
  );
};

export default WithoutOTPLogin;
