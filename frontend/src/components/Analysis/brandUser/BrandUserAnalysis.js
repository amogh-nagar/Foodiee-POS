import { Pie, Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import ChartWrapper from "../../Charts/ChartWrapper";
import {
  useGetActiveInactiveRatioForOutletsQuery,
  useGetHourWiseTop3OutletsSaleQuery,
  useGetMonthWiseTop3OutletsSaleQuery,
  useGetTop3ItemsOfOutletsQuery,
  useGetTop3OutletsQuery,
} from "../../../services/analysis";
import useRTKQuery from "../../../hooks/useRTKQuery";
import {
  getColorBasedOnName,
  getPas12MonthsList,
  getPas24HoursList,
} from "../../../utils/constants";

const BrandUserAnalysis = () => {
  const { data: top3Outlets } = useRTKQuery(useGetTop3OutletsQuery);
  const { data: inactiveActive } = useRTKQuery(
    useGetActiveInactiveRatioForOutletsQuery
  );
  const { data: top3Items } = useRTKQuery(useGetTop3ItemsOfOutletsQuery);
  const { data: monthWiseTop3OutletsSale } = useRTKQuery(
    useGetMonthWiseTop3OutletsSaleQuery
  );
  const { data: hourWiseTop3OutletsSale } = useRTKQuery(
    useGetHourWiseTop3OutletsSaleQuery
  );

  const InActiveActive = {
    labels: inactiveActive?.Outlets.map((ele) =>
      ele._id ? "Active" : "InActive"
    ),
    datasets: [
      {
        label: "# Number of Outlets",
        data: inactiveActive?.outlets?.map((ele) => ele.count),
        backgroundColor: ["rgb(99 255 169 / 20%)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgb(99 255 169 / 20%)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const Top3Outlets = {
    labels: ["Top 3 Outlets"],
    datasets: top3Outlets?.outlets?.map((ele) => {
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
  let MonthWiseTop3OutletsSale = {
    labels: getPas12MonthsList || [],
    datasets: monthWiseTop3OutletsSale?.map((ele) => {
      return {
        label: ele.name,
        data: ele.values,
        fill: false,
        borderColor: getColorBasedOnName(ele.name),
        tension: 0.1,
      };
    }),
  };
  let HourWiseTop3OutletsSale = {
    labels: getPas24HoursList || [],
    datasets: hourWiseTop3OutletsSale?.map((ele) => {
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
        {top3Outlets?.outlets && top3Outlets?.outlets.length && (
          <ChartWrapper
            Chart={Bar}
            height={300}
            width={300}
            data={Top3Outlets}
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
        {monthWiseTop3OutletsSale && monthWiseTop3OutletsSale.length && (
          <Line
            data={MonthWiseTop3OutletsSale}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                title: {
                  display: true,
                  text: "Month Wise Top Outlets Sale(Past One Year)",
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
        {hourWiseTop3OutletsSale && hourWiseTop3OutletsSale.length && (
          <Line
            data={HourWiseTop3OutletsSale}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                title: {
                  display: true,
                  text: "Hour Wise Top Outlets Sale(Past One Year)",
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

export default BrandUserAnalysis;
