import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "../Components/Layout.jsx";

const Dashboard = ({ analytics, recentSales, statistics }) => {
    // Función para formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(amount || 0);
    };

    // Función para formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Función para obtener el tiempo relativo
    const getTimeAgo = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return "Hace un momento";
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
        if (diffInMinutes < 1440)
            return `Hace ${Math.floor(diffInMinutes / 60)} h`;
        return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
    };
    return (
        <Layout>
            <Head title="Dashboard - Vida Smart" />
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mr-6 border border-gray-600">
                                <span className="text-white text-2xl">🏠</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white">
                                    Dashboard
                                </h1>
                                <p className="mt-2 text-lg text-gray-300">
                                    Bienvenido a Vida Smart - Panel de Control
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cards de estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4 border border-gray-600">
                                    <span className="text-white text-xl">
                                        👥
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-400">
                                        Usuarios
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {statistics?.total_users || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4 border border-gray-600">
                                    <span className="text-white text-xl">
                                        💰
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-400">
                                        Ingresos Totales
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {formatCurrency(
                                            statistics?.total_revenue
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4 border border-gray-600">
                                    <span className="text-white text-xl">
                                        📈
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-400">
                                        Crecimiento
                                    </p>
                                    <p
                                        className={`text-2xl font-bold ${
                                            statistics?.growth_percentage >= 0
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {statistics?.growth_percentage >= 0
                                            ? "+"
                                            : ""}
                                        {statistics?.growth_percentage || 0}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4 border border-gray-600">
                                    <span className="text-white text-xl">
                                        🛒
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-400">
                                        Ventas Recientes
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {statistics?.recent_activity || 0}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Últimos 7 días
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Gráfico */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-white text-xl">
                                        📊
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        Actividad Reciente
                                    </h3>
                                </div>
                            </div>
                            <div className="h-64 bg-gray-800/80 rounded-xl flex items-center justify-center border border-gray-600 hover:border-gray-500 transition-all duration-300">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-gray-300 text-2xl">
                                            📈
                                        </span>
                                    </div>
                                    <p className="text-gray-400">
                                        Gráfico de actividad
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ventas Recientes */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-white text-xl">
                                            💰
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            Ventas Recientes
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            Historial de ventas más recientes
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/vender"
                                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                                >
                                    Ver todas →
                                </Link>
                            </div>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {recentSales && recentSales.length > 0 ? (
                                    recentSales.map((sale) => (
                                        <div
                                            key={sale.id}
                                            className="flex items-center p-4 bg-gray-800/80 rounded-xl border border-gray-600 hover:border-emerald-500 transition-all duration-300 hover:bg-gray-700/80"
                                        >
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-4 flex-shrink-0"></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white text-sm font-medium truncate">
                                                            {sale.product
                                                                ?.name ||
                                                                "Producto no encontrado"}
                                                        </p>
                                                        <p className="text-gray-400 text-xs">
                                                            Cliente:{" "}
                                                            {sale.client_name ||
                                                                "Sin nombre"}
                                                        </p>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <p className="text-emerald-400 text-sm font-bold">
                                                            {formatCurrency(
                                                                sale.sale_price
                                                            )}
                                                        </p>
                                                        <p className="text-gray-400 text-xs">
                                                            {sale.quantity_sold}{" "}
                                                            unidades
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="text-gray-400 text-xs">
                                                        Vendedor:{" "}
                                                        {sale.seller?.name ||
                                                            "No asignado"}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        {getTimeAgo(
                                                            sale.created_at
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-gray-400 text-2xl">
                                                🛒
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            No hay ventas recientes
                                        </p>
                                        <Link
                                            href="/vender"
                                            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mt-2 inline-block transition-colors"
                                        >
                                            Realizar primera venta
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
