import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "../../components/Layout.jsx";

const CommissionsDetails = ({ sales, totalCommissions }) => {
    // Filtrar solo las ventas con comisiones > 0
    const salesWithCommissions = sales
        ? sales.filter((sale) => parseFloat(sale.commission) > 0)
        : [];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("es-MX");
    };

    return (
        <Layout>
            <Head title="Detalles de Comisiones - Analytics" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                💸 Detalles de Comisiones
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Todas las ventas que tienen comisiones
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
                                Total de Comisiones
                            </h2>
                            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                {formatCurrency(totalCommissions)}
                            </p>
                        </div>
                        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                            <span className="text-3xl">💸</span>
                        </div>
                    </div>
                </div>

                {/* Tabla de Ventas con Comisiones */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Ventas con Comisiones ({salesWithCommissions.length}
                            )
                        </h3>
                    </div>

                    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gradient-to-r from-yellow-500 to-orange-600">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        📅 Fecha
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        📦 Producto
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        👤 Cliente
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        🏪 Vendedor
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        📊 Cantidad
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        💵 Total Venta
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                        💸 Comisión
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {salesWithCommissions &&
                                salesWithCommissions.length > 0 ? (
                                    salesWithCommissions.map((sale) => (
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
                                                {sale.seller?.name ||
                                                    "Vendedor no encontrado"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {sale.quantity_sold || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {formatCurrency(
                                                    sale.total_amount
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                                {formatCurrency(
                                                    sale.commission
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No hay ventas con comisiones
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

export default CommissionsDetails;
