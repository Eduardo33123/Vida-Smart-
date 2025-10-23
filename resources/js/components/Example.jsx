import React from "react";

const Example = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            ¡Hola desde React!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Tu aplicación Laravel con React está funcionando
                            correctamente.
                        </p>
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            <strong>¡Éxito!</strong> React está integrado con
                            Laravel.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Example;
