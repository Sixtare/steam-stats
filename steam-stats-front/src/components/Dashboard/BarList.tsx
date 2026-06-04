"use client";
import React, { useState, useEffect } from "react";
import { cx } from "../../lib/utils";

type Bar<T> = T & {
  key?: string;
  value: number;
  name: string;
};

interface BarListProps<T = any> extends React.HTMLAttributes<HTMLDivElement> {
  data: Bar<T>[];
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
  maxValue?: number;
}

const defaultColors = [
  "from-blue-500/40 via-blue-500 to-blue-500/80",
  "from-purple-500/40 via-purple-500 to-purple-500/80",
  "from-cyan-500/40 via-cyan-500 to-cyan-500/80",
  "from-indigo-500/40 via-indigo-500 to-indigo-500/80",
  "from-sky-500/40 via-sky-500 to-sky-500/80",
];

// Highly optimized individual row component to isolate state re-renders and use native hardware-accelerated CSS transitions
function BarRow({
  name,
  value,
  width,
  colorClass,
  valueFormatter,
  showAnimation,
}: {
  name: string;
  value: number;
  width: number;
  colorClass: string;
  valueFormatter: (value: number) => string;
  showAnimation: boolean;
}) {
  const [animatedWidth, setAnimatedWidth] = useState(showAnimation ? 0 : width);
  const [count, setCount] = useState(showAnimation ? 0 : value);

  useEffect(() => {
    if (!showAnimation) {
      setAnimatedWidth(width);
      setCount(value);
      return;
    }

    // Trigger the GPU-composited CSS width transition shortly after mount to ensure it plays
    const widthTimer = setTimeout(() => {
      setAnimatedWidth(width);
    }, 100);

    // Number counter animation using a lightweight local requestAnimationFrame loop
    let animationFrameId: number;
    const duration = 1600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Apple-like smooth Ease-Out-Expo easing curve
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.round(easeProgress * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    const countTimer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(widthTimer);
      clearTimeout(countTimer);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, width, showAnimation]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="text-on-surface truncate pr-4">{name}</span>
        <span className="text-on-surface-variant font-medium">{valueFormatter(count)}</span>
      </div>
      <div className="relative w-full h-6 bg-surface-container-low rounded-full overflow-hidden inner-glow">
        <div
          className={cx("h-full bg-linear-to-r rounded-full relative", colorClass)}
          style={{ 
            width: `${animatedWidth}%`,
            transition: showAnimation ? "width 1.8s cubic-bezier(0.16, 1, 0.3, 1)" : "none"
          }}
        >
          <div className="absolute inset-0 animate-pulse-slow bg-white/5"></div>
        </div>
      </div>
    </div>
  );
}

export function BarList<T>({
  data = [],
  valueFormatter = (value) => value.toString(),
  showAnimation = false,
  maxValue: maxValueProp,
  className,
  ref,
  ...props
}: BarListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }) {
  const maxValue = maxValueProp ?? Math.max(...data.map((item) => item.value), 0);
  
  return (
    <div ref={ref} className={cx("space-y-4", className)} {...props}>
      {data.map((item, index) => {
        const width = maxValue === 0 ? 0 : (item.value / maxValue) * 100;
        const colorClass = (item as any).color 
          ? `from-${(item as any).color.split('-')[0]}-500/40 via-${(item as any).color.split('-')[0]}-500 to-${(item as any).color.split('-')[0]}-500/80` 
          : defaultColors[index % defaultColors.length];
        
        return (
          <BarRow
            key={item.key ?? item.name ?? index}
            name={item.name}
            value={item.value}
            width={width}
            colorClass={colorClass}
            valueFormatter={valueFormatter}
            showAnimation={showAnimation}
          />
        );
      })}
    </div>
  );
}
