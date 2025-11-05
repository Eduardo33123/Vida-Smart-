import React from "react";
import Layout from "../Components/Layout.jsx";

const Help = () => {
    const faqs = [
        {
            question: "¿Cómo puedo cambiar mi contraseña?",
            answer: "Ve a tu perfil y selecciona 'Cambiar contraseña'. Ingresa tu contraseña actual y la nueva contraseña.",
        },
        {
            question: "¿Cómo contacto al soporte?",
            answer: "Puedes contactarnos a través del email de soporte o usando el formulario de contacto en esta página.",
        },
        {
            question: "¿Cómo funciona el dashboard?",
            answer: "El dashboard te muestra un resumen de tu actividad, estadísticas importantes y notificaciones recientes.",
        },
        {
            question: "¿Puedo personalizar la interfaz?",
            answer: "Sí, puedes cambiar entre modo claro y oscuro, y personalizar algunos elementos en la configuración.",
        },
    ];

    return (
        <Layout>
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">
                        Centro de Ayuda
                    </h1>

                    {/* Preguntas frecuentes */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-6">
                            Preguntas Frecuentes
                        </h2>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border-b border-gray-700 pb-4 last:border-b-0"
                                >
                                    <h3 className="text-lg font-medium text-white mb-2">
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-300">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contacto */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-6">
                            Contacto
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-4">
                                    Información de Contacto
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <span className="text-gray-400 mr-3">
                                            📧
                                        </span>
                                        <span className="text-gray-300">
                                            soporte@vidasmart.com
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-gray-400 mr-3">
                                            📞
                                        </span>
                                        <span className="text-gray-300">
                                            +1 (555) 123-4567
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-gray-400 mr-3">
                                            🕒
                                        </span>
                                        <span className="text-gray-300">
                                            Lunes a Viernes, 9:00 - 18:00
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-white mb-4">
                                    Envíanos un mensaje
                                </h3>
                                <form className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Tu nombre"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Tu email"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <textarea
                                        rows={4}
                                        placeholder="Tu mensaje"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                                    >
                                        Enviar Mensaje
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Help;
