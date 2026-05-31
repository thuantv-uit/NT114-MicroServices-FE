/**
 * ThunioLogo — Logo chính thức của Thunio
 *
 * Props:
 *   variant  : 'light' | 'dark' | 'primary'   — màu nền đang dùng
 *   iconOnly : boolean                          — chỉ hiện icon, không có wordmark
 *   size     : 'sm' | 'md' | 'lg'             — kích thước tổng thể
 *
 * Ví dụ:
 *   <ThunioLogo />                          → light, wordmark, md
 *   <ThunioLogo variant="dark" />           → wordmark trên nền tối
 *   <ThunioLogo iconOnly />                 → icon 36px (sidebar collapsed)
 *   <ThunioLogo iconOnly size="sm" />       → icon 24px (favicon inline)
 *   <ThunioLogo variant="primary" />        → logo trắng trên nền primary
 */

import React from 'react';

const SIZES = {
  sm: { icon: 24, font: 15, textX: 31, textY: 17, iconRx: 6 },
  md: { icon: 36, font: 22, textX: 46, textY: 25, iconRx: 9 },
  lg: { icon: 48, font: 29, textX: 62, textY: 34, iconRx: 12 },
};

const WORDMARK_WIDTH = { sm: 98, md: 148, lg: 196 };

const ThunioIcon = ({ s, accentFill, fgColor }) => {
  const i = s.icon;
  const p = i / 36;
  return (
    <>
      <rect width={i} height={i} rx={s.iconRx} fill={fgColor === '#ffffff' ? '#3B5BDB' : '#3B5BDB'} />
      <rect x={8*p} y={8*p} width={20*p} height={5*p} rx={2*p} fill={fgColor} />
      <rect x={15*p} y={8*p} width={5*p}  height={18*p} rx={2*p} fill={fgColor} />
      <rect x={22*p} y={19*p} width={8*p} height={8*p}  rx={2.5*p} fill={accentFill} />
    </>
  );
};

export const ThunioLogo = ({
  variant  = 'light',
  iconOnly = false,
  size     = 'md',
}) => {
  const s = SIZES[size] || SIZES.md;

  const textFill = variant === 'dark' || variant === 'primary'
    ? '#ffffff'
    : '#1A202C';

  const iconFgColor = variant === 'primary' ? '#3B5BDB' : '#ffffff';
  const iconBgOverride = variant === 'primary'
    ? <rect width={s.icon} height={s.icon} rx={s.iconRx} fill="#ffffff" />
    : null;

  const accentFill = variant === 'dark' ? '#A78BFA' : '#7C3AED';

  const svgWidth  = iconOnly ? s.icon : WORDMARK_WIDTH[size];
  const svgHeight = s.icon;
  const viewBox   = iconOnly
    ? `0 0 ${s.icon} ${s.icon}`
    : `0 0 ${WORDMARK_WIDTH[size]} ${s.icon}`;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Thunio logo"
      role="img"
    >
      {variant === 'primary' ? (
        <>
          {iconBgOverride}
          <ThunioIcon s={s} accentFill="#7C3AED" fgColor="#3B5BDB" />
        </>
      ) : (
        <ThunioIcon s={s} accentFill={accentFill} fgColor="#ffffff" />
      )}

      {!iconOnly && (
        <text
          x={s.textX}
          y={s.textY}
          fontFamily="Outfit, sans-serif"
          fontSize={s.font}
          fontWeight="800"
          letterSpacing="-0.5"
          fill={textFill}
        >
          Thunio
        </text>
      )}
    </svg>
  );
};

export default ThunioLogo;
