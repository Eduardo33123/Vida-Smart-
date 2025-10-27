import React from "react";
import { Link, useForm } from "@inertiajs/react";

const Login = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Efectos de fondo negro con acentos azul oscuro */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-black to-blue-900/10"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-900/15 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-800/12 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-900/8 rounded-full blur-2xl"></div>
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-800/6 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-700/5 rounded-full blur-2xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    {/* Imagen del logo */}
                    <div className="flex justify-center mb-4">
                        <img
                            src="/images/logo.png"
                            alt="Vida Smart Logo"
                            className="h-56 w-auto"
                        />
                    </div>
                </div>

                <div className="bg-black/40 backdrop-blur-2xl border border-gray-800/30 rounded-3xl p-8 shadow-2xl shadow-black/50">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                className="w-full px-4 py-3 bg-black/60 border-0 rounded-xl text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-gray-600/60 transition-all duration-200 backdrop-blur-sm"
                                placeholder="tu@email.com"
                                autoComplete="username"
                                required
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            {errors.email && (
                                <p className="mt-2 text-red-400 text-sm">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                className="w-full px-4 py-3 bg-black/60 border-0 rounded-xl text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-gray-600/60 transition-all duration-200 backdrop-blur-sm"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                                onChange={(e) => setData("password", e.target.value)}
                            />
                            {errors.password && (
                                <p className="mt-2 text-red-400 text-sm">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData("remember", e.target.checked)}
                                    className="w-4 h-4 text-gray-400 bg-black/60 border-gray-700/40 rounded focus:ring-gray-600/60 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-gray-300">Recordarme</span>
                            </label>

                            <Link
                                href={route("password.request")}
                                className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-gradient-to-r from-blue-950 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-950/40 hover:shadow-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {processing ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            ¿No tienes cuenta?{' '}
                            <Link href={route("register")} className="text-gray-300 hover:text-white font-medium transition-colors duration-200">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
