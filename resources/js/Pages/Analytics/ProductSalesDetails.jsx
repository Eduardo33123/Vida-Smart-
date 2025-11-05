import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "../../components/Layout.jsx";

const ProductSalesDetails = ({
    product,
    sales,
    productId,
    totalRevenue,
    totalQuantity,
    totalCommissions,
    totalSales,
    totalCosts,
    netProfit,
    profitMargin,
}) => {
    // Filtrar las ventas del producto específico
    const productSales = sales.filter((sale) => sale.product_id === productId);

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return "$0.00";
        }
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(Number(amount));
    };

    const formatNumber = (number) => {
        if (number === null || number === undefined || isNaN(number)) {
            return "0";
        }
        return new Intl.NumberFormat("es-MX").format(Number(number));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "-";
        }
        return date.toLocaleDateString("es-MX");
    };

    return (
        <Layout>
            <Head title={`Ventas de ${product?.name} - Analytics`} />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                📦 Ventas de {product?.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Todas las ventas realizadas de este producto
                            </p>
                        </div>
                        <Link
                            href="/analytics"
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                        >
                            ← Volver a Analytics
                        </Link>
                    </div>
                </div>

                {/* Información del Producto */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Información del Producto */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white font-bold text-lg">
                                    📦
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Información del Producto
                                </h3>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Nombre:
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {product?.name}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Categoría:
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {product?.category?.name || "-"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Proveedor:
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {product?.provider?.name || "-"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Precio:
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(product?.price || 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Stock:
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatNumber(product?.stock || 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas de Ventas */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-700">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">📊</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Estadísticas de Ventas
                                </h3>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Vendido:
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatNumber(totalQuantity || 0)} unidades
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Ingresos:
                                </span>
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(totalRevenue || 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Comisiones:
                                </span>
                                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                                    {formatCurrency(totalCommissions || 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Número de Ventas:
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatNumber(totalSales || 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Ganancia Neta */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">💰</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Ganancia Neta
                                </h3>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Costos:
                                </span>
                                <span className="font-semibold text-red-600 dark:text-red-400">
                                    {formatCurrency(totalCosts || 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Ganancia Neta:
                                </span>
                                <span
                                    className={`font-semibold ${
                                        (netProfit || 0) >= 0
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-red-600 dark:text-red-400"
                                    }`}
                                >
                                    {formatCurrency(netProfit || 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Margen de Ganancia:
                                </span>
                                <span
                                    className={`font-semibold ${
                                        (profitMargin || 0) >= 0
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-red-600 dark:text-red-400"
                                    }`}
                                >
                                    {formatNumber(profitMargin || 0)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de Ventas */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Todas las Ventas de {product?.name} (
                            {productSales.length})
                        </h3>
                    </div>

                    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gradient-to-r from-purple-500 to-indigo-600">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        📅 Fecha
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        👤 Cliente
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        🏪 Vendedor
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        🎨 Color
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        📊 Cantidad
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        💰 Precio Unitario
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        💸 Comisión
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        💵 Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {productSales && productSales.length > 0 ? (
                                    productSales.map((sale, index) => (
                                        <tr
                                            key={sale.id || index}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {formatDate(sale.sale_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {sale.client_name || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {sale.seller?.name || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {sale.color || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {sale.quantity_sold}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {formatCurrency(
                                                    sale.sale_price
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400">
                                                {formatCurrency(
                                                    sale.commission
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                                                {formatCurrency(
                                                    sale.total_amount
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No hay ventas registradas para este
                                            producto
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductSalesDetails;
