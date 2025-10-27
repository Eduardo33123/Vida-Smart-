import React from "react";
import { Link, useForm } from "@inertiajs/react";

const Sidebar = ({ isOpen, onClose, user }) => {
    const { post } = useForm();

    const menuItems = [
        { name: "Dashboard", href: "/dashboard", icon: "🏠" },
        { name: "Categoría", href: "/categoria", icon: "🏷️" },
        { name: "Proveedores", href: "/proveedores", icon: "🚚" },
        { name: "Inventario", href: "/inventario", icon: "📦" },
        {
            name: "Inventario Compartido",
            href: "/shared-inventory",
            icon: "🤝",
        },
        { name: "Vender", href: "/vender", icon: "🛒" },
        { name: "Analytics", href: "/analytics", icon: "📊" },
        { name: "Inversión", href: "/inversion", icon: "💰" },
        { name: "Marca", href: "/marca", icon: "🏪" },
        {
            name: "Instalaciones / Servicios",
            href: "/instalaciones",
            icon: "🔧",
        },
        { name: "Perfil", href: "/profile", icon: "👤" },
        { name: "Configuración", href: "/settings", icon: "⚙️" },
        { name: "Ayuda", href: "/help", icon: "❓" },
    ];

    const handleLogout = () => {
        post("/logout");
    };

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 text-white transform transition-transform duration-300 ease-in-out z-50
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:relative lg:z-auto flex flex-col
            `}
            >
                {/* Header del Sidebar */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
                    <h1 className="text-xl font-bold text-white">Vida Smart</h1>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Navegación */}
                <nav className="mt-6 flex-1 px-3">
                    <div>
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg mb-2 transition-colors duration-200"
                            >
                                <span className="text-xl mr-3">
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Footer del Sidebar */}
                <div className="mt-auto p-6 border-t border-gray-700 flex-shrink-0">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                                {user ? user.name.charAt(0).toUpperCase() : "U"}
                            </span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">
                                {user ? user.name : "Usuario"}
                            </p>
                            <p className="text-xs text-gray-400">
                                {user ? user.email : "usuario@ejemplo.com"}
                            </p>
                        </div>
                    </div>

                    {/* Botón de Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                        <span className="mr-2">🚪</span>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
