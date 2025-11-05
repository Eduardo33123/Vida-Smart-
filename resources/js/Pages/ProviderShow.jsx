import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "../components/Layout.jsx";

const ProviderShow = ({ provider, sales = [], salesStats = {} }) => {
    // Función para formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(amount || 0);
    };

    // Función para formatear fecha
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Función para obtener tiempo transcurrido
    const getTimeAgo = (date) => {
        const now = new Date();
        const saleDate = new Date(date);
        const diffInSeconds = Math.floor((now - saleDate) / 1000);

        if (diffInSeconds < 60) return "Hace un momento";
        if (diffInSeconds < 3600)
            return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
        if (diffInSeconds < 86400)
            return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
        if (diffInSeconds < 2592000)
            return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
        return formatDate(date);
    };

    return (
        <Layout>
            <Head title={`${provider.name} - Proveedor`} />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                href="/proveedores"
                                className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                ← Volver a Proveedores
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center mt-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-6">
                            <span className="text-white text-3xl">🚚</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                {provider.name}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Detalles del proveedor y ventas realizadas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Estadísticas de Ventas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">🛒</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Ventas
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {salesStats.total_sales || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">💎</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Ganancias Totales
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(salesStats.total_profit)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">📦</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Unidades Vendidas
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {salesStats.total_quantity || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Ventas */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            🛒 Ventas Realizadas
                        </h2>
                        <Link
                            href="/vender"
                            className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors"
                        >
                            Ver todas las ventas →
                        </Link>
                    </div>

                    {sales.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-gray-400 text-2xl">
                                    🛒
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No hay ventas registradas
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Este proveedor aún no tiene ventas registradas
                            </p>
                            <Link
                                href="/vender"
                                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Realizar primera venta
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sales.map((sale) => (
                                <div
                                    key={sale.id}
                                    className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200"
                                >
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-4 flex-shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-900 dark:text-white text-sm font-medium truncate">
                                                    {sale.product?.name ||
                                                        "Producto no encontrado"}
                                                </p>
                                                <p className="text-gray-500 dark:text-gray-400 text-xs">
                                                    Cliente:{" "}
                                                    {sale.client_name ||
                                                        "Sin nombre"}
                                                </p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="text-green-600 dark:text-green-400 text-sm font-bold">
                                                    {formatCurrency(
                                                        sale.sale_price
                                                    )}
                                                </p>
                                                <p className="text-gray-500 dark:text-gray-400 text-xs">
                                                    {sale.quantity_sold}{" "}
                                                    unidades
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-gray-500 dark:text-gray-400 text-xs">
                                                Vendedor:{" "}
                                                {sale.seller?.name ||
                                                    "No asignado"}
                                            </p>
                                            <p className="text-gray-400 dark:text-gray-500 text-xs">
                                                {getTimeAgo(sale.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ProviderShow;
