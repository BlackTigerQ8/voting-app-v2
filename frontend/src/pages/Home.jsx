import React from "react";
import Layout from "../components/Layout";
import BarChart from "../components/charts/BarChart";
import LineChart from "../components/charts/LineChart";
import PieChart from "../components/charts/PieChart";

const Home = () => {
  const sections = [
    {
      type: "grid",
      cols: 3,
      className: "mb-4",
      cards: [
        { height: "h-[200px]", component: <PieChart /> },
        { height: "h-[200px]", component: <PieChart /> },
        { height: "h-[200px]", component: <PieChart /> },
      ],
    },
    {
      type: "single",
      className: "mb-4",
      height: "h-[400px]",
      component: <LineChart />,
    },
    {
      type: "grid",
      cols: 2,
      className: "mb-4",
      cards: [
        { height: "h-[300px]", component: <BarChart /> },
        { height: "h-[300px]", component: <BarChart /> },
      ],
    },
  ];

  return <Layout sections={sections} />;
};

export default Home;
