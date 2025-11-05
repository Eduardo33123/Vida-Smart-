import React from "react";
import Layout from "../Components/Layout";

const Settings = () => {
    return (
        <Layout>
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">
                        Configuración
                    </h1>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-6">
                            Configuración del Sistema
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre de la aplicación
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Vida Smart"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email de contacto
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="contacto@vidasmart.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Descripción de la aplicación..."
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-300">
                                    Habilitar notificaciones por email
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-300">
                                    Modo oscuro (ya activado)
                                </label>
                            </div>

                            <div className="pt-4">
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
                                    Guardar Configuración
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
