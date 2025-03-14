import { useTheme } from "@mui/material";
import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
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

const LineChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[500]} />
        <XAxis dataKey="name" stroke={colors.white[500]} />
        <YAxis stroke={colors.white[500]} />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.black[500],
            border: `1px solid ${colors.grey[500]}`,
          }}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: colors.white[500] }}>{value}</span>
          )}
        />
        <Line
          type="monotone"
          dataKey="pv"
          stroke={colors.yellow[500]}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="uv"
          stroke={colors.grey[500]}
          strokeWidth={2}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
