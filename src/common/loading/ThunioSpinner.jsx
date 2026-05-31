/**
 * ThunioSpinner — Branded loading spinner của Thunio
 * 3 cột Kanban nhảy lên xuống theo thứ tự — đặc trưng riêng của Thunio.
 *
 * Props:
 *   size      : 'sm' | 'md' | 'lg' | 'xl'   — kích thước spinner
 *   text      : string                         — label bên dưới (optional)
 *   showBrand : boolean                        — hiện tên "Thunio" (dùng cho page loading)
 *   color     : 'default' | 'white'           — màu cột (white dùng trong button primary)
 *
 * Ví dụ:
 *   <ThunioSpinner />                                     → md, không label
 *   <ThunioSpinner size="xl" showBrand text="Loading workspace…" />
 *   <ThunioSpinner size="sm" color="white" />             → trong button primary
 */

import React from 'react';
import '../styles/loading.css';

const SIZES = {
  sm: { width: 4,  height: 14 },
  md: { width: 6,  height: 20 },
  lg: { width: 9,  height: 28 },
  xl: { width: 13, height: 40 },
};

export const ThunioSpinner = ({
  size      = 'md',
  text      = '',
  showBrand = false,
  color     = 'default',
}) => {
  const s = SIZES[size] || SIZES.md;

  return (
    <div className="thunio-spinner-wrap">
      <div
        className={`thunio-spinner thunio-spinner--${color}`}
        style={{ height: s.height, gap: size === 'sm' ? 2 : 3 }}
        role="status"
        aria-label="Loading"
      >
        <span className="thu-col thu-col--1" style={{ width: s.width, height: s.height }} />
        <span className="thu-col thu-col--2" style={{ width: s.width, height: s.height }} />
        <span className="thu-col thu-col--3" style={{ width: s.width, height: s.height }} />
      </div>

      {showBrand && (
        <span className="thunio-spinner-brand">Thunio</span>
      )}

      {text && (
        <span className="thunio-spinner-text">{text}</span>
      )}
    </div>
  );
};

/**
 * PageSpinner — Full page loading, dùng khi route đang load
 * Hiện giữa màn hình với logo + spinner + text
 */
export const PageSpinner = ({ text = 'Loading your workspace…' }) => (
  <div className="thunio-page-spinner">
    <ThunioSpinner size="xl" showBrand text={text} />
  </div>
);

/**
 * LoadingButton — Button với spinner tích hợp
 * Tự động disable khi loading=true
 *
 * Props:
 *   loading  : boolean
 *   variant  : 'primary' | 'outline' | 'ghost' | 'danger'
 *   loadText : string — text khi đang loading
 */
export const LoadingButton = ({
  loading   = false,
  variant   = 'primary',
  loadText  = 'Loading…',
  children,
  ...props
}) => {
  const spinnerColor = variant === 'primary' || variant === 'danger'
    ? 'white'
    : 'default';

  return (
    <button
      className={`btn btn-${variant}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <ThunioSpinner size="sm" color={spinnerColor} />
      )}
      <span>{loading ? loadText : children}</span>
    </button>
  );
};

export default ThunioSpinner;
