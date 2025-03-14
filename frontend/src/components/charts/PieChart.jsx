import { useTheme } from "@mui/material";
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { tokens } from "../../../theme";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const COLORS = [
    colors.yellow[500],
    colors.grey[500],
    colors.black[500],
    colors.grey[400],
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={60}
          fill={colors.yellow[500]}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
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
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
