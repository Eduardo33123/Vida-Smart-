import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Layout from "../components/Layout";

const Inversion = ({
    investments = [],
    statistics = {},
    products = [],
    providers = [],
    categories = [],
    currencies = [],
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewProduct, setIsNewProduct] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        // Campos para inversión
        product_id: "",
        provider_id: "",
        quantity_added: "",
        unit_cost: "",
        total_cost: "",
        notes: "",
        investment_date: new Date().toISOString().split("T")[0],
        // Campos para producto nuevo
        name: "",
        category_id: "",
        currency_id: "",
        price: "",
        description: "",
        image: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSubmitting || processing) {
            console.log("Ya se está enviando, ignorando...");
            return;
        }

        // Validación básica
        if (isNewProduct) {
            if (
                !data.name ||
                !data.category_id ||
                !data.currency_id ||
                !data.price
            ) {
                alert(
                    "Por favor completa todos los campos requeridos para el producto nuevo"
                );
                return;
            }
        } else {
            if (!data.product_id) {
                alert("Por favor selecciona un producto existente");
                return;
            }
        }

        if (!data.quantity_added || !data.unit_cost) {
            alert("Por favor completa la cantidad y el costo unitario");
            return;
        }

        setIsSubmitting(true);

        const submitData = {
            ...data,
            newProduct: isNewProduct ? 1 : 0,
        };
        console.log("Datos a enviar:", submitData);
        console.log("isNewProduct:", isNewProduct);
        console.log("data completa:", data);
        console.log(
            "🔍 Verificando newProduct en submitData:",
            submitData.newProduct
        );
        console.log("Campos del producto nuevo:", {
            name: data.name,
            category_id: data.category_id,
            currency_id: data.currency_id,
            price: data.price,
            description: data.description,
            image: data.image,
        });

        console.log("🚀 Enviando petición a /investments...");
        post("/investments", submitData, {
            onSuccess: (page) => {
                console.log("✅ Inversión guardada exitosamente", page);
                reset();
                setIsModalOpen(false);
                setIsNewProduct(false);
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error("❌ Errores al guardar:", errors);
                setIsSubmitting(false);
            },
            onFinish: () => {
                console.log("🏁 Petición terminada");
                setIsSubmitting(false);
            },
        });

        // Timeout de seguridad para evitar que se quede en "Procesando"
        setTimeout(() => {
            if (isSubmitting) {
                console.log("⏰ Timeout alcanzado, reseteando estado");
                setIsSubmitting(false);
            }
        }, 10000); // 10 segundos
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsNewProduct(false);
        reset();
    };

    const calculateTotalCost = () => {
        const quantity = parseFloat(data.quantity_added) || 0;
        const unitCost = parseFloat(data.unit_cost) || 0;
        const total = quantity * unitCost;
        setData("total_cost", total.toFixed(2));
    };

    const getProductStock = (productId) => {
        const product = products.find((p) => p.id == productId);
        return product ? product.stock : 0;
    };

    const getProductInfo = (productId) => {
        const product = products.find((p) => p.id == productId);
        return product;
    };

    return (
        <Layout>
            <Head title="Inversión - Vida Smart" />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white flex items-center">
                            💰 Inversión
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Gestiona las inversiones en productos y actualiza el
                            stock
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg flex items-center"
                    >
                        ➕ Nueva Inversión
                    </button>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">
                            Total Inversiones
                        </h3>
                        <p className="text-4xl font-bold text-indigo-400">
                            {statistics.total_investments || 0}
                        </p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">
                            Monto Total
                        </h3>
                        <p className="text-4xl font-bold text-green-400">
                            $
                            {statistics.total_amount
                                ? parseFloat(statistics.total_amount).toFixed(2)
                                : "0.00"}
                        </p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">
                            Productos Agregados
                        </h3>
                        <p className="text-4xl font-bold text-blue-400">
                            {statistics.total_quantity || 0}
                        </p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">
                            Productos Disponibles
                        </h3>
                        <p className="text-4xl font-bold text-yellow-400">
                            {products.length}
                        </p>
                    </div>
                </div>

                {/* Lista de Inversiones */}
                {investments.length > 0 ? (
                    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white">
                                📊 Historial de Inversiones
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Producto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Proveedor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Cantidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Costo Unitario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {investments.map((investment) => (
                                        <tr
                                            key={investment.id}
                                            className="hover:bg-gray-700"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-white">
                                                            {
                                                                investment
                                                                    .product
                                                                    ?.name
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-400">
                                                            {
                                                                investment
                                                                    .product
                                                                    ?.category
                                                                    ?.nombre
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {investment.provider?.name ||
                                                    "Sin proveedor"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {investment.quantity_added}{" "}
                                                unidades
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {investment.product?.currency
                                                    ?.symbol || "$"}{" "}
                                                {parseFloat(
                                                    investment.unit_cost
                                                ).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-400">
                                                {investment.product?.currency
                                                    ?.symbol || "$"}{" "}
                                                {parseFloat(
                                                    investment.total_cost
                                                ).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {new Date(
                                                    investment.investment_date
                                                ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💰</div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            No hay inversiones registradas
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Comienza registrando tu primera inversión en
                            productos
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            ➕ Registrar Primera Inversión
                        </button>
                    </div>
                )}

                {/* Modal de Nueva Inversión */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-2 sm:p-4">
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[98vh] sm:max-h-[95vh] overflow-y-auto mx-2 sm:mx-0">
                            <div className="p-4 sm:p-6">
                                <div className="flex justify-between items-center mb-4 sm:mb-6">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                        💰 Nueva Inversión
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
                                    {/* Toggle para Producto Nuevo vs Existente */}
                                    <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                                        <span className="text-sm font-medium text-gray-300">
                                            Tipo de Inversión:
                                        </span>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="product_type"
                                                checked={!isNewProduct}
                                                onChange={() =>
                                                    setIsNewProduct(false)
                                                }
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-300">
                                                Producto Existente
                                            </span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="product_type"
                                                checked={isNewProduct}
                                                onChange={() =>
                                                    setIsNewProduct(true)
                                                }
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-300">
                                                Producto Nuevo
                                            </span>
                                        </label>
                                    </div>

                                    {/* Producto Existente */}
                                    {!isNewProduct && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Producto *
                                            </label>
                                            <select
                                                value={data.product_id}
                                                onChange={(e) =>
                                                    setData(
                                                        "product_id",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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
                                                        {product.name} - Stock:{" "}
                                                        {product.stock} -{" "}
                                                        {
                                                            product.category
                                                                ?.nombre
                                                        }
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.product_id && (
                                                <p className="text-red-400 text-sm mt-1">
                                                    {errors.product_id}
                                                </p>
                                            )}
                                            {data.product_id && (
                                                <div className="mt-2 p-3 bg-gray-700 rounded-md">
                                                    <p className="text-sm text-gray-300">
                                                        <span className="font-semibold">
                                                            Stock actual:
                                                        </span>{" "}
                                                        {getProductStock(
                                                            data.product_id
                                                        )}{" "}
                                                        unidades
                                                    </p>
                                                    <p className="text-sm text-gray-300">
                                                        <span className="font-semibold">
                                                            Categoría:
                                                        </span>{" "}
                                                        {
                                                            getProductInfo(
                                                                data.product_id
                                                            )?.category?.nombre
                                                        }
                                                    </p>
                                                    <p className="text-sm text-gray-300">
                                                        <span className="font-semibold">
                                                            Moneda:
                                                        </span>{" "}
                                                        {
                                                            getProductInfo(
                                                                data.product_id
                                                            )?.currency?.symbol
                                                        }{" "}
                                                        {
                                                            getProductInfo(
                                                                data.product_id
                                                            )?.currency?.code
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Producto Nuevo */}
                                    {isNewProduct && (
                                        <div className="space-y-4 p-4 bg-blue-900 bg-opacity-20 rounded-lg border border-blue-500">
                                            <h3 className="text-lg font-semibold text-blue-400">
                                                📦 Información del Producto
                                                Nuevo
                                            </h3>

                                            {/* Nombre del Producto */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Nombre del Producto *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                    placeholder="Ej: Focos RGB Inteligentes"
                                                    required={isNewProduct}
                                                />
                                                {errors.name && (
                                                    <p className="text-red-400 text-sm mt-1">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Categoría y Moneda */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                        className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                        required={isNewProduct}
                                                    >
                                                        <option value="">
                                                            Seleccionar
                                                            categoría
                                                        </option>
                                                        {categories.map(
                                                            (category) => (
                                                                <option
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    value={
                                                                        category.id
                                                                    }
                                                                >
                                                                    {
                                                                        category.nombre
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    {errors.category_id && (
                                                        <p className="text-red-400 text-sm mt-1">
                                                            {errors.category_id}
                                                        </p>
                                                    )}
                                                </div>

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
                                                        className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                        required={isNewProduct}
                                                    >
                                                        <option value="">
                                                            Seleccionar moneda
                                                        </option>
                                                        {currencies.map(
                                                            (currency) => (
                                                                <option
                                                                    key={
                                                                        currency.id
                                                                    }
                                                                    value={
                                                                        currency.id
                                                                    }
                                                                >
                                                                    {
                                                                        currency.symbol
                                                                    }{" "}
                                                                    {
                                                                        currency.code
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        currency.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    {errors.currency_id && (
                                                        <p className="text-red-400 text-sm mt-1">
                                                            {errors.currency_id}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Precio de Venta */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Precio de Venta *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={data.price}
                                                    onChange={(e) =>
                                                        setData(
                                                            "price",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                    placeholder="0.00"
                                                    required={isNewProduct}
                                                />
                                                {errors.price && (
                                                    <p className="text-red-400 text-sm mt-1">
                                                        {errors.price}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Descripción e Imagen */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Descripción (Opcional)
                                                    </label>
                                                    <textarea
                                                        value={data.description}
                                                        onChange={(e) =>
                                                            setData(
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                        rows={3}
                                                        className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                        placeholder="Descripción del producto..."
                                                    />
                                                    {errors.description && (
                                                        <p className="text-red-400 text-sm mt-1">
                                                            {errors.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        URL de Imagen (Opcional)
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={data.image}
                                                        onChange={(e) =>
                                                            setData(
                                                                "image",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                        placeholder="https://ejemplo.com/imagen.jpg"
                                                    />
                                                    {errors.image && (
                                                        <p className="text-red-400 text-sm mt-1">
                                                            {errors.image}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Proveedor */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Proveedor (Opcional)
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

                                    {/* Cantidad y Costo Unitario */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Cantidad a Agregar *
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={data.quantity_added}
                                                onChange={(e) => {
                                                    setData(
                                                        "quantity_added",
                                                        e.target.value
                                                    );
                                                    calculateTotalCost();
                                                }}
                                                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                placeholder="0"
                                                required
                                            />
                                            {errors.quantity_added && (
                                                <p className="text-red-400 text-sm mt-1">
                                                    {errors.quantity_added}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Costo Unitario *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.unit_cost}
                                                onChange={(e) => {
                                                    setData(
                                                        "unit_cost",
                                                        e.target.value
                                                    );
                                                    calculateTotalCost();
                                                }}
                                                className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                placeholder="0.00"
                                                required
                                            />
                                            {errors.unit_cost && (
                                                <p className="text-red-400 text-sm mt-1">
                                                    {errors.unit_cost}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Total Costo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Total de la Inversión
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.total_cost}
                                            readOnly
                                            className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base bg-gray-600 border border-gray-600 rounded-md text-white cursor-not-allowed"
                                            placeholder="0.00"
                                        />
                                        {errors.total_cost && (
                                            <p className="text-red-400 text-sm mt-1">
                                                {errors.total_cost}
                                            </p>
                                        )}
                                    </div>

                                    {/* Fecha */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Fecha de Inversión *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.investment_date}
                                            onChange={(e) =>
                                                setData(
                                                    "investment_date",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.investment_date && (
                                            <p className="text-red-400 text-sm mt-1">
                                                {errors.investment_date}
                                            </p>
                                        )}
                                    </div>

                                    {/* Notas */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Notas (Opcional)
                                        </label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
                                            rows={3}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Notas adicionales sobre esta inversión..."
                                        />
                                        {errors.notes && (
                                            <p className="text-red-400 text-sm mt-1">
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
                                            disabled={
                                                processing || isSubmitting
                                            }
                                            className="w-full sm:w-auto px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all duration-200"
                                        >
                                            {processing || isSubmitting
                                                ? "Procesando..."
                                                : "💾 Registrar Inversión"}
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

export default Inversion;
