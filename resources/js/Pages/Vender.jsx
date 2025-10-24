import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Layout from "../components/Layout";

export default function Vender({
    sales,
    statistics,
    products,
    users,
    selectedProduct,
    isFiltered,
    selectedVersion,
    availableVersions = [],
    selectedUser,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductForSale, setSelectedProductForSale] = useState(null);
    const [editingSale, setEditingSale] = useState(null);
    const [viewMode, setViewMode] = useState(() => {
        // Cargar el modo de vista desde localStorage o usar 'cards' por defecto
        return localStorage.getItem("vender-view-mode") || "cards";
    });
    const [selectedUserState, setSelectedUserState] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: "",
        quantity_sold: "",
        client_name: "",
        color: "",
        seller_id: "",
        sale_price: "",
        commission: "",
        additional_expenses: "",
        sale_date: new Date().toISOString().split("T")[0],
        notes: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingSale) {
            // Actualizar venta existente
            router.put(`/sales/${editingSale.id}`, data, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    setEditingSale(null);
                },
            });
        } else {
            // Crear nueva venta
            post("/sales", {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        reset();
        setEditingSale(null);
    };

    const handleEditSale = (sale) => {
        // Formatear la fecha para el input de tipo date (YYYY-MM-DD)
        const formatDateForInput = (dateString) => {
            if (!dateString) return new Date().toISOString().split("T")[0];
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
        };

        setData({
            product_id: sale.product_id,
            quantity_sold: sale.quantity_sold,
            client_name: sale.client_name,
            color: sale.color || "",
            seller_id: sale.seller_id,
            sale_price: sale.sale_price,
            commission: sale.commission || "",
            additional_expenses: sale.additional_expenses || "",
            total_amount: sale.total_amount,
            notes: sale.notes || "",
            sale_date: formatDateForInput(sale.sale_date),
        });
        setSelectedProductForSale(sale.product);
        setIsModalOpen(true);
        setEditingSale(sale);
    };

    const handleDeleteSale = (sale) => {
        if (
            confirm(
                `¿Estás seguro de que quieres eliminar la venta de "${sale.product?.name}" a "${sale.client_name}"?`
            )
        ) {
            router.delete(`/sales/${sale.id}`, {
                onSuccess: () => {
                    // La página se actualizará automáticamente
                },
                onError: (errors) => {
                    alert(
                        "Error al eliminar la venta: " +
                            Object.values(errors).join(", ")
                    );
                },
            });
        }
    };

    const handleProductChange = (productId) => {
        setData("product_id", productId);
        const product = products.find((p) => p.id == productId);
        setSelectedProductForSale(product);
    };

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem("vender-view-mode", mode);
    };

    const handleUserFilter = (userId) => {
        if (userId) {
            setSelectedUserState(userId);
            window.location.href = `/vender?user=${userId}`;
        } else {
            setSelectedUserState(null);
            window.location.href = "/vender";
        }
    };

    const handleVersionFilter = (version) => {
        if (version) {
            window.location.href = `/vender?version=${version}`;
        } else {
            window.location.href = "/vender";
        }
    };

    // Función para formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES");
    };

    // Función para formatear precio
    const formatPrice = (price) => {
        if (!price) return "$0.00";
        return `$${parseFloat(price).toFixed(2)}`;
    };

    // Función para calcular la ganancia de una venta
    const calculateProfit = (sale) => {
        if (!sale.product || !sale.product.purchase_price) {
            return 0;
        }

        const profitPerUnit = sale.sale_price - sale.product.purchase_price;
        const totalProfit =
            profitPerUnit * sale.quantity_sold -
            (sale.additional_expenses || 0);

        return totalProfit;
    };

    return (
        <Layout>
            <Head title="Vender" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mr-6">
                                <span className="text-white text-2xl">💰</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    💰 Módulo de Ventas
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    {selectedProduct &&
                                    selectedVersion &&
                                    selectedUser ? (
                                        <>
                                            Historial de ventas:{" "}
                                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                {selectedProduct.name}
                                            </span>{" "}
                                            -{" "}
                                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                Versión {selectedVersion}
                                            </span>{" "}
                                            por{" "}
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                {selectedUser.name}
                                            </span>
                                        </>
                                    ) : selectedProduct && selectedUser ? (
                                        <>
                                            Historial de ventas:{" "}
                                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                {selectedProduct.name}
                                            </span>{" "}
                                            por{" "}
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                {selectedUser.name}
                                            </span>
                                        </>
                                    ) : selectedProduct && selectedVersion ? (
                                        <>
                                            Historial de ventas:{" "}
                                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                {selectedProduct.name}
                                            </span>{" "}
                                            -{" "}
                                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                Versión {selectedVersion}
                                            </span>
                                        </>
                                    ) : selectedProduct ? (
                                        <>
                                            Historial de ventas:{" "}
                                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                {selectedProduct.name}
                                            </span>
                                        </>
                                    ) : selectedUser ? (
                                        <>
                                            Historial de ventas por{" "}
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                {selectedUser.name}
                                            </span>
                                        </>
                                    ) : selectedVersion ? (
                                        <>
                                            Historial de ventas -{" "}
                                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                Versión {selectedVersion}
                                            </span>
                                        </>
                                    ) : (
                                        "Gestiona todas las ventas de productos de domótica"
                                    )}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            <span>+</span>
                            Nueva Venta
                        </button>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">📊</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Ventas
                                </h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {statistics?.total_sales || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">💰</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Ingresos Totales
                                </h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatPrice(statistics?.total_revenue)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6 border border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">💸</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Comisiones
                                </h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatPrice(statistics?.total_commission)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">💸</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Gastos Adicionales
                                </h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatPrice(
                                        statistics?.total_additional_expenses
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            🔍 Filtros de Búsqueda
                        </h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {sales?.length || 0} ventas registradas
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Filtro por Usuario */}
                        <select
                            onChange={(e) => handleUserFilter(e.target.value)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            defaultValue=""
                        >
                            <option value="">👤 Todos los Vendedores</option>
                            {users &&
                                users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                        </select>

                        {/* Filtro por Versión */}
                        <select
                            onChange={(e) =>
                                handleVersionFilter(e.target.value)
                            }
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium border-0 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            defaultValue=""
                        >
                            <option value="">📈 Todas las Versiones</option>
                            {availableVersions &&
                            availableVersions.length > 0 ? (
                                availableVersions.map((version) => (
                                    <option key={version} value={version}>
                                        Versión {version}
                                    </option>
                                ))
                            ) : (
                                <>
                                    <option value="1">Versión 1</option>
                                    <option value="2">Versión 2</option>
                                </>
                            )}
                        </select>

                        {/* Botón para limpiar filtros */}
                        {(isFiltered || selectedUser || selectedVersion) && (
                            <button
                                onClick={() => router.get("/vender")}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                🗑️ Limpiar Filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* Historial de Ventas */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">🛒</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {isFiltered && selectedUser
                                        ? `Historial de Ventas - ${selectedProduct?.name} - ${selectedUser.name}`
                                        : isFiltered
                                        ? `Historial de Ventas - ${selectedProduct?.name}`
                                        : selectedUser
                                        ? `Historial de Ventas - ${selectedUser.name}`
                                        : selectedVersion
                                        ? `Historial de Ventas - Versión ${selectedVersion}`
                                        : "Historial de Ventas"}
                                </h2>
                                {isFiltered && selectedProduct && (
                                    <div className="flex items-center space-x-4 mt-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            🏷️ Versión:{" "}
                                            <strong>
                                                {selectedProduct.version || 1}
                                            </strong>
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            💰 Precio Venta:{" "}
                                            <strong>
                                                {formatPrice(
                                                    selectedProduct.price
                                                )}
                                            </strong>
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            💸 Precio Compra:{" "}
                                            <strong>
                                                {formatPrice(
                                                    selectedProduct.purchase_price
                                                )}
                                            </strong>
                                        </span>
                                        {selectedProduct.version_purchase_price && (
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                🏷️ Precio V
                                                {selectedProduct.version || 1}:{" "}
                                                <strong>
                                                    {formatPrice(
                                                        selectedProduct.version_purchase_price
                                                    )}
                                                </strong>
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            {/* Botones de vista */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() =>
                                        handleViewModeChange("cards")
                                    }
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        viewMode === "cards"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                                    }`}
                                >
                                    📋 Cards
                                </button>
                                <button
                                    onClick={() =>
                                        handleViewModeChange("table")
                                    }
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        viewMode === "table"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                                    }`}
                                >
                                    📊 Tabla
                                </button>
                            </div>
                        </div>
                    </div>

                    {sales && sales.length > 0 ? (
                        viewMode === "cards" ? (
                            // Vista de Cards
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sales.map((sale) => (
                                    <div
                                        key={sale.id}
                                        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        {/* Header de la Card */}
                                        <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                                                        <span className="text-white text-sm">
                                                            📦
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-bold text-sm truncate max-w-32">
                                                            {sale.product
                                                                ?.name ||
                                                                "Producto no encontrado"}
                                                        </h3>
                                                        <div className="flex items-center space-x-2">
                                                            <p className="text-white/80 text-xs">
                                                                {formatDate(
                                                                    sale.sale_date
                                                                )}
                                                            </p>
                                                            <span className="text-white/80 text-xs bg-white/20 px-2 py-1 rounded-full">
                                                                V
                                                                {sale.product_version ||
                                                                    1}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-bold text-lg">
                                                        {formatPrice(
                                                            sale.total_amount
                                                        )}
                                                    </p>
                                                    <p className="text-white/80 text-xs">
                                                        {sale.quantity_sold}{" "}
                                                        unidades
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contenido de la Card */}
                                        <div className="p-4">
                                            <div className="space-y-3">
                                                {/* Cliente */}
                                                <div className="flex items-center">
                                                    <span className="text-gray-500 dark:text-gray-400 mr-3 text-sm">
                                                        👤
                                                    </span>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Cliente
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {sale.client_name ||
                                                                "Sin nombre"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Vendedor */}
                                                <div className="flex items-center">
                                                    <span className="text-gray-500 dark:text-gray-400 mr-3 text-sm">
                                                        🏪
                                                    </span>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Vendedor
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {sale.seller
                                                                ?.name ||
                                                                "No asignado"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Precio Unitario */}
                                                <div className="flex items-center">
                                                    <span className="text-gray-500 dark:text-gray-400 mr-3 text-sm">
                                                        💰
                                                    </span>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Precio Unitario
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {formatPrice(
                                                                sale.sale_price
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Precio de Compra */}
                                                <div className="flex items-center">
                                                    <span className="text-gray-500 dark:text-gray-400 mr-3 text-sm">
                                                        🛒
                                                    </span>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Precio de Compra
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {formatPrice(
                                                                sale.product
                                                                    ?.purchase_price
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Ganancia */}
                                                <div className="flex items-center">
                                                    <span className="text-gray-500 dark:text-gray-400 mr-3 text-sm">
                                                        💎
                                                    </span>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Ganancia
                                                        </p>
                                                        <p
                                                            className={`text-sm font-medium ${
                                                                calculateProfit(
                                                                    sale
                                                                ) >= 0
                                                                    ? "text-green-600 dark:text-green-400"
                                                                    : "text-red-600 dark:text-red-400"
                                                            }`}
                                                        >
                                                            {formatPrice(
                                                                calculateProfit(
                                                                    sale
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Color si existe */}
                                                {sale.color && (
                                                    <div className="flex items-center">
                                                        <span className="text-gray-500 dark:text-gray-400 mr-3 text-sm">
                                                            🎨
                                                        </span>
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                Color
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {sale.color}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Comisión si existe */}
                                                {sale.commission && (
                                                    <div className="flex items-center">
                                                        <span className="text-gray-500 dark:text-gray-400 mr-3 text-sm">
                                                            💸
                                                        </span>
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                Comisión
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {formatPrice(
                                                                    sale.commission
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Gastos Adicionales si existen */}
                                                {sale.additional_expenses && (
                                                    <div className="flex items-center">
                                                        <span className="text-gray-500 dark:text-gray-400 mr-3 text-sm">
                                                            📦
                                                        </span>
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                Gastos
                                                                Adicionales
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {formatPrice(
                                                                    sale.additional_expenses
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Botones de Acción */}
                                            <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                <button
                                                    onClick={() =>
                                                        handleEditSale(sale)
                                                    }
                                                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-1"
                                                >
                                                    <span>✏️</span>
                                                    <span>Editar</span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteSale(sale)
                                                    }
                                                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-1"
                                                >
                                                    <span>🗑️</span>
                                                    <span>Eliminar</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Vista de Tabla
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                📦 Producto
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                👤 Cliente
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                🏪 Vendedor
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                📊 Cantidad
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                💰 Precio
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                💵 Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                📅 Fecha
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                ⚙️ Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {sales.map((sale) => (
                                            <tr
                                                key={sale.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                                                                <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                                                                    📦
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {sale.product
                                                                    ?.name ||
                                                                    "Producto no encontrado"}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                V
                                                                {sale.product_version ||
                                                                    1}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {sale.client_name ||
                                                            "Sin nombre"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {sale.seller?.name ||
                                                            "No asignado"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {sale.quantity_sold}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {formatPrice(
                                                            sale.sale_price
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatPrice(
                                                            sale.total_amount
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {formatDate(
                                                            sale.sale_date
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEditSale(
                                                                    sale
                                                                )
                                                            }
                                                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center space-x-1"
                                                        >
                                                            <span>✏️</span>
                                                            <span>Editar</span>
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteSale(
                                                                    sale
                                                                )
                                                            }
                                                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center space-x-1"
                                                        >
                                                            <span>🗑️</span>
                                                            <span>Eliminar</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-gray-400 text-4xl">
                                    🛒
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                No hay ventas registradas
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                                Comienza registrando tu primera venta
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Realizar Primera Venta
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal para Nueva Venta */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-2 sm:p-4">
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[98vh] sm:max-h-[95vh] overflow-y-auto mx-2 sm:mx-0">
                            <div className="p-4 sm:p-6">
                                <div className="flex justify-between items-center mb-4 sm:mb-6">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                        {editingSale
                                            ? "Editar Venta"
                                            : "Nueva Venta"}
                                    </h3>
                                    <button
                                        onClick={handleCloseModal}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl sm:text-2xl font-light"
                                    >
                                        ×
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4 sm:space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                        {/* Producto */}
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                                Producto *
                                            </label>
                                            <select
                                                value={data.product_id}
                                                onChange={(e) =>
                                                    handleProductChange(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                                required
                                            >
                                                <option value="">
                                                    Seleccionar producto
                                                </option>
                                                {products &&
                                                    products.map((product) => (
                                                        <option
                                                            key={product.id}
                                                            value={product.id}
                                                        >
                                                            {product.name} -
                                                            Stock:{" "}
                                                            {product.stock}
                                                        </option>
                                                    ))}
                                            </select>
                                            {errors.product_id && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.product_id}
                                                </p>
                                            )}
                                        </div>

                                        {/* Cantidad */}
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                                Cantidad *
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max={
                                                    selectedProduct?.stock ||
                                                    999
                                                }
                                                value={data.quantity_sold}
                                                onChange={(e) =>
                                                    setData(
                                                        "quantity_sold",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                                required
                                            />
                                            {selectedProductForSale && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Stock disponible:{" "}
                                                    {
                                                        selectedProductForSale.stock
                                                    }
                                                </p>
                                            )}
                                            {errors.quantity_sold && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.quantity_sold}
                                                </p>
                                            )}
                                        </div>

                                        {/* Cliente */}
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                                Cliente *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.client_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "client_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                                required
                                            />
                                            {errors.client_name && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.client_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Vendedor */}
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                                Vendedor *
                                            </label>
                                            <select
                                                value={data.seller_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "seller_id",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                                required
                                            >
                                                <option value="">
                                                    Seleccionar vendedor
                                                </option>
                                                {users &&
                                                    users.map((user) => (
                                                        <option
                                                            key={user.id}
                                                            value={user.id}
                                                        >
                                                            {user.name}
                                                        </option>
                                                    ))}
                                            </select>
                                            {errors.seller_id && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.seller_id}
                                                </p>
                                            )}
                                        </div>

                                        {/* Color */}
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                                Color
                                            </label>
                                            <input
                                                type="text"
                                                value={data.color}
                                                onChange={(e) =>
                                                    setData(
                                                        "color",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            />
                                            {errors.color && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.color}
                                                </p>
                                            )}
                                        </div>

                                        {/* Precio de Venta */}
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                                Precio de Venta *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.sale_price}
                                                onChange={(e) =>
                                                    setData(
                                                        "sale_price",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                                required
                                            />
                                            {errors.sale_price && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.sale_price}
                                                </p>
                                            )}
                                        </div>

                                        {/* Comisión */}
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                                Comisión
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.commission}
                                                onChange={(e) =>
                                                    setData(
                                                        "commission",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                            />
                                            {errors.commission && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.commission}
                                                </p>
                                            )}
                                        </div>

                                        {/* Gastos Adicionales */}
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                                Gastos Adicionales
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.additional_expenses}
                                                onChange={(e) =>
                                                    setData(
                                                        "additional_expenses",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                                placeholder="0.00"
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Envío, empaque, etc.
                                            </p>
                                            {errors.additional_expenses && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.additional_expenses}
                                                </p>
                                            )}
                                        </div>

                                        {/* Fecha de Venta */}
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                                                Fecha de Venta *
                                            </label>
                                            <input
                                                type="date"
                                                value={data.sale_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "sale_date",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                                                required
                                            />
                                            {errors.sale_date && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.sale_date}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Descripción de Gastos Adicionales */}
                                    {/* Notas */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Notas
                                        </label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
                                            rows="3"
                                            className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none"
                                            placeholder="Notas adicionales sobre la venta..."
                                        />
                                        {errors.notes && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.notes}
                                            </p>
                                        )}
                                    </div>

                                    {/* Botones */}
                                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-all duration-200"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all duration-200"
                                        >
                                            {processing
                                                ? "Procesando..."
                                                : editingSale
                                                ? "Actualizar Venta"
                                                : "Guardar Venta"}
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
}
