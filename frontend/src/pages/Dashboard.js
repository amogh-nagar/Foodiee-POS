import PageNameWithDate from "../components/PageNameWithDate";
import { useSelector } from "react-redux";
import SuperAdminAnalysis from "../components/Analysis/superAdmin/SuperAdminAnalysis";
import TenantUserAnalysis from "../components/Analysis/tenantUser/TenantUserAnalysis";
import BrandUserAnalysis from "../components/Analysis/brandUser/BrandUserAnalysis";

const Dashboard = () => {
  const auth = useSelector((state) => state.auth);
  return (
    <div>
      <PageNameWithDate name="Dashboard" />
      {auth.isSuperAdmin && <SuperAdminAnalysis />}
      {auth.isTenantUser && <TenantUserAnalysis />}
      {auth.isBrandUser && <BrandUserAnalysis />}
    </div>
  );
};

export default Dashboard;
