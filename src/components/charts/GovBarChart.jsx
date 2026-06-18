// src/components/charts/GovBarChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "../../utils/cn";

export function GovBarChart({
  data,
  dataKey = "value",
  nameKey = "name",
  height = 300,
  color = "#1d4ed8", // primary-dark equivalent
  className,
  valueSuffix = "",
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 25,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey={nameKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            dy={10}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            dx={-10}
          />
          <Tooltip
            cursor={{ fill: "#f3f4f6" }}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: "14px",
              fontWeight: 500,
            }}
            formatter={(value) => [`${value}${valueSuffix}`, "Attendance"]}
            labelStyle={{ color: "#374151", marginBottom: "4px" }}
          />
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry[dataKey] < 75
                    ? "#ef4444"
                    : entry[dataKey] < 90
                      ? "#f97316"
                      : color
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
