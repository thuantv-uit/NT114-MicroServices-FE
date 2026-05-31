import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ThunioLogo } from '../../../Logo/components/ThunioLogo';
import { ThunioSpinner } from '../../../Logo/components/ThunioSpinner';
import { showToast } from '../../../utils/toastUtils';
import { getUserById, changeAvatar, deleteUser } from '../services/userService';
import '../styles/Profile.css';

/* ── Helpers ── */
const getInitials = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

const formatJoinedDate = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const getUserIdFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id || payload._id || null;
  } catch (_) {
    return null;
  }
};

/* ══════════════════════════════════════════════════════════════
   PROFILE PAGE
   ══════════════════════════════════════════════════════════════ */
const Profile = () => {
  const token = localStorage.getItem('token');
  const userId = getUserIdFromToken(token);
  const navigate = useNavigate();

  const [user,        setUser]        = useState(null);
  const [fetching,    setFetching]    = useState(true);
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingPwd,  setEditingPwd]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  /* Info form state — sync khi user load xong */
  const [infoForm, setInfoForm] = useState({ username: '', email: '' });

  /* Password form state */
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });

  /* Avatar preview */
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile,    setAvatarFile]    = useState(null);

  /* ── Fetch user on mount ── */
  useEffect(() => {
    if (!userId) {
      showToast('Unable to identify user. Please log in again.', 'error');
      setFetching(false);
      return;
    }
    const load = async () => {
      try {
        setFetching(true);
        const data = await getUserById(userId);
        setUser(data);
        setInfoForm({ username: data.username || '', email: data.email || '' });
        /* avatar: treat "" và null như nhau — không có ảnh */
        setAvatarPreview(data.avatar || null);
      } catch (err) {
        showToast(err?.message || 'Failed to load profile.', 'error');
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [userId]);

  /* ── Handlers ── */
  const handleInfoChange = (e) =>
    setInfoForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePwdChange = (e) =>
    setPwdForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveInfo = async () => {
    if (!infoForm.username.trim() || !infoForm.email.trim()) {
      showToast('Username and email are required.', 'error');
      return;
    }
    try {
      setLoading(true);
      /* TODO: await updateUserInfo(infoForm); */
      await new Promise((r) => setTimeout(r, 800));
      setUser((prev) => ({ ...prev, ...infoForm }));
      setEditingInfo(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err?.message || 'Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInfo = () => {
    setInfoForm({ username: user.username || '', email: user.email || '' });
    setEditingInfo(false);
  };

  const handleSavePwd = async () => {
    if (!pwdForm.current || !pwdForm.newPwd || !pwdForm.confirm) {
      showToast('Please fill in all password fields.', 'error');
      return;
    }
    if (pwdForm.newPwd !== pwdForm.confirm) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (pwdForm.newPwd.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    try {
      setLoading(true);
      /* TODO: await changePassword(pwdForm.current, pwdForm.newPwd); */
      await new Promise((r) => setTimeout(r, 800));
      setPwdForm({ current: '', newPwd: '', confirm: '' });
      setEditingPwd(false);
      showToast('Password updated successfully!', 'success');
    } catch (err) {
      showToast(err?.message || 'Failed to update password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile) return;
    try {
      setLoading(true);
      const res = await changeAvatar(avatarFile);
      const newAvatarUrl = res?.user?.avatar || avatarPreview;
      setUser((prev) => ({ ...prev, avatar: newAvatarUrl }));
      setAvatarPreview(newAvatarUrl);
      setAvatarFile(null);
      showToast('Avatar updated successfully!', 'success');
    } catch (err) {
      showToast(err?.message || 'Failed to update avatar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await deleteUser(userId);
      showToast('Account deleted successfully.', 'success');
      localStorage.removeItem('token');
      setTimeout(() => navigate('/register'), 1500);
    } catch (err) {
      showToast(err?.message || 'Failed to delete account.', 'error');
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  /* ── Loading skeleton ── */
  if (fetching) {
    return (
      <div className="pf-page">
        <div className="pf-wrap">
          <div className="pf-sidebar pf-skeleton-card" />
          <div className="pf-main">
            <div className="pf-section pf-skeleton-card" style={{ height: 220 }} />
            <div className="pf-section pf-skeleton-card" style={{ height: 100 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  /* ── Render ── */
  return (
    <div className="pf-page">
      <div className="pf-wrap">

        {/* ══ LEFT SIDEBAR CARD ══ */}
        <aside className="pf-sidebar">

          {/* Logo */}
          <div className="pf-sidebar__logo">
            <ThunioLogo size="md" />
          </div>

          {/* Avatar */}
          <div className="pf-avatar-wrap">
            {avatarPreview
              ? <img className="pf-avatar" src={avatarPreview} alt={user.username} />
              : <div className="pf-avatar pf-avatar--initials">{getInitials(user.username)}</div>
            }
            <label className="pf-avatar-btn" htmlFor="avatar-input" title="Change avatar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </label>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>

          {/* Avatar save/cancel */}
          {avatarFile && (
            <div className="pf-avatar-actions">
              <button
                className="pf-btn pf-btn--cancel pf-btn--sm"
                onClick={() => { setAvatarFile(null); setAvatarPreview(user.avatar || null); }}
              >
                Cancel
              </button>
              <button
                className="pf-btn pf-btn--save pf-btn--sm"
                onClick={handleSaveAvatar}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {loading ? <ThunioSpinner size="sm" color="white" /> : 'Save avatar'}
              </button>
            </div>
          )}

          <div className="pf-sidebar__name">{user.username}</div>

          {/* Active badge */}
          <div className={`pf-role-badge${user.active ? '' : ' pf-role-badge--inactive'}`}>
            <span className="pf-role-badge__dot" />
            {user.active ? 'Active' : 'Inactive'}
          </div>

          <div className="pf-sidebar__divider" />

          <p className="pf-sidebar__joined">
            Member since <strong>{formatJoinedDate(user.createdAt)}</strong>
          </p>
        </aside>

        {/* ══ RIGHT MAIN ══ */}
        <main className="pf-main">

          {/* ── Personal Information ── */}
          <section className="pf-section">
            <div className="pf-section__head">
              <h2 className="pf-section__title">Personal information</h2>
              {!editingInfo
                ? (
                  <button className="pf-edit-btn" onClick={() => setEditingInfo(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                ) : (
                  <button className="pf-edit-btn pf-edit-btn--active" onClick={handleCancelInfo}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Cancel
                  </button>
                )
              }
            </div>

            <div className="pf-fields">
              <div className="pf-field">
                <label className="pf-field__label">Username</label>
                {editingInfo
                  ? <input className="pf-field__input" name="username" value={infoForm.username} onChange={handleInfoChange} autoComplete="off" />
                  : <div className="pf-field__val">{user.username}</div>
                }
              </div>

              <div className="pf-field">
                <label className="pf-field__label">Email</label>
                {editingInfo
                  ? <input className="pf-field__input" name="email" type="email" value={infoForm.email} onChange={handleInfoChange} autoComplete="off" />
                  : <div className="pf-field__val">{user.email}</div>
                }
              </div>

              {/* ID — readonly, chỉ hiển thị khi không edit */}
              {!editingInfo && (
                <div className="pf-field">
                  <label className="pf-field__label">User ID</label>
                  <div className="pf-field__val pf-field__val--mono">{user._id}</div>
                </div>
              )}

              {editingInfo && (
                <div className="pf-actions">
                  <button className="pf-btn pf-btn--cancel" onClick={handleCancelInfo}>Cancel</button>
                  <button
                    className="pf-btn pf-btn--save"
                    onClick={handleSaveInfo}
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    {loading && <ThunioSpinner size="sm" color="white" />}
                    {loading ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ── Change Password ── */}
          <section className="pf-section">
            <div className="pf-section__head">
              <h2 className="pf-section__title">Change password</h2>
              {!editingPwd
                ? (
                  <button className="pf-edit-btn" onClick={() => setEditingPwd(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Change
                  </button>
                ) : (
                  <button className="pf-edit-btn pf-edit-btn--active" onClick={() => { setEditingPwd(false); setPwdForm({ current: '', newPwd: '', confirm: '' }); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Cancel
                  </button>
                )
              }
            </div>

            {!editingPwd
              ? <p className="pf-section__placeholder">Click "Change" to update your password.</p>
              : (
                <div className="pf-fields">
                  <div className="pf-field">
                    <label className="pf-field__label">Current password</label>
                    <input className="pf-field__input" name="current" type="password" value={pwdForm.current} onChange={handlePwdChange} placeholder="••••••••" />
                  </div>
                  <div className="pf-field-row">
                    <div className="pf-field">
                      <label className="pf-field__label">New password</label>
                      <input className="pf-field__input" name="newPwd" type="password" value={pwdForm.newPwd} onChange={handlePwdChange} placeholder="••••••••" />
                    </div>
                    <div className="pf-field">
                      <label className="pf-field__label">Confirm password</label>
                      <input className="pf-field__input" name="confirm" type="password" value={pwdForm.confirm} onChange={handlePwdChange} placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="pf-actions">
                    <button className="pf-btn pf-btn--cancel" onClick={() => { setEditingPwd(false); setPwdForm({ current: '', newPwd: '', confirm: '' }); }}>
                      Cancel
                    </button>
                    <button
                      className="pf-btn pf-btn--save"
                      onClick={handleSavePwd}
                      disabled={loading}
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      {loading && <ThunioSpinner size="sm" color="white" />}
                      {loading ? 'Updating…' : 'Update password'}
                    </button>
                  </div>
                </div>
              )
            }
          </section>

          {/* ── Danger Zone ── */}
          <section className="pf-section pf-section--danger">
            <div className="pf-section__head" style={{ marginBottom: 12 }}>
              <h2 className="pf-section__title pf-section__title--danger">Danger zone</h2>
            </div>

            {showDeleteDialog ? (
              /* ── Confirm dialog — giống DeleteBoard ── */
              <div className="delete-dialog">
                <div className="delete-dialog__icon">
                  <DeleteOutlineIcon style={{ fontSize: 24 }} />
                </div>
                <h2 className="delete-dialog__title">Delete Account</h2>
                <p className="delete-dialog__body">
                  Are you sure you want to delete your account? All your data will be permanently removed.
                </p>
                <div className="delete-dialog__warning">
                  <WarningAmberIcon style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }} />
                  <span>This action <strong>cannot be undone</strong>.</span>
                </div>
                <div className="dialog-actions">
                  <button className="btn btn-danger" onClick={handleDeleteAccount} disabled={loading}>
                    {loading ? 'Deleting…' : 'Yes, delete account'}
                  </button>
                  <button className="btn btn-ghost" onClick={() => setShowDeleteDialog(false)} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="pf-danger-row">
                <div>
                  <div className="pf-danger-row__title">Delete account</div>
                  <div className="pf-danger-row__desc">This will permanently delete your account and all your data.</div>
                </div>
                <button className="pf-btn pf-btn--danger" onClick={() => setShowDeleteDialog(true)}>
                  Delete account
                </button>
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
};

export default Profile;