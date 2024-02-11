import { Pie, Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import ChartWrapper from "../../Charts/ChartWrapper";
import {
  useGetActiveInactiveRatioForTenantsQuery,
  useGetHourWiseTop3TenantsSaleQuery,
  useGetMonthWiseTop3TenantsSaleQuery,
  useGetTop3ItemsOfTenantsQuery,
  useGetTop3TenantsQuery,
} from "../../../services/analysis";
import useRTKQuery from "../../../hooks/useRTKQuery";
import {
  getColorBasedOnName,
  getPas12MonthsList,
  getPas24HoursList,
} from "../../../utils/constants";

const SuperAdminAnalysis = () => {
  const { data: top3Tenants } = useRTKQuery(useGetTop3TenantsQuery);
  const { data: inactiveActive } = useRTKQuery(
    useGetActiveInactiveRatioForTenantsQuery
  );
  const { data: top3Items } = useRTKQuery(useGetTop3ItemsOfTenantsQuery);
  const { data: monthWiseTop3TenantsSale } = useRTKQuery(
    useGetMonthWiseTop3TenantsSaleQuery
  );
  const { data: hourWiseTop3TenantsSale } = useRTKQuery(
    useGetHourWiseTop3TenantsSaleQuery
  );

  const InActiveActive = {
    labels: inactiveActive?.tenants.map((ele) =>
      ele._id ? "Active" : "InActive"
    ),
    datasets: [
      {
        label: "# Number of Tenants",
        data: inactiveActive?.tenants?.map((ele) => ele.count),
        backgroundColor: ["rgb(99 255 169 / 20%)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgb(99 255 169 / 20%)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const Top3Tenants = {
    labels: ["Top 3 Tenants"],
    datasets: top3Tenants?.tenants?.map((ele) => {
      return {
        label: ele.name[0],
        data: [ele.sale],
        backgroundColor: getColorBasedOnName(ele.name[0]),
        borderColor: getColorBasedOnName(ele.name[0], 1),
        borderWidth: 1,
      };
    }),
  };
  const Top3Items = {
    labels: ["Top 3 Dishes"],
    datasets: top3Items?.items?.map((ele) => {
      return {
        label: ele.name,
        data: [ele.price],
        backgroundColor: getColorBasedOnName(ele.name),
        borderColor: getColorBasedOnName(ele.name, 1),
        borderWidth: 1,
      };
    }),
  };
  let MonthWiseTop3TenantsSale = {
    labels: getPas12MonthsList || [],
    datasets: monthWiseTop3TenantsSale?.map((ele) => {
      return {
        label: ele.name,
        data: ele.values,
        fill: false,
        borderColor: getColorBasedOnName(ele.name),
        tension: 0.1,
      };
    }),
  };
  let HourWiseTop3TenantsSale = {
    labels: getPas24HoursList || [],
    datasets: hourWiseTop3TenantsSale?.map((ele) => {
      return {
        label: ele.name,
        data: ele.values,
        fill: false,
        borderColor: getColorBasedOnName(ele.name),
        tension: 0.1,
      };
    }),
  };
  return (
    <>
      <div className="flex gap-3 flex-wrap justify-between items-center m-8">
        <ChartWrapper Chart={Pie} data={InActiveActive} />
        {top3Items?.items && top3Items?.items.length && (
          <ChartWrapper Chart={Bar} height={300} width={300} data={Top3Items} />
        )}
        {top3Tenants?.tenants && top3Tenants?.tenants.length && (
          <ChartWrapper
            Chart={Bar}
            height={300}
            width={300}
            data={Top3Tenants}
          />
        )}
      </div>
      <div
        style={{
          position: "relative",
          margin: "auto",
          width: "95%",
          height: "80vh",
        }}
        className="mx-8 my-10 bg-primary-700 p-5 rounded-xl border-secondary-600 border-2"
      >
        {monthWiseTop3TenantsSale && monthWiseTop3TenantsSale.length && (
          <Line
            data={MonthWiseTop3TenantsSale}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                title: {
                  display: true,
                  text: "Month Wise Top Tenants Sale(Past One Year)",
                  font: {
                    size: 18,
                  },
                  padding: {
                    top: 10,
                    bottom: 30,
                  },
                },
              },
            }}
          />
        )}
      </div>
      <div
        style={{
          position: "relative",
          margin: "auto",
          marginTop: "2rem",
          width: "95%",
          height: "80vh",
        }}
        className="mx-8 my-10 bg-primary-700 p-5 rounded-xl border-secondary-600 border-2"
      >
        {hourWiseTop3TenantsSale && hourWiseTop3TenantsSale.length && (
          <Line
            data={HourWiseTop3TenantsSale}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                title: {
                  display: true,
                  text: "Hour Wise Top Tenants Sale(Past One Year)",
                  font: {
                    size: 18,
                  },
                  padding: {
                    top: 10,
                    bottom: 30,
                  },
                },
              },
            }}
          />
        )}
      </div>
    </>
  );
};

export default SuperAdminAnalysis;
