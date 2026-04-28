'use client';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = {
    sm: { h: 16, w: 18, s: 4 },
    md: { h: 20, w: 22, s: 5 },
    lg: { h: 28, w: 30, s: 7 },
  };
  const { h, w, s } = dims[size];

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-end gap-[3px]" style={{ height: h, width: w }}>
        {/* Step 1 */}
        <div className="logo-step" style={{ width: s, height: s * 0.5 }} />
        {/* Step 2 */}
        <div className="logo-step" style={{ width: s, height: s * 0.7 }} />
        {/* Step 3 — glowing active */}
        <div className="logo-step active" style={{ width: s, height: s }} />
      </div>
      <span className="font-bold text-white tracking-tight" style={{ fontSize: size === 'lg' ? 20 : size === 'sm' ? 14 : 17 }}>
        UpRise
      </span>
    </div>
  );
}
