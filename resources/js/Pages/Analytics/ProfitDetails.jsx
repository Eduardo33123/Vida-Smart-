import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "../../components/Layout.jsx";

const ProfitDetails = ({ sales, netProfit }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("es-MX");
    };

    const calculateProfit = (sale) => {
        const revenue = sale.total_amount;
        const cost = sale.product?.purchase_price
            ? sale.quantity_sold * sale.product.purchase_price
            : 0;
        const commission = sale.commission || 0;
        return revenue - cost - commission;
    };

    return (
        <Layout>
            <Head title="Detalles de Ganancia Neta - Analytics" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                📈 Detalles de Ganancia Neta
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Todas las ventas con sus ganancias individuales
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

                {/* Resumen */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Ganancia Neta Total
                            </h2>
                            <p
                                className={`text-3xl font-bold ${
                                    netProfit >= 0
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                            >
                                {formatCurrency(netProfit)}
                            </p>
                        </div>
                        <div
                            className={`p-4 rounded-full ${
                                netProfit >= 0
                                    ? "bg-green-100 dark:bg-green-900"
                                    : "bg-red-100 dark:bg-red-900"
                            }`}
                        >
                            <span className="text-3xl">
                                {netProfit >= 0 ? "📈" : "📉"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabla de Ventas con Ganancias */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Todas las Ventas con Ganancias ({sales.length})
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Color
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Cantidad
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Ingresos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Costos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Comisión
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Ganancia
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {sales && sales.length > 0 ? (
                                    sales.map((sale) => {
                                        const cost = sale.product
                                            ?.purchase_price
                                            ? sale.quantity_sold *
                                              sale.product.purchase_price
                                            : 0;
                                        const commission = sale.commission || 0;
                                        const profit = calculateProfit(sale);

                                        return (
                                            <tr
                                                key={sale.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {formatDate(sale.sale_date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {sale.product?.name ||
                                                            "Producto no encontrado"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {sale.client_name || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {sale.color || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    {sale.quantity_sold || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                                                    {formatCurrency(
                                                        sale.total_amount
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                                                    {formatCurrency(cost)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400">
                                                    {formatCurrency(commission)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                                    <span
                                                        className={`${
                                                            profit >= 0
                                                                ? "text-green-600 dark:text-green-400"
                                                                : "text-red-600 dark:text-red-400"
                                                        }`}
                                                    >
                                                        {formatCurrency(profit)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No hay ventas registradas
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

export default ProfitDetails;
