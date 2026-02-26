import { Link } from "@inertiajs/react";
import React from "react";

const NotFound = () => {
    return (
        <div>
            <h1>404</h1>
            <p>Page not found</p>
            <Link href="/">Go Home</Link>
        </div>
    );
};

NotFound.layout = (page) => page;

export default NotFound;
