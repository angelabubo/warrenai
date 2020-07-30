//https://stackoverflow.com/questions/53892321/how-can-i-fix-cannot-read-property-document-of-undefined-when-directly-acces
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
//import ReactApexChart from "react-apexcharts";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const CandlestickChart = ({ data, title }) => {
  const { o, h, l, c, t, s } = data;
  const chartData =
    s === "ok"
      ? t.map((time, i) => {
          return {
            x: new Date(time * 1000),
            y: [o[i], h[i], l[i], c[i]],
          };
        })
      : [];

  const seriesData = [
    {
      name: "candle",
      data: chartData,
    },
  ];

  const [series, setSeries] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setSeries(seriesData);
    }, 1000);
  }, []);

  const options = {
    chart: {
      height: 350,
      type: "candlestick",
    },
    grid: {
      borderColor: "#26303e",
    },
    title: {
      text: title ? title : "",
      align: "left",
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      type: "category",
      labels: {
        formatter: function (val) {
          return dayjs(val).format("MMM DD");
        },
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };
  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={350}
      />
    </div>
  );
};

export default CandlestickChart;
