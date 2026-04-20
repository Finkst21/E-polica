"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type AnalyticsChartProps = {
  data: Array<{
    title: string;
    averageRating: number;
  }>;
};

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="title" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis domain={[0, 5]} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="averageRating" radius={[12, 12, 0, 0]} fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
