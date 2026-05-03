"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function BookRatingsChart({
  data
}: {
  data: Array<{ title: string; averageRating: number; ratingsCount: number }>;
}) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
          <XAxis
            dataKey="title"
            angle={-28}
            textAnchor="end"
            interval={0}
            height={70}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis domain={[0, 5]} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value, name) => [
              name === "averageRating" ? Number(value).toFixed(1) : value,
              name === "averageRating" ? "Povprecna ocena" : "Stevilo ocen"
            ]}
          />
          <Bar dataKey="averageRating" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
