import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Layout from "../Components/Layout.jsx";

const CategoryEdit = ({ category, rootCategories }) => {
    const { data, setData, put, processing, errors } = useForm({
        nombre: category.nombre || "",
        descripcion: category.descripcion || "",
        parent_id: category.parent_id || "",
        icono: category.icono || "📂",
        is_active: category.is_active ?? true,
        sort_order: category.sort_order || 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/categories/${category.id}`);
    };

    // Iconos disponibles para categorías
    const availableIcons = [
        "📂",
        "💡",
        "🔒",
        "🌡️",
        "🎤",
        "⚡",
        "🔧",
        "📹",
        "👁️",
        "🚨",
        "🌀",
        "❄️",
        "📡",
        "📱",
        "🔌",
        "📊",
        "☀️",
        "📐",
        "🔋",
        "🌈",
        "🔘",
        "🏠",
        "🚪",
        "🪟",
        "🛏️",
        "🛁",
        "🍳",
        "📺",
        "🎮",
        "🎵",
    ];

    return (
        <Layout>
            <Head title={`Editar ${category.nombre} - Vida Smart`} />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            ✏️ Editar Categoría
                        </h1>
                        <p className="text-gray-400">
                            Modifica los datos de la categoría "
                            {category.nombre}"
                        </p>
                    </div>
                    <Link
                        href={`/categories/${category.id}`}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                    >
                        <span className="mr-2">←</span>
                        Volver
                    </Link>
                </div>

                {/* Formulario */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre de la Categoría */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre de la Categoría *
                                </label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) =>
                                        setData("nombre", e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Ej: Iluminación Inteligente"
                                    required
                                />
                                {errors.nombre && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.nombre}
                                    </p>
                                )}
                            </div>

                            {/* Icono */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Icono *
                                </label>
                                <div className="grid grid-cols-6 gap-2">
                                    {availableIcons.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() =>
                                                setData("icono", icon)
                                            }
                                            className={`p-2 text-2xl rounded border-2 transition-colors ${
                                                data.icono === icon
                                                    ? "border-indigo-500 bg-indigo-100"
                                                    : "border-gray-600 hover:border-gray-500"
                                            }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                                {errors.icono && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.icono}
                                    </p>
                                )}
                            </div>

                            {/* Categoría Padre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Categoría Padre (Opcional)
                                </label>
                                <select
                                    value={data.parent_id}
                                    onChange={(e) =>
                                        setData("parent_id", e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">
                                        Sin categoría padre (Categoría raíz)
                                    </option>
                                    {rootCategories
                                        .filter((cat) => cat.id !== category.id) // Evitar auto-referencia
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.icono} {cat.nombre}
                                            </option>
                                        ))}
                                </select>
                                {errors.parent_id && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.parent_id}
                                    </p>
                                )}
                            </div>

                            {/* Orden de Visualización */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Orden de Visualización
                                </label>
                                <input
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        setData(
                                            "sort_order",
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    min="0"
                                />
                                {errors.sort_order && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.sort_order}
                                    </p>
                                )}
                            </div>

                            {/* Estado Activo */}
                            <div className="md:col-span-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData(
                                                "is_active",
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-800 rounded"
                                    />
                                    <span className="ml-2 block text-sm text-gray-300">
                                        Categoría activa
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Descripción (Opcional)
                            </label>
                            <textarea
                                value={data.descripcion}
                                onChange={(e) =>
                                    setData("descripcion", e.target.value)
                                }
                                rows={4}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Describe la categoría y su propósito..."
                            />
                            {errors.descripcion && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.descripcion}
                                </p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
                            <Link
                                href={`/categories/${category.id}`}
                                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {processing
                                    ? "Guardando..."
                                    : "Actualizar Categoría"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CategoryEdit;
