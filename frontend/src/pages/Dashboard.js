import React, { useState } from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import { Pie, Bar, Line } from "react-chartjs-2";
import ChartWrapper from "../components/Charts/ChartWrapper";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";
import 'chart.js/auto';
const InActiveActive = {
  labels: ["InActive", "Active"],
  datasets: [
    {
      label: "# Number of Tenants",
      data: [12, 19],
      backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(75, 192, 192, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
      borderWidth: 1,
    },
  ],
};
const allData = [
  { name: "Subway", value: 10 },
  { name: "KFC", value: 20 },
  { name: "Pizza Hut", value: 30 },
];
const top3Data = allData.sort((a, b) => b.value - a.value).slice(0, 3);
const Top3Tenants = {
  labels: ["Subway", "KFC", "Pizza Hut"],
  datasets: [
    {
      label: "Top 3 Tenants",
      data: top3Data.map((item) => item.value),
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    },
  ],
};
const EntityWiseTotalBifurcation = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Subway",
      data: [65, 59, 80, 81, 56, 55, 70, 30, 40, 50, 30, 12],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
    {
      label: "KFC",
      data: [40, 48, 60, 70, 46, 33, 89, 45, 34, 67, 51, 90],
      fill: false,
      borderColor: "rgb(255, 99, 132)",
      tension: 0.1,
    },
    {
      label: "Pizza Hut",
      data: [40, 48, 60, 70, 46, 33, 50, 20, 80, 50, 30, 80],
      fill: false,
      borderColor: "rgb(108, 99, 132)",
      tension: 0.1,
    },
  ],
};
const EntityHourlyWiseBifurcation = {
  labels: [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ],
  datasets: [
    {
      label: "Subway",
      data: [
        20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
        105, 110, 115, 120, 125, 130, 135,
      ],
      fill: true,
      backgroundColor: "rgba(75, 192, 192, 0.5)",
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
    {
      label: "KFC",
      data: [
        120, 125, 320, 395, 0, 85, 60, 55, 60, 65, 70, 75, 80, 15, 670, 25, 800,
        105, 110, 115, 120, 125, 110, 135,
      ],
      fill: true,
      backgroundColor: "rgb(255, 99, 132, 0.5)",
      borderColor: "rgb(255, 99, 132)",
      tension: 0.1,
    },
    {
      label: "Pizza Hut",
      data: [
        40, 25, 30, 965, 90, 45, 10, 55, 60, 65, 70, 75, 80, 85, 60, 35, 100,
        105, 110, 115, 120, 125, 130, 135,
      ],
      fill: true,
      backgroundColor: "rgb(108, 99, 132, 0.5)",
      borderColor: "rgb(108, 99, 132)",
      tension: 0.1,
    },
  ],
};

const Dashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <div>
      <PageNameWithDate name="Dashboard" />
      <div className="flex justify-between items-center m-8">
        <ChartWrapper Chart={Pie} data={InActiveActive} />
        <ChartWrapper Chart={Bar} height={300} width={300} data={Top3Tenants} />
        <ChartWrapper Chart={Bar} height={300} width={300} data={Top3Tenants} />
      </div>
      <div className="mx-8 my-10 bg-primary-700 p-5 rounded-xl border-secondary-600 border-2">
        <div className="flex justify-end gap-x-4 items-center">
         <DateRangePicker
            startDate={startDate}
            startDateId="start_date_id"
            endDate={endDate}
            endDateId="end_date_id"
            onDatesChange={({ startDate, endDate }) => {
              setStartDate(startDate);
              setEndDate(endDate);
            }}
            focusedInput={focusedInput}
            onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
          />
          <button className="bg-secondary-500 px-6 py-3 rounded-lg hover:bg-secondary-700">Past 1 Year</button>
        </div>
        <Line
          data={EntityWiseTotalBifurcation}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Month Wise Tenant Bifurcation(Past One Year)",
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
      </div>
      <div className="mx-8 my-10 bg-primary-700 p-5 rounded-xl border-secondary-600 border-2">
        <Line
          data={EntityHourlyWiseBifurcation}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Hourly Wise Tenant Bifurcation(Past One Day)",
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
      </div>
    </div>
  );
};

export default Dashboard;
