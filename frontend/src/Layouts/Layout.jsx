import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../Contexts/AuthContext';
import { AlertIcon, ArrowIcon, MenuIcon } from '../Pages/Components/Common/Icons';
import LanguageSwitcher from '../Pages/Components/Common/LanguageSwitcher';
import VerifyEmailBanner from '../Pages/Components/Common/VerifyEmailBanner';
import { stripLocale, useLocalePath } from '../lib/localePath';

const Layout = () => {
  const { t } = useTranslation('layout');
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const lp = useLocalePath();
  const basePath = stripLocale(pathname);

  const [profileActive, setProfileActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setProfileActive(false);
      }
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuActive(false);
      }
    };

    if (profileActive || menuActive) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileActive, menuActive]);

  const navLinkClass = (path) => {
    const isActive = basePath.startsWith(path);
    return `flex-1 text-center py-4 px-6 transition ${
      isActive ? 'bg-primary text-white hover:bg-primary-light' : 'hover:bg-surface text-text'
    }`;
  };

  const menuLinkClass = (path) => {
    const isActive = basePath.startsWith(path);
    return `block py-3 px-4 transition ${
      isActive ? 'bg-primary text-white hover:bg-primary-light' : 'hover:bg-surface text-text'
    }`;
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header>
        <nav className="flex items-center bg-background shadow">
          <Link
            className="lg:hidden py-4 px-6 bg-primary text-white font-semibold hover:bg-primary-light transition"
            to={lp('/')}
          >
            BUILDER
          </Link>

          {user ? (
            <>
              <div className="hidden lg:flex lg:w-120.5 shrink-0">
                <Link
                  className="py-4 px-6 bg-primary text-white font-semibold hover:bg-primary-light transition"
                  to={lp('/')}
                >
                  BUILDER
                </Link>
                <Link className={navLinkClass('/builder')} to={lp('/builder')}>
                  {t('nav.build')}
                </Link>
                <Link className={navLinkClass('/builds')} to={lp('/builds')}>
                  {t('nav.saved')}
                </Link>
              </div>

              <button
                ref={menuButtonRef}
                className={`lg:hidden py-4 px-6 transition flex items-center gap-2 ${
                  menuActive ? 'bg-primary text-white' : 'hover:bg-surface text-text'
                }`}
                onClick={() => setMenuActive((prev) => !prev)}
              >
                <MenuIcon />
              </button>

              <div
                ref={menuRef}
                className={`lg:hidden absolute left-0 top-14 w-screen bg-background overflow-hidden transition-all shadow z-50 ${
                  menuActive ? 'h-24' : 'h-0'
                }`}
              >
                <Link
                  className={menuLinkClass('/builder')}
                  to={lp('/builder')}
                  onClick={() => setMenuActive(false)}
                >
                  {t('nav.build')}
                </Link>
                <Link
                  className={menuLinkClass('/builds')}
                  to={lp('/builds')}
                  onClick={() => setMenuActive(false)}
                >
                  {t('nav.saved')}
                </Link>
              </div>

              <div className="ml-auto relative flex items-center">
                <div className="flex">
                  <button
                    ref={buttonRef}
                    className={`py-4 px-6 transition flex items-center gap-2 font-medium ${
                      profileActive ? 'bg-primary text-white' : 'hover:bg-surface text-text'
                    }`}
                    onClick={() => setProfileActive((prev) => !prev)}
                  >
                    <span className="w-6 h-6 rounded-full bg-secondary-light flex items-center justify-center text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                    {!user.email_verified_at && <AlertIcon size={18} className="text-alert" />}
                    <ArrowIcon active={profileActive} />
                  </button>
                </div>

                <div
                  ref={dropdownRef}
                  className={`absolute right-0 top-14 sm:w-80 w-screen bg-background overflow-hidden transition-all shadow z-50 ${
                    profileActive ? 'h-42' : 'h-0'
                  }`}
                >
                  <div className="px-4 py-3 bg-surface flex items-center justify-between">
                    <p className="text-text font-semibold uppercase">
                      {t('nav.hello', { name: user.name })}
                    </p>
                    <LanguageSwitcher />
                  </div>
                  <div>
                    <Link
                      to={lp('/profile')}
                      className="flex items-center gap-2 px-4 py-2 text-text hover:bg-secondary-light transition"
                    >
                      {t('nav.profile')}
                      {!user.email_verified_at && <AlertIcon size={18} className="text-alert" />}
                    </Link>
                    <Link
                      to={lp('/guide')}
                      className="flex items-center gap-2 px-4 py-2 text-text hover:bg-secondary-light transition"
                    >
                      {t('nav.guide')}
                    </Link>
                    <form onSubmit={handleLogout}>
                      <button className="w-full px-4 py-2 text-danger hover:bg-danger/50 transition text-left cursor-pointer">
                        {t('nav.signOut')}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="hidden lg:flex shrink-0">
                <Link
                  className="py-4 px-6 bg-primary text-white font-semibold hover:bg-primary-light transition"
                  to={lp('/')}
                >
                  BUILDER
                </Link>
                <Link className={navLinkClass('/builder')} to={lp('/builder')}>
                  {t('nav.build')}
                </Link>
              </div>

              <button
                ref={menuButtonRef}
                className={`lg:hidden py-4 px-6 transition flex items-center gap-2 ${
                  menuActive ? 'bg-primary text-white' : 'hover:bg-surface text-text'
                }`}
                onClick={() => setMenuActive((prev) => !prev)}
              >
                <MenuIcon />
              </button>

              <div
                ref={menuRef}
                className={`lg:hidden absolute left-0 top-14 w-screen bg-background overflow-hidden transition-all shadow z-50 ${
                  menuActive ? 'h-12' : 'h-0'
                }`}
              >
                <Link
                  className={menuLinkClass('/builder')}
                  to={lp('/builder')}
                  onClick={() => setMenuActive(false)}
                >
                  {t('nav.build')}
                </Link>
              </div>

              <div className="ml-auto flex items-center">
                <LanguageSwitcher className="mr-2" />
                <Link className="py-4 px-6 hover:bg-surface transition" to={lp('/login')}>
                  {t('nav.signIn')}
                </Link>
              </div>
            </>
          )}
        </nav>
        {user && !user.email_verified_at && <VerifyEmailBanner />}
      </header>

      <div id="page-scroll" className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="bg-primary border-t border-primary-light">
          <div className="max-w-348 mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-bold text-white">BUILDER</span>
              <p className="text-surface text-sm mt-1">{t('footer.tagline')}</p>
            </div>
            <div className="flex gap-6 text-sm text-surface">
              <Link to={lp('/builder')} className="hover:text-white transition">
                {t('nav.build')}
              </Link>
              {user && (
                <Link to={lp('/builds')} className="hover:text-white transition">
                  {t('nav.saved')}
                </Link>
              )}
              <Link to={lp('/guide')} className="hover:text-white transition">
                {t('nav.guide')}
              </Link>
            </div>
            <a
              href="https://github.com/karlisye"
              target="_blank"
              className="text-surface hover:text-white transition text-sm"
            >
              @karlisye
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
