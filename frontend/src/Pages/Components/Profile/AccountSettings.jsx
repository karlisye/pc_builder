import axios from 'axios';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../Common/Modal';
import { useAuth } from '../../../Contexts/AuthContext';
import { useToast } from '../../../Contexts/ToastContext';
import { AlertIcon } from '../Common/Icons';

const AccountSettings = () => {
  const { t } = useTranslation(['profile', 'common']);
  const { user, setUser, resendVerification } = useAuth();
  const { addToast } = useToast();
  const [resending, setResending] = useState(false);
  const [editActive, setEditActive] = useState(false);
  const [name, setName] = useState(user?.name ?? '');

  const [error, setError] = useState('');

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');

  const [passError, setPassError] = useState('');

  const [deleting, setDeleting] = useState(false);
  const [sendingDelete, setSendingDelete] = useState(false);
  const [deleteSent, setDeleteSent] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!editActive) {
      setEditActive(true);
      return;
    }

    if (name.length < 3) {
      setError(t('accountSettings.nameTooShort'));
      return;
    }

    try {
      const res = await axios.patch(`/api/users/${user.id}`, {
        name,
      });
      if (res.status === 200) {
        setUser(res.data);
        setError('');
        addToast(t('accountSettings.infoUpdated'), { type: 'success' });
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors ? Object.values(errors).flat().join(', ') : t('accountSettings.infoUpdateError'),
      );
    } finally {
      setEditActive(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`/api/users/${user.id}`, {
        password: oldPass,
        new_password: newPass,
        new_password_confirmation: newPassConfirm,
      });
      if (res.status === 200) {
        setPassError('');
        addToast(t('accountSettings.passwordUpdated'), { type: 'success' });
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      setPassError(
        errors
          ? Object.values(errors)
              .flat()
              .map((err, i) => (
                <span key={i} className="text-danger text-sm block">
                  {err}
                </span>
              ))
          : t('accountSettings.passwordUpdateError'),
      );
    } finally {
      setOldPass('');
      setNewPass('');
      setNewPassConfirm('');
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await resendVerification();
      addToast(t('common:verifyEmail.resendSuccess'), { type: 'success' });
    } catch (err) {
      addToast(err.response?.data?.message ?? t('common:verifyEmail.resendError'), {
        type: 'danger',
      });
    } finally {
      setResending(false);
    }
  };

  const handleDeleteAccount = async () => {
    setSendingDelete(true);
    setDeleteError('');
    try {
      await axios.post(`/api/users/${user.id}/delete-confirmation`);
      setDeleteSent(true);
    } catch (err) {
      setDeleteError(err.response?.data?.message ?? t('accountSettings.deleteConfirmError'));
    } finally {
      setSendingDelete(false);
    }
  };

  return (
    <div className="py-6 px-4">
      {!user.email_verified_at && (
        <div className="bg-alert/10 border border-alert/80 px-4 py-2 mb-4 flex gap-4 items-center">
          <span className="text-alert">
            <AlertIcon />
          </span>
          <p className="text-alert text-sm flex-1">{t('common:verifyEmail.banner')}</p>
          <button
            onClick={handleResendVerification}
            disabled={resending}
            className="text-alert text-sm underline hover:no-underline cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {t('common:verifyEmail.resend')}
          </button>
        </div>
      )}

      <h1 className="text-4xl text-text font-semibold mb-4">{t('accountSettings.heading')}</h1>

      <h2 className="text-2xl text-text font-semibold mb-4">
        {t('accountSettings.personalInfoHeading')}
      </h2>

      <p className="text-muted mb-4">
        {user.email}
        {' · '}
        <span className={user.email_verified_at ? 'text-success' : 'text-alert'}>
          {user.email_verified_at
            ? t('accountSettings.emailVerified')
            : t('accountSettings.emailNotVerified')}
        </span>
        {!user.email_verified_at && (
          <>
            {' · '}
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resending}
              className="text-alert underline hover:no-underline cursor-pointer disabled:opacity-50"
            >
              {t('common:verifyEmail.resend')}
            </button>
          </>
        )}
      </p>

      <form>
        <div className="grid xl:grid-cols-2 gap-4">
          <div className="">
            <label className="block text-muted" htmlFor="name">
              {t('accountSettings.nameLabel')}
            </label>
            <input
              className="p-2 bg-surface w-full disabled:text-muted focus:outline outline-border transition"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editActive}
            />
          </div>
        </div>

        {error && <p className="text-danger text-sm">{error}</p>}

        <div className="space-x-2">
          <button
            className="py-2 px-6 bg-primary text-white hover:bg-primary-light cursor-pointer mt-2 transition"
            onClick={handleEdit}
          >
            {editActive ? t('accountSettings.save') : t('accountSettings.edit')}
          </button>

          {editActive && (
            <button
              className="py-2 px-6 bg-surface text-text hover:bg-secondary-light cursor-pointer mt-2 transition"
              onClick={(e) => {
                setEditActive(false);
                setName(user.name);
                setError('');
              }}
            >
              {t('accountSettings.cancel')}
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl text-text font-semibold my-4">
        {t('accountSettings.changePasswordHeading')}
      </h2>
      <form onSubmit={updatePassword}>
        <div className="grid xl:grid-cols-2 gap-4">
          <div className="">
            <label className="block text-muted" htmlFor="oldPass">
              {t('accountSettings.oldPasswordLabel')}
            </label>
            <input
              className="p-2 bg-surface w-full disabled:text-muted focus:outline outline-border transition"
              type="password"
              id="oldPass"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
            />
          </div>
          <div></div>

          <div className="">
            <label className="block text-muted" htmlFor="newPass">
              {t('accountSettings.newPasswordLabel')}
            </label>
            <input
              className="p-2 bg-surface w-full disabled:text-muted focus:outline outline-border transition"
              type="password"
              id="newPass"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
          </div>

          <div className="">
            <label className="block text-muted" htmlFor="newPassConfirm">
              {t('accountSettings.confirmNewPasswordLabel')}
            </label>
            <input
              className="p-2 bg-surface w-full disabled:text-muted focus:outline outline-border transition"
              type="password"
              id="newPassConfirm"
              value={newPassConfirm}
              onChange={(e) => setNewPassConfirm(e.target.value)}
            />
          </div>
        </div>

        {passError && <p className="text-danger text-sm">{passError}</p>}

        <button
          className="py-2 px-6 bg-primary text-white hover:bg-primary-light cursor-pointer mt-2 transition disabled:text-muted"
          disabled={!oldPass || !newPass || !newPassConfirm}
        >
          {t('accountSettings.save')}
        </button>
      </form>

      <h2 className="text-2xl text-text font-semibold my-4">
        {t('accountSettings.deleteAccountHeading')}
      </h2>
      <button
        className="py-4 px-8 bg-primary text-white hover:bg-danger/80 cursor-pointer mt-2 transition disabled:text-muted mb-6"
        onClick={() => {
          setDeleteSent(false);
          setDeleteError('');
          setDeleting(true);
        }}
      >
        {t('accountSettings.deleteAccountButton')}
      </button>

      {deleting && (
        <Modal close={() => setDeleting(false)}>
          <h1 className="text-text font-semibold text-3xl mt-4 mx-4 max-w-120">
            {t('accountSettings.deleteConfirmTitle')}
          </h1>
          <p className="text-muted text-sm mb-4 mx-4">
            {t('accountSettings.deleteConfirmSubtitle')}
          </p>

          <p className="text-muted mx-4 mb-4">
            {deleteSent
              ? t('accountSettings.deleteConfirmSent')
              : t('accountSettings.deleteConfirmInstruction', { email: user.email })}
          </p>

          {deleteError && <p className="text-danger text-sm mx-4">{deleteError}</p>}

          <div className="flex gap-4 m-4">
            {deleteSent ? (
              <button
                className="flex-1 p-4 bg-surface text-text cursor-pointer hover:bg-secondary-light transition"
                onClick={() => setDeleting(false)}
              >
                {t('accountSettings.close')}
              </button>
            ) : (
              <>
                <button
                  className="flex-1 p-4 bg-primary text-background cursor-pointer hover:bg-primary-light transition disabled:opacity-50"
                  disabled={sendingDelete}
                  onClick={handleDeleteAccount}
                >
                  {t('accountSettings.deleteConfirmSend')}
                </button>
                <button
                  className="flex-1 p-4 bg-surface text-text cursor-pointer hover:bg-secondary-light transition"
                  onClick={() => {
                    setDeleting(false);
                    setDeleteError('');
                  }}
                >
                  {t('accountSettings.cancelDelete')}
                </button>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AccountSettings;
