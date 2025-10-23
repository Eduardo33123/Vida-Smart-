import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "../components/Layout";

const CategoryShow = ({ category }) => {
    return (
        <Layout>
            <Head title={`${category.nombre} - Vida Smart`} />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {category.icono} {category.nombre}
                        </h1>
                        <p className="text-gray-400">
                            {category.descripcion || "Detalles de la categoría"}
                        </p>
                    </div>
                    <Link
                        href="/categoria"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                    >
                        <span className="mr-2">←</span>
                        Volver a Categorías
                    </Link>
                </div>

                {/* Información de la Categoría */}
                <div className="bg-gray-800 p-6 rounded-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-600 rounded-lg">
                                <span className="text-2xl">
                                    {category.icono}
                                </span>
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-400 text-sm">
                                    Categoría
                                </p>
                                <p className="text-xl font-bold text-white">
                                    {category.nombre}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-3 bg-green-600 rounded-lg">
                                <span className="text-2xl">📁</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-400 text-sm">
                                    Subcategorías
                                </p>
                                <p className="text-xl font-bold text-white">
                                    {category.children
                                        ? category.children.length
                                        : 0}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="p-3 bg-purple-600 rounded-lg">
                                <span className="text-2xl">📦</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-gray-400 text-sm">
                                    Productos
                                </p>
                                <p className="text-xl font-bold text-white">
                                    {category.products
                                        ? category.products.length
                                        : 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Productos en esta Categoría */}
                {category.products && category.products.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            📦 Productos en esta Categoría
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                                <span className="text-lg">
                                                    📦
                                                </span>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-lg font-semibold text-white">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    ID: #{product.id}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-300">
                                            <div className="flex justify-between">
                                                <span>Precio:</span>
                                                <span className="font-semibold text-green-400">
                                                    {product.currency
                                                        ? `${product.currency.symbol} ${product.price}`
                                                        : `$${product.price}`}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Stock:</span>
                                                <span
                                                    className={`font-semibold ${
                                                        product.stock === 0
                                                            ? "text-red-400"
                                                            : product.stock <= 5
                                                            ? "text-yellow-400"
                                                            : "text-green-400"
                                                    }`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors text-center block"
                                            >
                                                👁️ Ver Producto
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CategoryShow;
