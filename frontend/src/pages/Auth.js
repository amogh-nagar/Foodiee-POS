import { useState } from "react";
import Login from "../components/Auth/Login";

const Auth = () => {
  const [type, setType] = useState(false);
  return <div className="font-sans">{!type && <Login />}</div>;
};

export default Auth;
