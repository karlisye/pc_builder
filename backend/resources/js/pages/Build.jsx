import React, { useState } from "react";
import { buildService } from "../services/server";
import PriceSlider from "../components/PriceSlider";
import PcInteractiveView from "../components/PcInteractiveView";
import PcListView from "../components/PcListView";
import PcInfo from "../components/PcInfo";
import { BuildContext } from "../contexts/BuildContext";
import PcComponentModal from "../components/PcComponentModal";
import LoadingSpinner from "../components/LoadingSpinner";
import PcAddComponentModal from "../components/PcAddComponentModal";

const Build = () => {
    const [loading, setLoading] = useState(false);
    const [budget, setBudget] = useState(1000);
    const [build, setBuild] = useState(null);
    const [isInteractiveViewActive, setIsInteractiveViewActive] =
        useState(true);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [isComponentModalActive, setIsComponentModalActive] = useState(false);
    const [isAddModalActive, setIsAddModalActive] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);

        try {
            const data = await buildService.generateBuild(budget);
            setBuild(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BuildContext
            value={{
                build,
                setSelectedComponent,
                setIsComponentModalActive,
                setIsAddModalActive,
            }}
        >
            <div className="p-4 flex flex-wrap bg-primary-dark">
                <div className="flex-1 p-3 flex items-center flex-col gap-3 bg-primary-light rounded-l-lg">
                    <div className="bg-primary py-2 px-16 rounded-lg">
                        <h1 className="font-bold text-5xl text-secondary text-nowrap">
                            BUILD A PC
                        </h1>
                    </div>

                    <div className="bg-primary p-4 w-full rounded-xl flex flex-col gap-3">
                        <span className="text-white font-semibold text-lg text-center">
                            Select your PC budget
                        </span>

                        <PriceSlider setBudget={setBudget} budget={budget} />

                        <button
                            className="bg-secondary hover:bg-secondary-dark border-secondary-light border-2 font-semibold h-10 w-35 rounded-lg hover:cursor-pointer flex justify-center items-center mx-auto"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? (
                                <LoadingSpinner />
                            ) : build ? (
                                "Regenerate"
                            ) : (
                                "Generate"
                            )}
                        </button>
                    </div>

                    {build && <PcInfo build={build} />}
                </div>

                <div className="flex-2 max-w-full">
                    {build ? (
                        <>
                            <div className="flex justify-between items-center bg-primary-light p-3 rounded-tr-lg">
                                <div>
                                    <button
                                        className={`p-2 text-white hover:cursor-pointer rounded-l-md ${isInteractiveViewActive ? "bg-primary-dark shadow-xl" : "bg-primary"}`}
                                        onClick={() =>
                                            setIsInteractiveViewActive(true)
                                        }
                                    >
                                        Interactive
                                    </button>
                                    <button
                                        className={`p-2 text-white hover:cursor-pointer rounded-r-md ${isInteractiveViewActive ? "bg-primary" : "bg-primary-dark shadow-xl"}`}
                                        onClick={() =>
                                            setIsInteractiveViewActive(false)
                                        }
                                    >
                                        List
                                    </button>
                                </div>

                                <button
                                    className="text-white hover:cursor-pointer bg-danger-darker hover:bg-danger-darker/90 px-6 py-1 rounded-md border-2 border-danger-dark text-sm"
                                    onClick={() => setBuild(null)}
                                >
                                    Remove
                                </button>
                            </div>

                            {isInteractiveViewActive ? (
                                <PcInteractiveView />
                            ) : (
                                <PcListView />
                            )}
                        </>
                    ) : (
                        <div className="bg-primary-light h-full p-3">
                            <div className="bg-primary p-4 rounded-xl h-full flex flex-col items-center justify-center gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-secondary text-center">
                                        Generate a PC to see its components
                                    </h2>
                                    <p className="text-white text-center">
                                        Select price and click Generate button
                                    </p>
                                </div>

                                <button
                                    className="bg-primary border-primary-lighter border-2 rounded-md p-2 text-primary-lighter hover:bg-primary-dark hover:cursor-pointer"
                                    title="Add a specific component"
                                    onClick={() => setIsAddModalActive(true)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isComponentModalActive && (
                <PcComponentModal component={selectedComponent} />
            )}
            {isAddModalActive && <PcAddComponentModal />}
        </BuildContext>
    );
};

export default Build;
