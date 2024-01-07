import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import CustomForm from "../components/forms/Form";
import { useLoginMutation } from "../services/auth";
import AuthImage from "../assets/AuthImage.jpg";
import Loader from "../UI/Loaders/Loader";
const Auth = () => {
  const [loginApi, { isLoading }] = useLoginMutation();
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
          user: values,
          permissions: data?.user?.permissions,
          role: data?.user?.role,
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
  if(isLoading){
    return <Loader />;
  }
  return (
    <div className="font-sans">
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
                isTrusted={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
