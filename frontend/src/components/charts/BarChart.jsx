import { useTheme } from "@mui/material";
import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { tokens } from "../../../theme";

const data = [
  { name: "Jan", uv: 4000, pv: 2400 },
  { name: "Feb", uv: 3000, pv: 1398 },
  { name: "Mar", uv: 2000, pv: 9800 },
  { name: "Apr", uv: 2780, pv: 3908 },
  { name: "May", uv: 1890, pv: 4800 },
  { name: "Jun", uv: 2390, pv: 3800 },
];

const BarChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[500]} />
        <XAxis dataKey="name" stroke={colors.white[500]} />
        <YAxis stroke={colors.white[500]} />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.black[500],
            border: `1px solid ${colors.grey[500]}`,
          }}
        />
        <Legend />
        <Bar dataKey="pv" fill={colors.yellow[500]} />
        <Bar dataKey="uv" fill={colors.grey[500]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
