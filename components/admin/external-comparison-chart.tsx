"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ExternalComparisonChart({
  data
}: {
  data: Array<{ title: string; averageRating: number; externalRating: number }>;
}) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="title" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis domain={[0, 5]} tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="averageRating" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
          <Bar dataKey="externalRating" fill="hsl(var(--accent))" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
