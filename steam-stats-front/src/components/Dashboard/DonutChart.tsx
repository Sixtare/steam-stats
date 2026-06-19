"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cx } from "../../lib/utils";

interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[];
  category: string;
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
}

export const donutColorMap: Record<string, string> = {
  "blue-400": "#60a5fa",
  "purple-400": "#c084fc",
  "cyan-500": "#06b6d4",
  "indigo-500": "#6366f1",
  "sky-500": "#0ea5e9",
  "slate-400": "#94a3b8",
  "slate-600": "#475569",
};
const defaultColors = ["#3b82f6", "#a855f7", "#06b6d4", "#6366f1", "#0ea5e9", "#94a3b8", "#475569"];

export function DonutChart({
  data,
  category,
  index,
  colors = [],
  valueFormatter = (val) => val.toString(),
  showAnimation = true,
  className,
  ...props
}: DonutChartProps) {
  return (
    <div className={cx("w-full h-64 min-w-0", className)} {...props}>
      <ResponsiveContainer width="100%" height={256}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={2}
            dataKey={category}
            nameKey={index}
            stroke="var(--color-surface)"
            strokeWidth={2}
            isAnimationActive={showAnimation}
            activeIndex={-1}
          >
            {data.map((entry, i) => {
              const color = donutColorMap[colors[i % colors.length]] || defaultColors[i % defaultColors.length];
              return <Cell key={`cell-${i}`} fill={color} style={{ outline: 'none' }} />;
            })}
          </Pie>
          <Tooltip
            formatter={(value: any, name: any) => [valueFormatter(value ?? 0), name]}
            contentStyle={{ backgroundColor: 'var(--color-surface-container-highest)', border: '1px solid var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }}
            itemStyle={{ color: 'var(--color-on-surface)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
