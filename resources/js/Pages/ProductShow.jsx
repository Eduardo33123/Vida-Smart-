import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Layout from "../components/Layout.jsx";

const ProductShow = ({ product, users = [] }) => {
    // Estados para el modal de ventas
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

    // Estados para el modal de ajustar stock
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [stockAction, setStockAction] = useState("add"); // 'add' o 'new_version'

    // Formulario para ventas
    const {
        data: saleData,
        setData: setSaleData,
        post: postSale,
        processing: saleProcessing,
        errors: saleErrors,
        reset: resetSale,
    } = useForm({
        product_id: product.id,
        quantity_sold: "1",
        client_name: "",
        color: "",
        seller_id: users.length > 0 ? users[0].id.toString() : "",
        sale_price: product.sale_price || product.price || "",
        commission: "0",
        additional_expenses: "",
        expenses_description: "",
        sale_date: new Date().toISOString().split("T")[0],
        notes: "",
    });

    // Formulario para ajustar stock
    const {
        data: stockData,
        setData: setStockData,
        post: postStock,
        processing: stockProcessing,
        errors: stockErrors,
        reset: resetStock,
    } = useForm({
        product_id: product.id,
        action: "add", // 'add' o 'new_version'
        quantity: "",
        new_purchase_price: "",
        version: product.version || 1,
    });

    const getCategoryName = (categoryId) => {
        const categories = {
            1: "Focos Inteligentes",
            2: "Cámaras de Seguridad",
            3: "Sensores",
            4: "Interruptores",
            5: "Enchufes Inteligentes",
            6: "Termostatos",
            7: "Cerraduras",
            8: "Altavoces",
            9: "Otros",
        };
        return categories[categoryId] || "Sin categoría";
    };

    const getStockStatus = (stock) => {
        if (stock === 0)
            return { text: "Sin Stock", color: "text-red-400 bg-red-900" };
        if (stock <= 5)
            return {
                text: "Stock Bajo",
                color: "text-yellow-400 bg-yellow-900",
            };
        return { text: "En Stock", color: "text-green-400 bg-green-900" };
    };

    const stockStatus = getStockStatus(product.stock);

    // Función para formatear precio
    const formatPrice = (price) => {
        if (!price) return "$0.00";
        return `$${parseFloat(price).toFixed(2)}`;
    };

    // Funciones para las acciones rápidas
    const handleSellProduct = () => {
        setIsSaleModalOpen(true);
    };

    const handleCloseSaleModal = () => {
        setIsSaleModalOpen(false);
        resetSale();
    };

    const handleAdjustStock = () => {
        setIsStockModalOpen(true);
    };

    const handleCloseStockModal = () => {
        setIsStockModalOpen(false);
        resetStock();
        setStockAction("add");
    };

    const handleStockActionChange = (action) => {
        setStockAction(action);
        setStockData("action", action);
    };

    const handleViewHistory = () => {
        // Redirigir a la página de ventas con filtro por producto
        window.location.href = `/vender?product=${product.id}`;
    };

    const handleViewHistoryByVersion = (version) => {
        // Redirigir a la página de ventas con filtro por producto y versión
        window.location.href = `/vender?product=${product.id}&version=${version}`;
    };

    const handleSharedInventory = () => {
        // Redirigir a la página de inventario compartido
        window.location.href = `/shared-inventory`;
    };

    return (
        <Layout>
            <Head title={`${product.name} - Vida Smart`} />

            <div className="p-6">
                {/* Header con navegación */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/inventario"
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            ← Volver al Inventario
                        </Link>
                        <div className="h-6 w-px bg-gray-600"></div>
                        <h1 className="text-3xl font-bold text-white">
                            Detalle del Producto
                        </h1>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={`/products/${product.id}/edit`}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            ✏️ Editar Producto
                        </Link>
                        <Link
                            href="/inventario"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            📦 Ver Inventario
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Imagen del Producto */}
                    <div className="space-y-4">
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            <div className="h-96 bg-gray-700 flex items-center justify-center">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display =
                                                "flex";
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`${
                                        product.image ? "hidden" : "flex"
                                    } items-center justify-center w-full h-full`}
                                >
                                    <span className="text-8xl text-gray-500">
                                        📦
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Información de Versiones */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                🏷️ Información de Versiones
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-700 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-400">
                                                Versión Actual
                                            </span>
                                            <span className="text-lg font-bold text-purple-400">
                                                V{product.version || 1}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Versión del producto en stock
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-700 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-400">
                                                Precio de Compra Actual
                                            </span>
                                            <span className="text-lg font-bold text-blue-400">
                                                {formatPrice(
                                                    product.purchase_price
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Costo por unidad (V
                                            {product.version || 1})
                                        </div>
                                    </div>
                                </div>

                                {product.version_purchase_price &&
                                    product.version_purchase_price !==
                                        product.purchase_price && (
                                        <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/30">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-400">
                                                    Precio de Versión Específico
                                                </span>
                                                <span className="text-lg font-bold text-purple-400">
                                                    {formatPrice(
                                                        product.version_purchase_price
                                                    )}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Precio específico de la V
                                                {product.version || 1}
                                            </div>
                                        </div>
                                    )}

                                <div className="p-4 bg-gray-700 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-400">
                                            Margen de Ganancia
                                        </span>
                                        <span
                                            className={`text-lg font-bold ${
                                                parseFloat(product.price) -
                                                    parseFloat(
                                                        product.purchase_price
                                                    ) >=
                                                0
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                            }`}
                                        >
                                            {formatPrice(
                                                parseFloat(product.price) -
                                                    parseFloat(
                                                        product.purchase_price
                                                    )
                                            )}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Diferencia entre precio de venta y
                                        compra
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                                    <div className="flex items-center mb-2">
                                        <span className="text-blue-400 mr-2">
                                            ℹ️
                                        </span>
                                        <span className="text-sm font-medium text-blue-300">
                                            Información de Versiones
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Las versiones te permiten manejar
                                        diferentes precios de compra para el
                                        mismo producto. Usa "Ajustar Stock" para
                                        agregar a la versión actual o crear una
                                        nueva versión.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información del Producto */}
                    <div className="space-y-6">
                        {/* Información Principal */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        {product.name}
                                    </h2>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-indigo-400 bg-indigo-900 px-3 py-1 rounded-full text-sm">
                                            {getCategoryName(
                                                product.category_id
                                            )}
                                        </span>
                                        <span
                                            className={`text-sm px-3 py-1 rounded-full ${stockStatus.color}`}
                                        >
                                            {stockStatus.text}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-green-400">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Precio de venta
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Stock Disponible
                                    </p>
                                    <p className="text-lg font-semibold text-white">
                                        {product.stock} unidades
                                    </p>
                                </div>
                            </div>

                            {product.description && (
                                <div>
                                    <p className="text-sm text-gray-400 mb-2">
                                        Descripción
                                    </p>
                                    <p className="text-gray-300 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Estadísticas del Producto */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                📊 Estadísticas
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-gray-700 rounded-lg">
                                    <p className="text-2xl font-bold text-white">
                                        {product.stock}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Unidades en Stock
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-gray-700 rounded-lg">
                                    <p className="text-2xl font-bold text-white">
                                        $
                                        {(
                                            parseFloat(product.price) *
                                            product.stock
                                        ).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Valor Total
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Acciones Rápidas */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                ⚡ Acciones Rápidas
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    onClick={handleSellProduct}
                                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                                >
                                    <span className="mr-2">🛒</span>
                                    Vender Producto
                                </button>
                                <button
                                    onClick={handleAdjustStock}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                                >
                                    <span className="mr-2">📦</span>
                                    Ajustar Stock
                                </button>
                                <button
                                    onClick={handleViewHistory}
                                    className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                                >
                                    <span className="mr-2">📊</span>
                                    Ver Historial
                                </button>
                                <button
                                    onClick={handleSharedInventory}
                                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                                >
                                    <span className="mr-2">🤝</span>
                                    Inventario Compartido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información Adicional */}
                <div className="mt-8 bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        ℹ️ Información Adicional
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-gray-400">
                                Fecha de Creación
                            </p>
                            <p className="text-white">
                                {new Date(
                                    product.created_at
                                ).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">
                                Última Actualización
                            </p>
                            <p className="text-white">
                                {new Date(
                                    product.updated_at
                                ).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">
                                ID del Producto
                            </p>
                            <p className="text-white font-mono">
                                #{product.id}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal para vender producto */}
                {isSaleModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                {/* Header del Modal */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-white text-xl">
                                                💰
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                Vender Producto
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {product.name}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCloseSaleModal}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        <span className="text-2xl">×</span>
                                    </button>
                                </div>

                                {/* Información del Producto */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                        Información del Producto
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Precio de Compra
                                            </p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(
                                                    product.purchase_price
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Stock Disponible
                                            </p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {product.stock} unidades
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Formulario de Venta */}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        console.log(
                                            "Enviando datos de venta:",
                                            saleData
                                        );
                                        postSale("/sales", {
                                            onSuccess: () => {
                                                handleCloseSaleModal();
                                                // Recargar la página para actualizar el stock
                                                window.location.reload();
                                            },
                                            onError: (errors) => {
                                                console.error(
                                                    "Error al crear la venta:",
                                                    errors
                                                );
                                                console.error(
                                                    "Errores de validación:",
                                                    saleErrors
                                                );
                                                // Los errores se mostrarán automáticamente en el formulario
                                            },
                                        });
                                    }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Cantidad */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Cantidad a Vender
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max={product.stock}
                                                value={saleData.quantity_sold}
                                                onChange={(e) =>
                                                    setSaleData(
                                                        "quantity_sold",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {saleErrors.quantity_sold && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {saleErrors.quantity_sold}
                                                </p>
                                            )}
                                        </div>

                                        {/* Precio de Venta */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Precio de Venta
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={saleData.sale_price}
                                                onChange={(e) =>
                                                    setSaleData(
                                                        "sale_price",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {saleErrors.sale_price && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {saleErrors.sale_price}
                                                </p>
                                            )}
                                        </div>

                                        {/* Comisión */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Comisión
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={saleData.commission}
                                                onChange={(e) =>
                                                    setSaleData(
                                                        "commission",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                placeholder="0.00"
                                            />
                                            {saleErrors.commission && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {saleErrors.commission}
                                                </p>
                                            )}
                                        </div>

                                        {/* Cliente */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nombre del Cliente
                                            </label>
                                            <input
                                                type="text"
                                                value={saleData.client_name}
                                                onChange={(e) =>
                                                    setSaleData(
                                                        "client_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {saleErrors.client_name && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {saleErrors.client_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Vendedor */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Vendedor
                                            </label>
                                            <select
                                                value={saleData.seller_id}
                                                onChange={(e) =>
                                                    setSaleData(
                                                        "seller_id",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                required
                                            >
                                                <option value="">
                                                    Seleccionar vendedor
                                                </option>
                                                {users.map((user) => (
                                                    <option
                                                        key={user.id}
                                                        value={user.id}
                                                    >
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {saleErrors.seller_id && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {saleErrors.seller_id}
                                                </p>
                                            )}
                                        </div>

                                        {/* Fecha de Venta */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Fecha de Venta
                                            </label>
                                            <input
                                                type="date"
                                                value={saleData.sale_date}
                                                onChange={(e) =>
                                                    setSaleData(
                                                        "sale_date",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {saleErrors.sale_date && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {saleErrors.sale_date}
                                                </p>
                                            )}
                                        </div>

                                        {/* Gastos Adicionales */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Gastos Adicionales
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={
                                                    saleData.additional_expenses
                                                }
                                                onChange={(e) =>
                                                    setSaleData(
                                                        "additional_expenses",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                placeholder="0.00"
                                            />
                                            {saleErrors.additional_expenses && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {
                                                        saleErrors.additional_expenses
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Notas */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Notas (Opcional)
                                        </label>
                                        <textarea
                                            value={saleData.notes}
                                            onChange={(e) =>
                                                setSaleData(
                                                    "notes",
                                                    e.target.value
                                                )
                                            }
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                            placeholder="Notas adicionales sobre la venta..."
                                        />
                                        {saleErrors.notes && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {saleErrors.notes}
                                            </p>
                                        )}
                                    </div>

                                    {/* Botones */}
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={handleCloseSaleModal}
                                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saleProcessing}
                                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {saleProcessing
                                                ? "Procesando..."
                                                : "Realizar Venta"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal para ajustar stock */}
                {isStockModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                {/* Header del Modal */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-white text-xl">
                                                📦
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                Ajustar Stock
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {product.name}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCloseStockModal}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        <span className="text-2xl">×</span>
                                    </button>
                                </div>

                                {/* Información del Producto */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                        Información Actual
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Stock Actual
                                            </p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {product.stock} unidades
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Versión Actual
                                            </p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                Versión {product.version || 1}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Precio de Compra Actual
                                            </p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(
                                                    product.purchase_price
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Precio de Venta
                                            </p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(product.price)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Opciones de Acción */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        ¿Qué deseas hacer?
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                stockAction === "add"
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                                            }`}
                                            onClick={() =>
                                                handleStockActionChange("add")
                                            }
                                        >
                                            <div className="flex items-center mb-2">
                                                <input
                                                    type="radio"
                                                    name="stockAction"
                                                    value="add"
                                                    checked={
                                                        stockAction === "add"
                                                    }
                                                    onChange={() =>
                                                        handleStockActionChange(
                                                            "add"
                                                        )
                                                    }
                                                    className="mr-3"
                                                />
                                                <span className="text-lg">
                                                    📈
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                Agregar a Versión Actual
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Agregar más unidades a la
                                                versión {product.version || 1}{" "}
                                                existente
                                            </p>
                                        </div>

                                        <div
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                stockAction === "new_version"
                                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                                    : "border-gray-300 dark:border-gray-600 hover:border-green-300"
                                            }`}
                                            onClick={() =>
                                                handleStockActionChange(
                                                    "new_version"
                                                )
                                            }
                                        >
                                            <div className="flex items-center mb-2">
                                                <input
                                                    type="radio"
                                                    name="stockAction"
                                                    value="new_version"
                                                    checked={
                                                        stockAction ===
                                                        "new_version"
                                                    }
                                                    onChange={() =>
                                                        handleStockActionChange(
                                                            "new_version"
                                                        )
                                                    }
                                                    className="mr-3"
                                                />
                                                <span className="text-lg">
                                                    🆕
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                Crear Nueva Versión
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Crear versión{" "}
                                                {(product.version || 1) + 1} con
                                                nuevo precio de compra
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Formulario de Ajuste */}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();

                                        // Preparar datos para envío
                                        const formData = {
                                            product_id: stockData.product_id,
                                            action: stockData.action,
                                            quantity: stockData.quantity,
                                        };

                                        // Solo agregar new_purchase_price si es nueva versión y tiene valor
                                        if (
                                            stockData.action ===
                                                "new_version" &&
                                            stockData.new_purchase_price
                                        ) {
                                            formData.new_purchase_price =
                                                stockData.new_purchase_price;
                                        }

                                        postStock("/products/adjust-stock", {
                                            data: formData,
                                            onSuccess: () => {
                                                handleCloseStockModal();
                                                window.location.reload();
                                            },
                                        });
                                    }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Cantidad */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Cantidad a Agregar
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={stockData.quantity}
                                                onChange={(e) =>
                                                    setStockData(
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {stockErrors.quantity && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {stockErrors.quantity}
                                                </p>
                                            )}
                                        </div>

                                        {/* Precio de Compra (solo para nueva versión) */}
                                        {stockAction === "new_version" && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Nuevo Precio de Compra
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={
                                                        stockData.new_purchase_price
                                                    }
                                                    onChange={(e) =>
                                                        setStockData(
                                                            "new_purchase_price",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                    required={
                                                        stockAction ===
                                                        "new_version"
                                                    }
                                                />
                                                {stockErrors.new_purchase_price && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {
                                                            stockErrors.new_purchase_price
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Resumen */}
                                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Resumen del Ajuste:
                                        </h4>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {stockAction === "add" ? (
                                                <p>
                                                    Se agregarán{" "}
                                                    <strong>
                                                        {stockData.quantity ||
                                                            0}
                                                    </strong>{" "}
                                                    unidades a la
                                                    <strong>
                                                        {" "}
                                                        Versión{" "}
                                                        {product.version || 1}
                                                    </strong>
                                                    (precio:{" "}
                                                    {formatPrice(
                                                        product.purchase_price
                                                    )}
                                                    )
                                                </p>
                                            ) : (
                                                <p>
                                                    Se creará la{" "}
                                                    <strong>
                                                        Versión{" "}
                                                        {(product.version ||
                                                            1) + 1}
                                                    </strong>{" "}
                                                    con
                                                    <strong>
                                                        {" "}
                                                        {stockData.quantity ||
                                                            0}
                                                    </strong>{" "}
                                                    unidades (precio:{" "}
                                                    {formatPrice(
                                                        stockData.new_purchase_price
                                                    )}
                                                    )
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={handleCloseStockModal}
                                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={stockProcessing}
                                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {stockProcessing
                                                ? "Procesando..."
                                                : "Ajustar Stock"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ProductShow;
