import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Layout from "../Components/Layout";
import { ProviderModal } from "../Components/Modal";

const Proveedores = ({ providers = [], currencies = [] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const { delete: deleteProvider } = useForm();

    const handleEditProvider = (provider) => {
        setSelectedProvider(provider);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProvider(null);
    };

    const handleDeleteProvider = (provider) => {
        if (
            confirm(`¿Estás seguro de que quieres eliminar "${provider.name}"?`)
        ) {
            deleteProvider(`/providers/${provider.id}`, {
                onSuccess: () => {
                    // El proveedor se eliminará y la página se actualizará automáticamente
                },
                onError: (errors) => {
                    alert(
                        "Error al eliminar el proveedor: " +
                            Object.values(errors).join(", ")
                    );
                },
            });
        }
    };

    return (
        <Layout>
            <Head title="Proveedores - Vida Smart" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-6">
                                <span className="text-white text-2xl">🚚</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    🚚 Proveedores
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Gestiona todos los proveedores de productos
                                    de domótica
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
                        >
                            <span className="mr-2">➕</span>
                            Agregar Proveedor
                        </button>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">🚚</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Proveedores
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {providers.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">✅</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Activos
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {
                                        providers.filter((p) => p.is_active)
                                            .length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">💱</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Monedas
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {currencies.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid de Proveedores */}
                {providers.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-gray-400 text-4xl">🚚</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            No hay proveedores registrados
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                            Comienza agregando tu primer proveedor
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Agregar Primer Proveedor
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {providers.map((provider) => (
                            <div
                                key={provider.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200"
                            >
                                {/* Header de la Card */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                                                <span className="text-xl text-white">
                                                    🚚
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {provider.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    ID: #{provider.id}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs font-medium px-3 py-1 rounded-full ${
                                                provider.is_active
                                                    ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                                                    : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                                            }`}
                                        >
                                            {provider.is_active
                                                ? "Activo"
                                                : "Inactivo"}
                                        </span>
                                    </div>

                                    {/* Información del Proveedor */}
                                    <div className="space-y-3">
                                        {provider.email && (
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <span className="mr-3">📧</span>
                                                <span className="font-medium">
                                                    {provider.email}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <span className="mr-3">💱</span>
                                            <span className="font-medium">
                                                {provider.currency?.symbol}{" "}
                                                {provider.currency?.code} -{" "}
                                                {provider.currency?.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Descripción */}
                                {provider.description && (
                                    <div className="px-6 pb-4">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                                            {provider.description}
                                        </p>
                                    </div>
                                )}

                                {/* Botones de Acción */}
                                <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleEditProvider(provider)
                                            }
                                            className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            ✏️ Editar
                                        </button>
                                        <Link
                                            href={`/providers/${provider.id}`}
                                            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-center"
                                        >
                                            👁️ Ver
                                        </Link>
                                    </div>

                                    {/* Botón de Eliminar */}
                                    <div className="mt-3">
                                        <button
                                            onClick={() =>
                                                handleDeleteProvider(provider)
                                            }
                                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                <ProviderModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    provider={selectedProvider}
                    currencies={currencies}
                />
            </div>
        </Layout>
    );
};

export default Proveedores;
