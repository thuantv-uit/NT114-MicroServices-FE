import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon  from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useForm from '../hooks/useForm';
import { showToast } from '../utils/toastUtils';
import '../features/boards/styles/board.css';

/**
 * Generic form component — redesigned with board design system.
 * Fully replaces MUI TextField / Button with native elements styled via board.css.
 */
const GenericForm = ({
  initialValues,
  validate,
  onSubmit,
  submitLabel,
  cancelPath,
  onCancel,
  fields,
}) => {
  const navigate = useNavigate();
  const { values, errors, loading, handleChange, handleSubmit } = useForm({
    initialValues,
    validate,
    onSubmit,
    onError: (err) => showToast(err.message, 'error'),
  });
  const [showPassword, setShowPassword] = useState({});

  const togglePw = (name) =>
    setShowPassword((p) => ({ ...p, [name]: !p[name] }));

  return (
    <form className="generic-form" onSubmit={handleSubmit} noValidate>
      {fields.map((field) => {
        const isPassword = field.type === 'password' || field.name.includes('password');
        const isColor    = field.type === 'color';
        const isTextarea = field.multiline;
        const hasError   = !!errors[field.name];
        const inputCls   = hasError ? ' generic-form__input--error' : '';

        return (
          <div key={field.name} className="generic-form__field">
            <label
              htmlFor={field.name}
              className={`generic-form__label${field.required ? ' generic-form__label--required' : ''}`}
            >
              {field.label}
            </label>

            {/* ── Color picker ── */}
            {isColor && (
              <div className="generic-form__color-wrap">
                <input
                  id={field.name}
                  type="color"
                  name={field.name}
                  value={values[field.name]}
                  onChange={handleChange}
                  className="generic-form__color-input"
                />
                <div
                  className="generic-form__color-swatch"
                  style={{ background: values[field.name] }}
                />
                <span className="generic-form__color-value">{values[field.name]}</span>
              </div>
            )}

            {/* ── Textarea ── */}
            {!isColor && isTextarea && (
              <textarea
                id={field.name}
                name={field.name}
                value={values[field.name]}
                onChange={handleChange}
                rows={field.rows || 4}
                required={field.required}
                className={`generic-form__textarea${inputCls}`}
              />
            )}

            {/* ── Password ── */}
            {!isColor && !isTextarea && isPassword && (
              <div className="generic-form__pw-wrap">
                <input
                  id={field.name}
                  name={field.name}
                  type={showPassword[field.name] ? 'text' : 'password'}
                  value={values[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className={`generic-form__input${inputCls}`}
                />
                <button
                  type="button"
                  className="generic-form__pw-toggle"
                  onClick={() => togglePw(field.name)}
                  tabIndex={-1}
                >
                  {showPassword[field.name]
                    ? <RemoveRedEyeIcon style={{ fontSize: 18 }} />
                    : <VisibilityOffIcon style={{ fontSize: 18 }} />
                  }
                </button>
              </div>
            )}

            {/* ── Regular input ── */}
            {!isColor && !isTextarea && !isPassword && (
              <input
                id={field.name}
                name={field.name}
                type={field.type || 'text'}
                value={values[field.name]}
                onChange={handleChange}
                required={field.required}
                className={`generic-form__input${inputCls}`}
              />
            )}

            {/* Error message */}
            {hasError && (
              <p className="generic-form__error">
                <span>⚠</span> {errors[field.name]}
              </p>
            )}
          </div>
        );
      })}

      {/* Actions */}
      <div className="generic-form__actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ flex: 1 }}
        >
          {loading ? 'Processing…' : submitLabel}
        </button>
        {(cancelPath || onCancel) && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => onCancel ? onCancel() : navigate(cancelPath)}
            disabled={loading}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default GenericForm;