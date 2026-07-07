import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Accepts either:
//   values={[...]}           — snaps to distinct available values (discrete)
//   min={n} max={n} step={n} — generates evenly spaced steps (continuous)
const RangeSlider = ({
  label,
  values,
  min: minProp,
  max: maxProp,
  step = 1,
  minValue,
  maxValue,
  onChange,
  format,
  fullWidth = false,
  className = '',
}) => {
  const sorted = useMemo(() => {
    if (values?.length) return [...values].sort((a, b) => a - b);
    const arr = [];
    for (let v = minProp; v < maxProp; v += step) arr.push(Math.round(v * 100) / 100);
    arr.push(maxProp);
    return arr;
  }, [values, minProp, maxProp, step]);

  const lastIdx = sorted.length - 1;

  const toIdx = useCallback(
    (val) => {
      const exact = sorted.indexOf(val);
      if (exact !== -1) return exact;
      return sorted.reduce(
        (best, v, i) => (Math.abs(v - val) < Math.abs(sorted[best] - val) ? i : best),
        0,
      );
    },
    [sorted],
  );

  const [minIdx, setMinIdx] = useState(() => toIdx(minValue));
  const [maxIdx, setMaxIdx] = useState(() => toIdx(maxValue));

  const minIdxRef = useRef(minIdx);
  const maxIdxRef = useRef(maxIdx);
  useEffect(() => {
    minIdxRef.current = minIdx;
  }, [minIdx]);
  useEffect(() => {
    maxIdxRef.current = maxIdx;
  }, [maxIdx]);

  useEffect(() => {
    setMinIdx(toIdx(minValue));
    setMaxIdx(toIdx(maxValue));
  }, [minValue, maxValue, toIdx]);

  const fillRef = useRef(null);
  useEffect(() => {
    if (fillRef.current) {
      const minPct = Math.round((minIdx / lastIdx) * 100);
      const maxPct = Math.round((maxIdx / lastIdx) * 100);
      fillRef.current.style.left = `${minPct}%`;
      fillRef.current.style.width = `${maxPct - minPct}%`;
    }
  }, [minIdx, maxIdx, lastIdx]);

  const commit = useCallback(() => {
    onChange(sorted[minIdxRef.current], sorted[maxIdxRef.current]);
  }, [sorted, onChange]);

  const fmt = format ?? ((v) => v);
  const atBounds = minIdx === 0 && maxIdx === lastIdx;
  const displayMin = sorted[minIdx];
  const displayMax = sorted[maxIdx];

  return (
    <div className={` ${fullWidth ? 'col-span-2' : ''} ${className}`}>
      <div className="flex justify-between items-center gap-2 mt-1">
        <span className="text-sm text-secondary-light truncate min-w-0" title={label}>
          {label}
        </span>
        <span
          className={`text-sm tabular-nums whitespace-nowrap shrink-0 ${atBounds ? 'text-secondary-light' : 'text-white'}`}
        >
          {displayMin === displayMax ? fmt(displayMin) : `${fmt(displayMin)} – ${fmt(displayMax)}`}
        </span>
      </div>

      <div className="relative flex items-center h-9">
        <div className="absolute w-full h-1 rounded bg-secondary" />
        <div ref={fillRef} className="absolute h-1 rounded bg-secondary-light" />
        <input
          type="range"
          min={0}
          max={lastIdx}
          step={1}
          value={minIdx}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), maxIdx);
            setMinIdx(val);
          }}
          onMouseUp={commit}
          onTouchEnd={commit}
          className="range-thumb absolute w-full"
          style={{ zIndex: minIdx >= lastIdx - 1 ? 5 : 3 }}
        />
        <input
          type="range"
          min={0}
          max={lastIdx}
          step={1}
          value={maxIdx}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), minIdx);
            setMaxIdx(val);
          }}
          onMouseUp={commit}
          onTouchEnd={commit}
          className="range-thumb absolute w-full"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
};

export default RangeSlider;
