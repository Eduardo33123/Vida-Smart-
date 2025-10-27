import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function LoginStyles({ status, canResetPassword, style = 1 }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    // Estilo 1: Minimalista Negro Elegante (ya implementado)
    const Style1 = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                        <span className="text-white text-3xl font-bold">VS</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Vida Smart</h1>
                    <p className="text-gray-400">Inicia sesión en tu cuenta</p>
                </div>

                <div className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                    {status && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-green-400 text-sm font-medium">{status}</p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="Correo Electrónico" className="block text-sm font-medium text-gray-300 mb-2" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="tu@email.com"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Contraseña" className="block text-sm font-medium text-gray-300 mb-2" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2 text-red-400" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-gray-300">Recordarme</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={processing}
                        >
                            {processing ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </PrimaryButton>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            ¿No tienes cuenta?{' '}
                            <Link href={route('register')} className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Estilo 2: Cyberpunk Neon
    const Style2 = () => (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Efectos de fondo cyberpunk */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-cyan-500/25 transform rotate-12">
                        <span className="text-black text-2xl font-bold">VS</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                        VIDA SMART
                    </h1>
                    <p className="text-gray-400 text-sm tracking-wider">ACCESO AL SISTEMA</p>
                </div>

                <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-cyan-500/30 rounded-xl p-8 shadow-2xl shadow-cyan-500/10">
                    {status && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                            <p className="text-green-400 text-sm font-medium">{status}</p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="EMAIL" className="block text-xs font-bold text-cyan-400 mb-2 tracking-wider" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3 bg-black/50 border-2 border-cyan-500/30 rounded-lg text-cyan-100 placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 font-mono"
                                placeholder="usuario@dominio.com"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="CONTRASEÑA" className="block text-xs font-bold text-cyan-400 mb-2 tracking-wider" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-3 bg-black/50 border-2 border-cyan-500/30 rounded-lg text-cyan-100 placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 font-mono"
                                placeholder="••••••••••"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2 text-red-400" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-cyan-400 bg-black border-cyan-500 rounded focus:ring-cyan-400 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-gray-300 font-mono">RECORDAR</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-mono tracking-wider"
                                >
                                    ¿OLVIDASTE?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton 
                            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={processing}
                        >
                            {processing ? 'CONECTANDO...' : 'ACCEDER'}
                        </PrimaryButton>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-xs tracking-wider">
                            ¿NUEVO USUARIO?{' '}
                            <Link href={route('register')} className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-200">
                                REGISTRARSE
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Estilo 3: Glassmorphism Oscuro
    const Style3 = () => (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                                    radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
                }}></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                        <span className="text-white text-2xl font-bold">VS</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Vida Smart</h1>
                    <p className="text-gray-400">Bienvenido de vuelta</p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {status && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                            <p className="text-green-400 text-sm font-medium">{status}</p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="Correo Electrónico" className="block text-sm font-medium text-gray-300 mb-2" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
                                placeholder="tu@email.com"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Contraseña" className="block text-sm font-medium text-gray-300 mb-2" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2 text-red-400" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-blue-500 bg-white/5 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-gray-300">Recordarme</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton 
                            className="w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-sm"
                            disabled={processing}
                        >
                            {processing ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </PrimaryButton>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            ¿No tienes cuenta?{' '}
                            <Link href={route('register')} className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Estilo 4: Matrix Style
    const Style4 = () => (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Efectos Matrix */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-transparent to-green-900/20"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-0 left-1/4 w-px h-full bg-green-500 animate-pulse"></div>
                    <div className="absolute top-0 left-1/2 w-px h-full bg-green-500 animate-pulse delay-500"></div>
                    <div className="absolute top-0 left-3/4 w-px h-full bg-green-500 animate-pulse delay-1000"></div>
                </div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-green-500/25">
                        <span className="text-black text-2xl font-bold font-mono">VS</span>
                    </div>
                    <h1 className="text-3xl font-bold text-green-400 mb-2 font-mono">VIDA SMART</h1>
                    <p className="text-gray-400 text-sm font-mono">SISTEMA DE ACCESO</p>
                </div>

                <div className="bg-gray-900/90 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 shadow-2xl shadow-green-500/10">
                    {status && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                            <p className="text-green-400 text-sm font-medium font-mono">{status}</p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="EMAIL" className="block text-sm font-bold text-green-400 mb-2 font-mono" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3 bg-black/50 border border-green-500/50 rounded-lg text-green-400 placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 font-mono"
                                placeholder="usuario@dominio.com"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="PASSWORD" className="block text-sm font-bold text-green-400 mb-2 font-mono" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-3 bg-black/50 border border-green-500/50 rounded-lg text-green-400 placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 font-mono"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2 text-red-400" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-green-500 bg-black border-green-500 rounded focus:ring-green-500 focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-gray-300 font-mono">RECORDAR</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-green-400 hover:text-green-300 transition-colors duration-200 font-mono"
                                >
                                    ¿OLVIDASTE?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton 
                            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/25 hover:shadow-green-400/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-mono"
                            disabled={processing}
                        >
                            {processing ? 'CONECTANDO...' : 'ACCEDER'}
                        </PrimaryButton>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm font-mono">
                            ¿NUEVO?{' '}
                            <Link href={route('register')} className="text-green-400 hover:text-green-300 font-bold transition-colors duration-200">
                                REGISTRARSE
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Iniciar Sesión - Vida Smart" />
            {style === 1 && <Style1 />}
            {style === 2 && <Style2 />}
            {style === 3 && <Style3 />}
            {style === 4 && <Style4 />}
        </>
    );
}
