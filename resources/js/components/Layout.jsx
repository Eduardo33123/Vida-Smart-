import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import Sidebar from "./Sidebar.jsx";

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-900 flex">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                user={auth.user}
            />

            {/* Contenido principal */}
            <div className="flex-1 lg:ml-64">
                {/* Header móvil */}
                <div className="lg:hidden bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-400 hover:text-white"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <h1 className="text-white font-semibold">Vida Smart</h1>
                </div>

                {/* Contenido */}
                <main className="bg-gray-900 min-h-screen">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
