import React from 'react';
import { useBuild } from '../contexts/BuildContext';
import PcListView from './PcListView';

const PcAddComponentModal = () => {
  const { setIsAddModalActive } = useBuild();
  const handleLeave = () => {
    setIsAddModalActive(false);
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 backdrop-blur-xs" onClick={handleLeave}>
      <div
        className="fixed top-1/2 left-1/2 transform -translate-1/2 bg-primary-dark p-4 shadow-lg rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <h2 className="font-bold text-3xl mb-6 bg-primary-light px-6 py-1 rounded-md text-secondary">
            Add a Component
          </h2>
          <button className="w-8 h-8 text-secondary hover:cursor-pointer" onClick={handleLeave}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                {' '}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                  fill="currentColor"
                ></path>{' '}
              </g>
            </svg>
          </button>
        </div>

        <PcListView />
      </div>
    </div>
  );
};

export default PcAddComponentModal;
