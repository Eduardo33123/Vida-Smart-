import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Layout from "../components/Layout";

export default function SharedInventory({
    inventory,
    statistics,
    products,
    users,
    currentUserId,
    filterUserId,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState(null);
    const [viewMode, setViewMode] = useState(() => {
        // Cargar el modo de vista desde localStorage o usar 'cards' por defecto
        return localStorage.getItem("shared-inventory-view-mode") || "cards";
    });

    // Debug logs

    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: "",
        partners: [{ user_id: "", quantity: "" }],
        notes: "",
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        quantity: "",
        notes: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/shared-inventory", {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                setSelectedProduct(null);
            },
            onError: (errors) => {
                console.error("=== ERRORES ===", errors);
            },
            onFinish: () => {},
        });
    };

    const handleAddPartner = () => {
        setData("partners", [...data.partners, { user_id: "", quantity: "" }]);
    };

    const handleRemovePartner = (index) => {
        if (data.partners.length > 1) {
            const newPartners = data.partners.filter((_, i) => i !== index);
            setData("partners", newPartners);
        }
    };

    const handlePartnerChange = (index, field, value) => {
        const newPartners = [...data.partners];
        newPartners[index][field] = value;
        setData("partners", newPartners);
    };

    const handleProductSelect = (productId) => {
        const product = products.find((p) => p.id == productId);
        setSelectedProduct(product);
        setData("product_id", productId);
    };

    const getCurrentVersion = () => {
        return selectedProduct?.version || 1;
    };

    const getCurrentPurchasePrice = () => {
        return selectedProduct?.purchase_price || 0;
    };

    const formatPrice = (price) => {
        if (!price) return "$0.00";
        return `$${parseFloat(price).toFixed(2)}`;
    };

    // Funciones para editar inventario
    const handleEditInventory = (item) => {
        setEditingItem(item);
        setEditData({
            quantity: item.quantity,
            notes: item.notes || "",
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        put(`/shared-inventory/${editingItem.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                resetEdit();
                setEditingItem(null);
            },
            onError: (errors) => {
                console.error("Errores al editar:", errors);
            },
        });
    };

    // Funciones para eliminar inventario
    const handleDeleteInventory = (item) => {
        setDeletingItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(`/shared-inventory/${deletingItem.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDeletingItem(null);
            },
            onError: (errors) => {
                console.error("Errores al eliminar:", errors);
                alert(
                    "Error al eliminar el inventario: " + JSON.stringify(errors)
                );
            },
        });
    };

    const getCategoryName = (categoryId) => {
        const categories = {
            1: "Iluminación",
            2: "Seguridad",
            3: "Climatización",
            4: "Entretenimiento",
            5: "Cocina",
            6: "Baño",
            7: "Jardín",
            8: "Altavoces",
            9: "Otros",
        };
        return categories[categoryId] || "Sin categoría";
    };

    // Función para manejar el filtro de usuario
    const handleUserFilter = (userId) => {
        const url = userId
            ? `/shared-inventory?user_id=${userId}`
            : "/shared-inventory";
        router.visit(url);
    };

    // Función para obtener el nombre del usuario filtrado
    const getFilteredUserName = () => {
        if (!filterUserId) return null;
        const user = users.find((u) => u.id == filterUserId);
        return user ? user.name : "Usuario desconocido";
    };

    // Función para cambiar el modo de vista
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem("shared-inventory-view-mode", mode);
    };

    return (
        <Layout>
            <Head title="Inventario Compartido - Vida Smart" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-6">
                                <span className="text-white text-2xl">🤝</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    🤝 Inventario Compartido{" "}
                                    {filterUserId
                                        ? `- ${getFilteredUserName()}`
                                        : "- Todos los Usuarios"}
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    {filterUserId
                                        ? `Inventario personal de ${getFilteredUserName()}`
                                        : "Gestiona el inventario compartido de todos los usuarios"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            <span>+</span>
                            Agregar Compra Compartida
                        </button>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">📦</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Productos en Stock
                                </h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {statistics?.total_products || 0}
                                </p>
                                {filterUserId && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                        de {statistics?.user_name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">📊</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Unidades
                                </h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {statistics?.total_quantity || 0}
                                </p>
                                {filterUserId && (
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                        de {statistics?.user_name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg p-6 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">💰</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Valor Total{" "}
                                    {filterUserId
                                        ? `(${statistics?.user_name})`
                                        : "(Todos)"}
                                </h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {statistics?.formatted_total_value ||
                                        "$0.00"}
                                </p>
                                {filterUserId && (
                                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                        inventario personal
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros de Usuario */}
                <div className="mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <span className="mr-2">👥</span>
                            Filtrar por Usuario
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => handleUserFilter(null)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    !filterUserId
                                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                }`}
                            >
                                👥 Todos los Usuarios
                            </button>
                            {users.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleUserFilter(user.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        filterUserId == user.id
                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    }`}
                                >
                                    {user.id == currentUserId ? "👤" : "👥"}{" "}
                                    {user.name}
                                    {user.id == currentUserId && " (TÚ)"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Inventario */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">📦</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {filterUserId
                                        ? `Inventario de ${getFilteredUserName()}`
                                        : "Inventario de Todos los Usuarios"}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {inventory?.length || 0} productos en stock
                                    {filterUserId ? " personal" : " compartido"}
                                </p>
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

                    {inventory && inventory.length > 0 ? (
                        viewMode === "cards" ? (
                            // Vista de Cards
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {inventory.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    {/* Header de la Card */}
                                    <div
                                        className={`p-4 ${
                                            item.user_id == currentUserId
                                                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                                : "bg-gradient-to-r from-purple-500 to-indigo-600"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-white text-sm">
                                                        {item.user_id ==
                                                        currentUserId
                                                            ? "👤"
                                                            : "📦"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold text-sm truncate max-w-32">
                                                        {item.product?.name ||
                                                            "Producto no encontrado"}
                                                    </h3>
                                                    <p className="text-white/80 text-xs">
                                                        V{item.version} •{" "}
                                                        {item.user?.name ||
                                                            "Usuario desconocido"}
                                                        {item.user_id ==
                                                            currentUserId &&
                                                            " (TÚ)"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-bold text-lg">
                                                    {item.quantity}
                                                </p>
                                                <p className="text-white/80 text-xs">
                                                    unidades
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contenido de la Card */}
                                    <div className="p-4">
                                        <div className="space-y-3">
                                            {/* Categoría */}
                                            <div className="flex items-center">
                                                <span className="text-gray-500 dark:text-gray-400 mr-3 text-sm">
                                                    🏷️
                                                </span>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Categoría
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {getCategoryName(
                                                            item.product
                                                                ?.category_id
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Precio de Compra */}
                                            <div className="flex items-center">
                                                <span className="text-gray-500 dark:text-gray-400 mr-3 text-sm">
                                                    💰
                                                </span>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Precio de Compra
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatPrice(
                                                            item.purchase_price
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Valor Total */}
                                            <div className="flex items-center">
                                                <span className="text-gray-500 dark:text-gray-400 mr-3 text-sm">
                                                    💎
                                                </span>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Valor Total
                                                    </p>
                                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                                        {formatPrice(
                                                            item.quantity *
                                                                (item.purchase_price ||
                                                                    0)
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Notas */}
                                            {item.notes && (
                                                <div className="flex items-start">
                                                    <span className="text-gray-500 dark:text-gray-400 mr-3 text-sm mt-1">
                                                        📝
                                                    </span>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Notas
                                                        </p>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                            {item.notes}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botones de Acción */}
                                    <div className="px-4 pb-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleEditInventory(item)
                                                }
                                                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-1"
                                            >
                                                <span>✏️</span>
                                                <span>Editar</span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteInventory(item)
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
                                                👤 Usuario
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                🏷️ Categoría
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                📊 Cantidad
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                💰 Precio Compra
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                💎 Valor Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                ⚙️ Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {inventory.map((item) => (
                                            <tr
                                                key={item.id}
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
                                                                {item.product?.name || "Producto no encontrado"}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                V{item.version}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {item.user?.name || "Usuario desconocido"}
                                                        {item.user_id == currentUserId && " (TÚ)"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {getCategoryName(item.product?.category_id)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {item.quantity}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {formatPrice(item.purchase_price)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                                        {formatPrice(item.quantity * (item.purchase_price || 0))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEditInventory(item)
                                                            }
                                                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center space-x-1"
                                                        >
                                                            <span>✏️</span>
                                                            <span>Editar</span>
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteInventory(item)
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
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-gray-400 text-4xl">
                                    📦
                                </span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No hay inventario compartido registrado
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Agrega una compra compartida para comenzar a
                                dividir productos entre usuarios
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Agregar Compra Compartida
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para Agregar Compra Compartida */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Agregar Compra Compartida
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        reset();
                                        setSelectedProduct(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <span className="text-2xl">×</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Producto */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Producto *
                                    </label>
                                    {products && products.length > 0 ? (
                                        <select
                                            value={data.product_id}
                                            onChange={(e) =>
                                                handleProductSelect(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            required
                                        >
                                            <option value="">
                                                Seleccionar producto
                                            </option>
                                            {products.map((product) => (
                                                <option
                                                    key={product.id}
                                                    value={product.id}
                                                >
                                                    {product.name} - Disponible:{" "}
                                                    {product.available_for_shared ||
                                                        0}{" "}
                                                    unidades
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 text-center">
                                            No hay productos disponibles para
                                            dividir
                                        </div>
                                    )}
                                    {errors.product_id && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.product_id}
                                        </p>
                                    )}
                                </div>

                                {/* Información del Producto Seleccionado */}
                                {selectedProduct && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
                                            📦 Información del Producto
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                                    Versión Actual
                                                </p>
                                                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                                                    V{getCurrentVersion()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                                    Precio de Compra Actual
                                                </p>
                                                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                                                    {formatPrice(
                                                        getCurrentPurchasePrice()
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                                Stock Total
                                            </p>
                                            <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                                                {selectedProduct.stock} unidades
                                            </p>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-xs text-green-600 dark:text-green-400">
                                                Disponible para Dividir
                                            </p>
                                            <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                                                {selectedProduct.available_for_shared ||
                                                    0}{" "}
                                                unidades
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Socios */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Socios *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddPartner}
                                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                        >
                                            + Agregar Socio
                                        </button>
                                    </div>

                                    {data.partners.map((partner, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Socio
                                                </label>
                                                <select
                                                    value={partner.user_id}
                                                    onChange={(e) =>
                                                        handlePartnerChange(
                                                            index,
                                                            "user_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                    required
                                                >
                                                    <option value="">
                                                        Seleccionar
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
                                            </div>
                                            <div className="flex items-end gap-2">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                        Cantidad
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={
                                                            selectedProduct?.available_for_shared ||
                                                            selectedProduct?.stock ||
                                                            999
                                                        }
                                                        value={partner.quantity}
                                                        onChange={(e) =>
                                                            handlePartnerChange(
                                                                index,
                                                                "quantity",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                        required
                                                    />
                                                </div>
                                                {data.partners.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemovePartner(
                                                                index
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Notas */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Notas
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Notas sobre la compra compartida..."
                                    />
                                </div>

                                {/* Información sobre el proceso */}
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <span className="text-green-500 mr-3 text-lg">
                                            ℹ️
                                        </span>
                                        <div>
                                            <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                                                ¿Cómo funciona la división?
                                            </h4>
                                            <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                                                <li>
                                                    • Se toma automáticamente la
                                                    versión actual del
                                                    inventario general
                                                </li>
                                                <li>
                                                    • Se usa el precio de compra
                                                    actual de esa versión
                                                </li>
                                                <li>
                                                    • Cada socio recibirá la
                                                    cantidad especificada en su
                                                    inventario personal
                                                </li>
                                                <li>
                                                    • Las ventas de cada socio
                                                    se descontarán de su
                                                    inventario personal
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            reset();
                                            setSelectedProduct(null);
                                        }}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={
                                            processing || products.length === 0
                                        }
                                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        {processing
                                            ? "Guardando..."
                                            : products.length === 0
                                            ? "Sin productos disponibles"
                                            : "Guardar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Editar Inventario */}
            {isEditModalOpen && editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            ✏️ Editar Inventario
                        </h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Producto
                                </label>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {editingItem.product?.name} - V
                                    {editingItem.version}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Usuario: {editingItem.user?.name}
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Cantidad *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editData.quantity}
                                    onChange={(e) =>
                                        setEditData("quantity", e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {editErrors.quantity && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {editErrors.quantity}
                                    </p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Notas
                                </label>
                                <textarea
                                    value={editData.notes}
                                    onChange={(e) =>
                                        setEditData("notes", e.target.value)
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Notas sobre el inventario..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        resetEdit();
                                        setEditingItem(null);
                                    }}
                                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    disabled={editProcessing}
                                >
                                    {editProcessing
                                        ? "Guardando..."
                                        : "Guardar Cambios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para Eliminar Inventario */}
            {isDeleteModalOpen && deletingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            🗑️ Eliminar Inventario
                        </h2>
                        <div className="mb-6">
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                ¿Estás seguro de que quieres eliminar este
                                inventario?
                            </p>
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                    Producto: {deletingItem.product?.name} - V
                                    {deletingItem.version}
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    Usuario: {deletingItem.user?.name}
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    Cantidad: {deletingItem.quantity} unidades
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setDeletingItem(null);
                                }}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
