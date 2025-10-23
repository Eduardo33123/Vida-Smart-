import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "../../components/Layout";

const ProductSalesDetails = ({
    product,
    sales,
    productId,
    totalRevenue,
    totalQuantity,
    totalCommissions,
}) => {
    // Filtrar solo las ventas de este producto específico
    const productSales = sales
        ? sales.filter(
              (sale) => parseInt(sale.product_id) === parseInt(productId)
          )
        : [];

    // Debug temporal
    console.log("ProductSalesDetails - product:", product);
    console.log("ProductSalesDetails - productId:", productId);
    console.log("ProductSalesDetails - all sales:", sales);
    console.log("ProductSalesDetails - all sales length:", sales?.length);
    console.log("ProductSalesDetails - filtered sales:", productSales);
    console.log(
        "ProductSalesDetails - filtered sales length:",
        productSales?.length
    );
    console.log("ProductSalesDetails - totalRevenue:", totalRevenue);
    console.log("ProductSalesDetails - totalQuantity:", totalQuantity);
    console.log("ProductSalesDetails - totalCommissions:", totalCommissions);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("es-MX");
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat("es-MX").format(number);
    };

    return (
        <Layout>
            <Head title={`Ventas de ${product.name} - Analytics`} />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                📦 Ventas de {product.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Todas las ventas de este producto
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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Información del Producto
                            </h3>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">Nombre:</span>{" "}
                                    {product.name}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Categoría:
                                    </span>{" "}
                                    {product.category?.nombre || "N/A"}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Proveedor:
                                    </span>{" "}
                                    {product.provider?.name || "N/A"}
                                </p>
                                <p>
                                    <span className="font-medium">Precio:</span>{" "}
                                    {formatCurrency(product.price)}
                                </p>
                                <p>
                                    <span className="font-medium">Stock:</span>{" "}
                                    {formatNumber(product.stock)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Estadísticas de Ventas
                            </h3>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">
                                        Total Vendido:
                                    </span>{" "}
                                    {formatNumber(totalQuantity)} unidades
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Total Ingresos:
                                    </span>{" "}
                                    <span className="text-green-600 dark:text-green-400 font-semibold">
                                        {formatCurrency(totalRevenue)}
                                    </span>
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Total Comisiones:
                                    </span>{" "}
                                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                                        {formatCurrency(totalCommissions)}
                                    </span>
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Número de Ventas:
                                    </span>{" "}
                                    {formatNumber(productSales.length)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Promedios
                            </h3>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">
                                        Precio Promedio:
                                    </span>{" "}
                                    {formatCurrency(
                                        totalRevenue / totalQuantity
                                    )}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Cantidad por Venta:
                                    </span>{" "}
                                    {formatNumber(
                                        productSales.length > 0
                                            ? totalQuantity /
                                                  productSales.length
                                            : 0
                                    )}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Comisión Promedio:
                                    </span>{" "}
                                    {formatCurrency(
                                        productSales.length > 0
                                            ? totalCommissions /
                                                  productSales.length
                                            : 0
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de Ventas */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Todas las Ventas de {product.name} (
                            {productSales.length})
                        </h3>
                    </div>

                    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gradient-to-r from-green-500 to-emerald-600">
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
                                    productSales.map((sale) => (
                                        <tr
                                            key={sale.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {formatDate(sale.sale_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {sale.client_name || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {sale.seller?.name ||
                                                    "Vendedor no encontrado"}
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
