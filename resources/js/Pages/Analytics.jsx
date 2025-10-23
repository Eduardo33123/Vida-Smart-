import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "../components/Layout";

const Analytics = ({ analytics }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(amount);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat("es-MX").format(number);
    };

    return (
        <Layout>
            <Head title="Analytics - Vida Smart" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-6">
                            <span className="text-white text-2xl">📊</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                📊 Analytics
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Análisis completo de ventas, ganancias y
                                rendimiento
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cards de Estadísticas Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total de Ventas */}
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-100">
                                    Total de Ventas
                                </p>
                                <p className="text-2xl font-bold text-white">
                                    {formatNumber(analytics.total_sales)}
                                </p>
                            </div>
                            <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                <span className="text-2xl">🛒</span>
                            </div>
                        </div>
                    </div>

                    {/* Total de Ingresos */}
                    <Link href="/analytics/revenue" className="block">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-100">
                                        Total de Ingresos
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {formatCurrency(
                                            analytics.total_revenue
                                        )}
                                    </p>
                                </div>
                                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                    <span className="text-2xl">💰</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Total de Comisiones */}
                    <Link href="/analytics/commissions" className="block">
                        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-100">
                                        Total de Comisiones
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {formatCurrency(
                                            analytics.total_commissions
                                        )}
                                    </p>
                                </div>
                                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                    <span className="text-2xl">💸</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Ganancia Neta */}
                    <Link href="/analytics/profit" className="block">
                        <div
                            className={`rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 ${
                                analytics.net_profit >= 0
                                    ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                                    : "bg-gradient-to-br from-red-500 to-pink-600"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p
                                        className={`text-sm font-medium ${
                                            analytics.net_profit >= 0
                                                ? "text-emerald-100"
                                                : "text-red-100"
                                        }`}
                                    >
                                        Ganancia Neta
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {formatCurrency(analytics.net_profit)}
                                    </p>
                                </div>
                                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                    <span className="text-2xl">
                                        {analytics.net_profit >= 0
                                            ? "📈"
                                            : "📉"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Sección de Análisis por Producto */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Top Productos Vendidos */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl shadow-lg p-6 border border-orange-200 dark:border-orange-700">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">🏆</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    🏆 Top Productos Vendidos
                                </h3>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {analytics.top_products &&
                            analytics.top_products.length > 0 ? (
                                analytics.top_products.map((product, index) => (
                                    <Link
                                        key={product.product_id}
                                        href={`/analytics/product/${product.product_id}`}
                                        className="block"
                                    >
                                        <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-orange-200 dark:border-orange-600 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">
                                                            #{index + 1}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                                            {
                                                                product.product_name
                                                            }
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {formatNumber(
                                                                product.total_quantity
                                                            )}{" "}
                                                            unidades vendidas
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                                                        {formatCurrency(
                                                            product.total_revenue
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Ingresos totales
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-gray-400 text-2xl">
                                            📦
                                        </span>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No hay datos de productos vendidos
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Análisis por Vendedor */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">👥</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    👥 Rendimiento por Vendedor
                                </h3>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {analytics.sales_by_seller &&
                            analytics.sales_by_seller.length > 0 ? (
                                analytics.sales_by_seller.map(
                                    (seller, index) => (
                                        <Link
                                            key={seller.seller_id}
                                            href={`/analytics/seller/${seller.seller_id}`}
                                            className="block"
                                        >
                                            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-200 cursor-pointer transform hover:scale-105">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-sm font-bold">
                                                            #{index + 1}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {seller.seller_name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatNumber(
                                                                seller.total_sales
                                                            )}{" "}
                                                            ventas
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-blue-600 dark:text-blue-400">
                                                        {formatCurrency(
                                                            seller.total_revenue
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                                        Comisión:{" "}
                                                        {formatCurrency(
                                                            seller.total_commission
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                )
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                    No hay datos de vendedores
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Análisis por Color */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl shadow-lg p-6 border border-pink-200 dark:border-pink-700 mb-8">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white text-xl">🎨</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                🎨 Ventas por Color
                            </h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analytics.sales_by_color &&
                        analytics.sales_by_color.length > 0 ? (
                            analytics.sales_by_color.map((color) => (
                                <div
                                    key={color.color}
                                    className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-lg hover:border-pink-300 dark:hover:border-pink-500 transition-all duration-200 transform hover:scale-105"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                                            <span className="font-semibold text-gray-900 dark:text-white capitalize">
                                                {color.color}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                            {formatNumber(color.total_quantity)}{" "}
                                            unidades
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {formatNumber(color.total_sales)} ventas
                                    </p>
                                    <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                                        {formatCurrency(color.total_revenue)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4 col-span-full">
                                No hay datos de colores vendidos
                            </p>
                        )}
                    </div>
                </div>

                {/* Resumen de Costos */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white text-xl">💼</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                💼 Resumen de Costos
                            </h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/analytics/costs" className="block">
                            <div className="text-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-lg hover:border-red-300 dark:hover:border-red-500 transition-all duration-200 cursor-pointer transform hover:scale-105">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white text-xl">
                                        💸
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                                    Total de Costos
                                </p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {formatCurrency(analytics.total_costs)}
                                </p>
                            </div>
                        </Link>
                        <div className="text-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-white text-xl">💸</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                                Total de Comisiones
                            </p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {formatCurrency(analytics.total_commissions)}
                            </p>
                        </div>
                        <div className="text-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                                    analytics.net_profit >= 0
                                        ? "bg-gradient-to-br from-green-500 to-emerald-600"
                                        : "bg-gradient-to-br from-red-500 to-pink-600"
                                }`}
                            >
                                <span className="text-white text-xl">
                                    {analytics.net_profit >= 0 ? "📈" : "📉"}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                                Ganancia Neta
                            </p>
                            <p
                                className={`text-2xl font-bold ${
                                    analytics.net_profit >= 0
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                            >
                                {formatCurrency(analytics.net_profit)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Analytics;
