import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        {title}
                    </h3>
                    {children}
                </div>
            </div>
        </div>
    );
};

export const ProductModal = ({
    isOpen,
    onClose,
    onSubmit,
    product = null,
    categories = [],
    currencies = [],
    providers = [],
}) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: product?.name || "",
        category_id: product?.category_id || "",
        currency_id: product?.currency_id || "",
        provider_id: product?.provider_id || "",
        price: product?.price || "",
        purchase_price: product?.purchase_price || "",
        stock: product?.stock || "",
        description: product?.description || "",
        image: product?.image || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (product) {
            put(`/products/${product.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post("/products", {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={product ? "Editar Producto" : "Agregar Nuevo Producto"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre del Producto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nombre del Producto *
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Ej: Foco inteligente Wi-Fi"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Categoría *
                        </label>
                        <select
                            value={data.category_id}
                            onChange={(e) =>
                                setData("category_id", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            required
                        >
                            <option value="">Seleccionar categoría</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.category_id}
                            </p>
                        )}
                    </div>

                    {/* Moneda */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Moneda *
                        </label>
                        <select
                            value={data.currency_id}
                            onChange={(e) =>
                                setData("currency_id", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            required
                        >
                            <option value="">Seleccionar moneda</option>
                            {currencies.map((currency) => (
                                <option key={currency.id} value={currency.id}>
                                    {currency.symbol} {currency.code} -{" "}
                                    {currency.name}
                                </option>
                            ))}
                        </select>
                        {errors.currency_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.currency_id}
                            </p>
                        )}
                    </div>

                    {/* Proveedor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Proveedor
                        </label>
                        <select
                            value={data.provider_id}
                            onChange={(e) =>
                                setData("provider_id", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Seleccionar proveedor</option>
                            {providers.map((provider) => (
                                <option key={provider.id} value={provider.id}>
                                    {provider.name}
                                </option>
                            ))}
                        </select>
                        {errors.provider_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.provider_id}
                            </p>
                        )}
                    </div>

                    {/* Precio de Venta */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Precio de Venta *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="0.00"
                            required
                        />
                        {errors.price && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    {/* Precio de Compra */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Precio de Compra
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.purchase_price}
                            onChange={(e) =>
                                setData("purchase_price", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="0.00"
                        />
                        {errors.purchase_price && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.purchase_price}
                            </p>
                        )}
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Stock *
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={data.stock}
                            onChange={(e) => setData("stock", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="0"
                            required
                        />
                        {errors.stock && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.stock}
                            </p>
                        )}
                    </div>

                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            URL de Imagen
                        </label>
                        <input
                            type="url"
                            value={data.image}
                            onChange={(e) => setData("image", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        {errors.image && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.image}
                            </p>
                        )}
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descripción
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Descripción del producto..."
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md"
                    >
                        {processing
                            ? "Procesando..."
                            : product
                            ? "Actualizar"
                            : "Guardar"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export const ProviderModal = ({
    isOpen,
    onClose,
    provider = null,
    currencies = [],
}) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: provider?.name || "",
        email: provider?.email || "",
        currency_id: provider?.currency_id || "",
        description: provider?.description || "",
        is_active: provider?.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (provider) {
            put(`/providers/${provider.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post("/providers", {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={provider ? "Editar Proveedor" : "Agregar Nuevo Proveedor"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Nombre del proveedor"
                        required
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="proveedor@ejemplo.com"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Moneda */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Moneda *
                    </label>
                    <select
                        value={data.currency_id}
                        onChange={(e) => setData("currency_id", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                    >
                        <option value="">Seleccionar moneda</option>
                        {currencies.map((currency) => (
                            <option key={currency.id} value={currency.id}>
                                {currency.symbol} {currency.code} -{" "}
                                {currency.name}
                            </option>
                        ))}
                    </select>
                    {errors.currency_id && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.currency_id}
                        </p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descripción
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Descripción del proveedor..."
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Estado Activo */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={data.is_active}
                        onChange={(e) => setData("is_active", e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                        htmlFor="is_active"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                        Proveedor activo
                    </label>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md"
                    >
                        {processing
                            ? "Procesando..."
                            : provider
                            ? "Actualizar"
                            : "Guardar"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export const CategoryModal = ({
    isOpen,
    onClose,
    category = null,
    allCategories = [],
}) => {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: category?.nombre || "",
        descripcion: category?.descripcion || "",
        parent_id: category?.parent_id || "",
        icono: category?.icono || "📂",
        is_active: category?.is_active ?? true,
        sort_order: category?.sort_order || 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (category) {
            put(`/categories/${category.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post("/categories", {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={category ? "Editar Categoría" : "Agregar Nueva Categoría"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        value={data.nombre}
                        onChange={(e) => setData("nombre", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Nombre de la categoría"
                        required
                    />
                    {errors.nombre && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.nombre}
                        </p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Descripción
                    </label>
                    <textarea
                        value={data.descripcion}
                        onChange={(e) => setData("descripcion", e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Descripción de la categoría..."
                    />
                    {errors.descripcion && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.descripcion}
                        </p>
                    )}
                </div>

                {/* Categoría Padre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Categoría Padre
                    </label>
                    <select
                        value={data.parent_id}
                        onChange={(e) => setData("parent_id", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Sin categoría padre</option>
                        {allCategories
                            .filter((cat) => cat.id !== category?.id)
                            .map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                </option>
                            ))}
                    </select>
                    {errors.parent_id && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.parent_id}
                        </p>
                    )}
                </div>

                {/* Icono */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Icono
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                        {availableIcons.map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => setData("icono", icon)}
                                className={`p-2 text-2xl rounded border ${
                                    data.icono === icon
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                                }`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                    {errors.icono && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.icono}
                        </p>
                    )}
                </div>

                {/* Orden */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Orden de Visualización
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={data.sort_order}
                        onChange={(e) => setData("sort_order", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="0"
                    />
                    {errors.sort_order && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.sort_order}
                        </p>
                    )}
                </div>

                {/* Estado Activo */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={data.is_active}
                        onChange={(e) => setData("is_active", e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                        htmlFor="is_active"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                        Categoría activa
                    </label>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md"
                    >
                        {processing
                            ? "Procesando..."
                            : category
                            ? "Actualizar"
                            : "Guardar"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default Modal;
