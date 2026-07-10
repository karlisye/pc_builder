import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useAuth } from '../Contexts/AuthContext';
import { useLocalePath } from '../lib/localePath';

const Home = () => {
  const { t } = useTranslation('pages');
  const { user } = useAuth();
  const lp = useLocalePath();

  return (
    <div className="overflow-y-auto">
      <div className="w-full bg-primary px-6 py-10">
        <div className="border-4 border-secondary h-full max-w-347 mx-auto flex gap-4 p-2 flex-col">
          <h1 className="sm:text-9xl text-7xl font-bold text-surface mb-4 flex flex-wrap">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl text-surface max-w-3xl">{t('home.hero.description')}</p>

          <div className="flex gap-4 items-center mt-auto">
            <Link
              to={lp('/builder')}
              className="bg-secondary-light hover:bg-secondary-light/50 transition cursor-pointer text-text py-4 md:w-60 w-full text-center"
            >
              {t('home.hero.startBuilding')}
            </Link>
            {user ? (
              <Link
                to={lp('/builds')}
                className="border-2 border-secondary-light hover:bg-secondary-light/20 transition cursor-pointer text-surface py-4 md:w-60 w-full text-center"
              >
                {t('home.hero.myBuilds')}
              </Link>
            ) : (
              <Link
                to={lp('/login')}
                className="border-2 border-secondary-light hover:bg-secondary-light/20 transition cursor-pointer text-surface py-4 md:w-60 w-full text-center"
              >
                {t('home.hero.signIn')}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="flex xl:flex-row flex-col">
        <div className="xl:w-1/2 bg-primary px-6 py-10 text-text">
          <div className="xl:max-w-2xl xl:h-220 ml-auto border-4 border-secondary p-2 overflow-hidden flex xl:flex-col flex-col lg:flex-row gap-8">
            <div>
              <h1 className="sm:text-9xl text-7xl font-bold text-surface mb-4 flex flex-wrap">
                {t('home.build.title')}
              </h1>
              <p className="text-xl text-surface">{t('home.build.description')}</p>
            </div>

            <div className="flex w-full xl:h-full h-80 bg-muted"></div>
          </div>
        </div>

        <div className="xl:w-1/2 px-6 py-10 text-text">
          <div className="xl:max-w-2xl xl:h-220 mr-auto border-4 border-secondary-light p-2 overflow-hidden flex xl:flex-col flex-col lg:flex-row gap-4">
            <div className="flex w-full xl:h-full h-80 bg-muted"></div>

            <div className="self-end">
              <h1 className="sm:text-9xl text-7xl font-bold text-text mb-4 flex flex-wrap">
                {t('home.auto.title')}
              </h1>
              <p className="text-xl text-text">{t('home.auto.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
