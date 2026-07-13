import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useAuth } from '../Contexts/AuthContext';
import { useLocalePath } from '../lib/localePath';
import ComponentMarquee from './Components/Home/ComponentMarquee';
import BudgetBuildDemo from './Components/Home/BudgetBuildDemo';
import SavedBuildsDemo from './Components/Home/SavedBuildsDemo';

const Home = () => {
  const { t } = useTranslation('pages');
  const { user } = useAuth();
  const lp = useLocalePath();

  return (
    <div className="overflow-y-auto max-w-screen">
      <div className="w-full bg-primary px-6 py-10">
        <div className="border-4 border-secondary h-full max-w-347 mx-auto flex gap-4 p-2 flex-col">
          <h1 className="sm:text-9xl text-7xl font-bold text-surface mb-4 flex flex-wrap">
            {(() => {
              const title = t('home.hero.title');
              const splitIndex = title.slice(1).search(/[A-Z]/) + 1;
              if (splitIndex <= 0) return title;
              return (
                <>
                  {title.slice(0, splitIndex)}
                  <br className="sm:hidden" />
                  {title.slice(splitIndex)}
                </>
              );
            })()}
          </h1>
          <p className="text-xl text-surface max-w-3xl">{t('home.hero.description')}</p>

          <div className="flex flex-col sm:flex-row gap-4 items-center mt-auto">
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
            <div className="flex-1">
              <h1 className="md:text-9xl sm:text-7xl text-6xl font-bold text-surface mb-4 flex flex-wrap">
                {t('home.build.title')}
              </h1>
              <p className="text-xl text-surface">{t('home.build.description')}</p>
            </div>

            <ComponentMarquee className="h-48 sm:h-56 md:h-64 lg:h-72 xl:h-100 mt-auto my-auto items-center min-w-0 flex-1" />
          </div>
        </div>

        <div className="xl:w-1/2 px-6 py-10 text-text bg-background">
          <div className="xl:max-w-2xl xl:h-220 mr-auto border-4 border-secondary-light p-2 overflow-hidden flex xl:flex-col flex-col lg:flex-row gap-4">
            <BudgetBuildDemo className="xl:h-100 h-80 my-auto" />

            <div className="self-end">
              <h1 className="md:text-9xl sm:text-7xl text-6xl font-bold text-text mb-4 flex flex-wrap">
                {t('home.auto.title')}
              </h1>
              <p className="text-xl text-text">{t('home.auto.description')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-background px-6 py-10 text-text">
        <div className="border-4 border-secondary-light h-full max-w-347 mx-auto flex gap-4 p-2 flex-col xl:flex-row items-center">
          <div>
            <h1 className="md:text-9xl sm:text-7xl text-6xl font-bold text-text mb-4 flex flex-wrap">
              {t('home.save.title')}
            </h1>
            <p className="text-xl text-text mb-4">{t('home.save.description')}</p>
          </div>

          <SavedBuildsDemo className="w-full md:h-100 h-80" />
        </div>
      </div>
    </div>
  );
};

export default Home;
