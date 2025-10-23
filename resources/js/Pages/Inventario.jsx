import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Layout from "../components/Layout";
import { ProductModal } from "../components/Modal";

const Inventario = ({
    products = [],
    statistics = {},
    categories = [],
    currencies = [],
    providers = [],
}) => {
    const { delete: deleteProduct } = useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleDeleteProduct = (product) => {
        if (
            confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)
        ) {
            deleteProduct(`/products/${product.id}`, {
                onSuccess: () => {
                    // El producto se eliminará y la página se actualizará automáticamente
                },
                onError: (errors) => {
                    alert(
                        "Error al eliminar el producto: " +
                            Object.values(errors).join(", ")
                    );
                },
            });
        }
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    // Función para formatear precio
    const formatPrice = (price) => {
        if (!price) return "$0.00";
        return `$${parseFloat(price).toFixed(2)}`;
    };

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

    return (
        <Layout>
            <Head title="Inventario - Vida Smart" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-6">
                                <span className="text-white text-2xl">📦</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    📦 Inventario
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Gestiona todos los productos de domótica en
                                    stock
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            ➕ Agregar Producto
                        </button>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">📦</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Total Productos
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {products.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">✅</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    En Stock
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {products.filter((p) => p.stock > 5).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-6 border border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">⚠️</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Stock Bajo
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {
                                        products.filter(
                                            (p) => p.stock > 0 && p.stock <= 5
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl shadow-lg p-6 border border-red-200 dark:border-red-700">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white text-xl">❌</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Sin Stock
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {
                                        products.filter((p) => p.stock === 0)
                                            .length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid de Productos */}
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            No hay productos en inventario
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Comienza agregando tu primer producto de domótica
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
                        >
                            ➕ Agregar Producto
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => {
                            const stockStatus = getStockStatus(product.stock);
                            return (
                                <div
                                    key={product.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
                                >
                                    {/* Imagen del Producto */}
                                    <div className="h-52 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center relative overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                    e.target.nextSibling.style.display =
                                                        "flex";
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`${
                                                product.image
                                                    ? "hidden"
                                                    : "flex"
                                            } items-center justify-center w-full h-full`}
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                <span className="text-2xl text-white">
                                                    📦
                                                </span>
                                            </div>
                                        </div>
                                        {/* Badge de categoría en la esquina */}
                                        <div className="absolute top-3 left-3">
                                            <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1 rounded-full shadow-lg">
                                                {getCategoryName(
                                                    product.category_id
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contenido de la Card */}
                                    <div className="p-6">
                                        {/* Nombre del Producto */}
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                                            {product.name}
                                        </h3>

                                        {/* Precio de Venta */}
                                        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                                            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-1">
                                                💰 Precio de Venta
                                            </p>
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {product.currency
                                                    ? `${
                                                          product.currency
                                                              .symbol
                                                      } ${parseFloat(
                                                          product.price
                                                      ).toFixed(2)}`
                                                    : `$${parseFloat(
                                                          product.price
                                                      ).toFixed(2)}`}
                                            </p>
                                        </div>

                                        {/* Precio de Compra */}
                                        {product.purchase_price && (
                                            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                                                    💸 Precio de Compra
                                                </p>
                                                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                    {product.currency
                                                        ? `${
                                                              product.currency
                                                                  .symbol
                                                          } ${parseFloat(
                                                              product.purchase_price
                                                          ).toFixed(2)}`
                                                        : `$${parseFloat(
                                                              product.purchase_price
                                                          ).toFixed(2)}`}
                                                </p>
                                            </div>
                                        )}

                                        {/* Stock */}
                                        <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-xl border border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                        📦 Stock:
                                                    </span>
                                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {product.stock}
                                                    </span>
                                                </div>
                                                <span
                                                    className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                                                        product.stock === 0
                                                            ? "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30 border border-red-300 dark:border-red-600"
                                                            : product.stock <= 5
                                                            ? "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600"
                                                            : "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30 border border-green-300 dark:border-green-600"
                                                    }`}
                                                >
                                                    {stockStatus.text}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Botones de Acción */}
                                        <div className="space-y-3">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/products/${product.id}/edit`}
                                                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
                                                >
                                                    ✏️ Editar
                                                </Link>
                                                <Link
                                                    href={`/products/${product.id}`}
                                                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
                                                >
                                                    👁️ Ver
                                                </Link>
                                            </div>

                                            {/* Botón de Eliminar */}
                                            <button
                                                onClick={() =>
                                                    handleDeleteProduct(product)
                                                }
                                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Modal para crear/editar producto */}
                {isModalOpen && (
                    <ProductModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        product={selectedProduct}
                        categories={categories}
                        currencies={currencies}
                        providers={providers}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Inventario;
