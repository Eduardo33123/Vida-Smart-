import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Layout from "../components/Layout";
import { CategoryModal } from "../components/Modal";

const Categorias = ({
    categories = [],
    statistics = {},
    allCategories = [],
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { delete: deleteCategory } = useForm();

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
    };

    const handleDeleteCategory = (category) => {
        if (
            confirm(
                `¿Estás seguro de que quieres eliminar "${category.nombre}"?`
            )
        ) {
            deleteCategory(`/categories/${category.id}`, {
                onSuccess: () => {
                    // La categoría se eliminará y la página se actualizará automáticamente
                },
                onError: (errors) => {
                    alert(
                        "Error al eliminar la categoría: " +
                            Object.values(errors).join(", ")
                    );
                },
            });
        }
    };

    const renderCategoryCard = (category) => {
        const hasChildren = category.children && category.children.length > 0;

        return (
            <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200"
            >
                {/* Header de la Card */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <span className="text-xl text-white">
                                    {category.icono}
                                </span>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {category.nombre}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ID: #{category.id}
                                    {category.parent && (
                                        <span className="ml-2">
                                            • Padre: {category.parent.nombre}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${
                                category.is_active
                                    ? "text-green-400 bg-green-900"
                                    : "text-red-400 bg-red-900"
                            }`}
                        >
                            {category.is_active ? "Activa" : "Inactiva"}
                        </span>
                    </div>

                    {/* Descripción */}
                    {category.descripcion && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-400 line-clamp-3">
                                {category.descripcion}
                            </p>
                        </div>
                    )}

                    {/* Información adicional */}
                    <div className="flex items-center justify-between text-sm text-gray-300">
                        <div className="flex items-center space-x-4">
                            <span>Orden: {category.sort_order}</span>
                            {hasChildren && (
                                <span>
                                    {category.children.length} subcategoría(s)
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEditCategory(category)}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            ✏️ Editar
                        </button>
                        <Link
                            href={`/categories/${category.id}`}
                            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-center"
                        >
                            👁️ Ver
                        </Link>
                    </div>

                    {/* Botón de Eliminar */}
                    <div className="mt-3">
                        <button
                            onClick={() => handleDeleteCategory(category)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                        >
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <Head title="Categorías - Vida Smart" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-6">
                                <span className="text-white text-2xl">📂</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    📂 Categorías
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Gestiona las categorías jerárquicas de
                                    productos de domótica
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
                        >
                            <span className="mr-2">➕</span>
                            Agregar Categoría
                        </button>
                    </div>
                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-600 rounded-lg">
                                    <span className="text-2xl">📂</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-gray-400 text-sm">
                                        Total Categorías
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {statistics.total_categories || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-600 rounded-lg">
                                    <span className="text-2xl">🌳</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-gray-400 text-sm">
                                        Categorías Raíz
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {statistics.root_categories || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-600 rounded-lg">
                                    <span className="text-2xl">📁</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-gray-400 text-sm">
                                        Subcategorías
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {statistics.subcategories || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-600 rounded-lg">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-gray-400 text-sm">
                                        Activas
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {statistics.active_categories || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Grid de Categorías */}
                    {categories.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📂</div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                No hay categorías registradas
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Comienza agregando tu primera categoría
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Agregar Primera Categoría
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category) =>
                                renderCategoryCard(category)
                            )}
                        </div>
                    )}
                    {/* Modal */}
                    <CategoryModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        category={selectedCategory}
                        allCategories={allCategories}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Categorias;
