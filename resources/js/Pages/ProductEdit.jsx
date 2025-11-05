import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Layout from "../Components/Layout";

const ProductEdit = ({
    product,
    categories = [],
    currencies = [],
    providers = [],
}) => {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        category_id: product.category_id,
        currency_id: product.currency_id,
        provider_id: product.provider_id,
        price: product.price,
        purchase_price: product.purchase_price,
        stock: product.stock,
        description: product.description || "",
        image: product.image || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/products/${product.id}`, {
            onSuccess: () => {
                // Redirigir al detalle del producto después de editar
                window.location.href = `/products/${product.id}`;
            },
        });
    };

    return (
        <Layout>
            <Head title={`Editar ${product.name} - Vida Smart`} />

            <div className="p-6">
                {/* Header con navegación */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/products/${product.id}`}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            ← Volver al Producto
                        </Link>
                        <div className="h-6 w-px bg-gray-600"></div>
                        <h1 className="text-3xl font-bold text-white">
                            Editar Producto
                        </h1>
                    </div>
                    <div className="flex space-x-3">
                        <Link
                            href={`/products/${product.id}`}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            👁️ Ver Producto
                        </Link>
                        <Link
                            href="/inventario"
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            📦 Inventario
                        </Link>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-6">
                                📝 Información del Producto
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nombre del Producto */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Nombre del Producto *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ej: Foco inteligente Wi-Fi"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Categoría */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Categoría *
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) =>
                                            setData(
                                                "category_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">
                                            Seleccionar categoría
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                {/* Moneda */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Moneda *
                                    </label>
                                    <select
                                        value={data.currency_id}
                                        onChange={(e) =>
                                            setData(
                                                "currency_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="">
                                            Seleccionar moneda
                                        </option>
                                        {currencies.map((currency) => (
                                            <option
                                                key={currency.id}
                                                value={currency.id}
                                            >
                                                {currency.symbol}{" "}
                                                {currency.code} -{" "}
                                                {currency.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.currency_id && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors.currency_id}
                                        </p>
                                    )}
                                </div>

                                {/* Proveedor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Proveedor
                                    </label>
                                    <select
                                        value={data.provider_id}
                                        onChange={(e) =>
                                            setData(
                                                "provider_id",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">
                                            Seleccionar proveedor
                                        </option>
                                        {providers.map((provider) => (
                                            <option
                                                key={provider.id}
                                                value={provider.id}
                                            >
                                                {provider.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.provider_id && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors.provider_id}
                                        </p>
                                    )}
                                </div>

                                {/* Precio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Precio de Venta *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData("price", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="0.00"
                                        required
                                    />
                                    {errors.price && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors.price}
                                        </p>
                                    )}
                                </div>

                                {/* Precio de Compra */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Precio de Compra
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.purchase_price}
                                        onChange={(e) =>
                                            setData(
                                                "purchase_price",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="0.00"
                                    />
                                    {errors.purchase_price && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors.purchase_price}
                                        </p>
                                    )}
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Stock Disponible *
                                    </label>
                                    <input
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) =>
                                            setData("stock", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="0"
                                        required
                                    />
                                    {errors.stock && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors.stock}
                                        </p>
                                    )}
                                </div>

                                {/* Imagen */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        URL de la Imagen
                                    </label>
                                    <input
                                        type="url"
                                        value={data.image}
                                        onChange={(e) =>
                                            setData("image", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                    {errors.image && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors.image}
                                        </p>
                                    )}
                                </div>

                                {/* Descripción */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Descripción del Producto
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={4}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Describe las características del producto..."
                                    />
                                    {errors.description && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Vista Previa */}
                        {data.image && (
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    🖼️ Vista Previa
                                </h3>
                                <div className="max-w-md mx-auto">
                                    <div className="bg-gray-700 rounded-lg overflow-hidden">
                                        <img
                                            src={data.image}
                                            alt="Vista previa"
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextSibling.style.display =
                                                    "flex";
                                            }}
                                        />
                                        <div className="hidden items-center justify-center h-48">
                                            <span className="text-4xl text-gray-500">
                                                ❌
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Botones de Acción */}
                        <div className="flex justify-end space-x-4">
                            <Link
                                href={`/products/${product.id}`}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                            >
                                {processing
                                    ? "Guardando..."
                                    : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ProductEdit;
