"use client";

import { PieChart, Pie, ResponsiveContainer } from "recharts";


type AssetChartProps = {
  data: {
    name: string;
    fullName: string;
    amount: number;
    percentage: number;
  }[];
};

const colors = [
  "#006de2",
  "#0F172A",
  "#FF6467",
  "#166534",
  "#9333EA",
  "#EA580C",
];

export default function AssetChart({ data }: AssetChartProps) {

  console.log("Rendering AssetChart with data:", data);

  const chartData = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 justify-between gap-4">
      <div className="w-full h-75">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              cornerRadius={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-4 justify-center">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <div>
                <p className="text-my-deep-blue font-medium">
                  {entry.name}
                </p>
                <p className="text-sm">
                  {entry.fullName}
                </p>
              </div>
            </div>
            <p>{entry.percentage}%</p>
          </div>
        ))}
      </div>
    </div>

  );
}