import React from 'react';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation('pages');
  return (
    <div className="overflow-y-auto">
      <div className="flex xl:flex-row flex-col">
        <div className="xl:w-1/2 bg-primary px-6 py-10 text-text">
          <div className="xl:max-w-2xl xl:h-220 ml-auto border-4 border-secondary p-2 overflow-hidden flex xl:flex-col flex-col lg:flex-row gap-8">
            <div>
              <h1 className="sm:text-9xl text-7xl font-bold text-surface mb-4 flex flex-wrap">
                {t('home.build.title')}
              </h1>
              <p className="text-xl text-surface">{t('home.build.description')}</p>
            </div>

            <div className="flex h-full"></div>
          </div>
        </div>

        <div className="xl:w-1/2 px-6 py-10 text-text">
          <div className="xl:max-w-2xl xl:h-220 mr-auto border-4 border-secondary-light p-2 overflow-hidden flex xl:flex-col flex-col lg:flex-row gap-4">
            <div className="flex h-full"></div>

            <div className="self-end">
              <h1 className="sm:text-9xl text-7xl font-bold text-text mb-4 flex flex-wrap">
                {t('home.auto.title')}
              </h1>
              <p className="text-xl text-text">{t('home.auto.description')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary px-6 py-10 relative">
        <div className="w-1/2 left-1/2 top-0 bg-white h-80 absolute pt-10 opacity-0 xl:opacity-100">
          <div className="border-t-4 border-r-4 border-secondary-light max-w-174 h-full"></div>
        </div>
        <div className="max-w-348 mx-auto xl:h-150 border-4 border-secondary p-2 flex gap-8 lg:flex-row flex-col z-0">
          <div>
            <h1 className="sm:text-9xl text-7xl font-bold text-surface mb-4 flex flex-wrap">
              {t('home.share.title')}
            </h1>
            <p className="text-xl text-surface">{t('home.share.description')}</p>
          </div>

          <div className="flex h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
