import { Link } from "@inertiajs/react";
import React from "react";

const Layout = ({ children }) => {
    return (
        <>
            <header className="max-w-360 mx-auto mt-2 rounded-t-md overflow-hidden">
                <nav className="border-primary-light">
                    <div className="bg-primary-dark">
                        <h1 className="p-4 text-3xl font-bold text-secondary">
                            PC BUILDER
                        </h1>
                    </div>

                    <div className="flex items-center space-x-2 bg-primary text-white px-6">
                        <Link
                            className="py-1 px-2 border-r border-primary-light hover:text-secondary-light"
                            href="/"
                        >
                            Home
                        </Link>
                        <Link
                            className="py-1 hover:text-secondary-light"
                            href="/build"
                        >
                            Build
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="max-w-360 mx-auto mb-2 rounded-b-md overflow-hidden">
                {children}
            </main>
        </>
    );
};

export default Layout;
