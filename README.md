# Vida Smart - Sistema de Gestión de Inventario

Vida Smart es una aplicación web desarrollada con Laravel y React para la gestión integral de inventarios, ventas y análisis de productos. Permite a los usuarios administrar productos, realizar ventas, gestionar inventario compartido entre socios y generar reportes detallados de rendimiento.

## 🚀 Características Principales

- **Gestión de Productos**: Administración completa de productos con categorías, versiones y precios
- **Sistema de Ventas**: Registro de ventas con seguimiento de inventario automático
- **Inventario Compartido**: División de productos entre socios con seguimiento individual
- **Análisis y Reportes**: Dashboard con estadísticas detalladas y métricas de rendimiento
- **Gestión de Usuarios**: Sistema de autenticación y roles de usuario
- **Multi-moneda**: Soporte para diferentes monedas en productos y ventas
- **Interfaz Moderna**: Diseño responsive con React e Inertia.js

## 🛠️ Tecnologías Utilizadas

### Backend
- **Laravel ^10.11** - Framework PHP
- **MySQL** - Base de datos
- **Inertia.js** - Conexión entre Laravel y React
- **Laravel Sanctum** - Autenticación API

### Frontend
- **React 18** - Biblioteca de JavaScript
- **Inertia.js** - Framework full-stack
- **Tailwind CSS** - Framework de CSS
- **Vite** - Herramienta de construcción

### Herramientas de Desarrollo
- **Composer** - Gestión de dependencias PHP
- **NPM** - Gestión de dependencias JavaScript
- **Laravel Mix** - Compilación de assets

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [PHP](https://www.php.net/) (v8.1 o superior)
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) (v16 o superior)
- [NPM](https://www.npmjs.com/) (v8 o superior)
- [MySQL](https://www.mysql.com/) (v8.0 o superior)
- [Git](https://git-scm.com/)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Eduardo33123/Vida-Smart-.git
cd vida-smart
```

### 2. Instalar Dependencias PHP

```bash
composer install
```

### 3. Instalar Dependencias JavaScript

```bash
npm install
```

### 4. Configurar Variables de Entorno

Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura las siguientes variables:

```env
APP_NAME="Vida Smart"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vida_smart
DB_USERNAME=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql

# Configuración de sesión
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Configuración de Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:8000
```

### 5. Generar Clave de Aplicación

```bash
php artisan key:generate
```

### 6. Configurar Base de Datos

Crea la base de datos MySQL:

```sql
CREATE DATABASE vida_smart;
```

### 7. Ejecutar Migraciones y Seeders

```bash
php artisan migrate --seed
```

### 8. Compilar Assets

```bash
npm run build
```

### 9. Iniciar el Servidor

```bash
php artisan serve
```

La aplicación estará disponible en `http://localhost:8000`.

## 📁 Estructura del Proyecto

```
vida-smart/
├── app/
│   ├── Http/Controllers/     # Controladores de la aplicación
│   ├── Models/              # Modelos Eloquent
│   ├── Services/            # Lógica de negocio
│   ├── Repositories/        # Repositorios para acceso a datos
│   └── ...
├── database/
│   ├── migrations/          # Migraciones de base de datos
│   └── seeders/            # Seeders para datos iniciales
├── resources/
│   ├── js/
│   │   ├── Pages/          # Páginas de React
│   │   ├── components/     # Componentes reutilizables
│   │   └── Layouts/        # Layouts de la aplicación
│   └── css/               # Estilos CSS
├── routes/
│   ├── web.php            # Rutas web
│   └── api.php            # Rutas API
└── public/               # Archivos públicos
```

## 🎯 Funcionalidades Principales

### Gestión de Productos
- Crear, editar y eliminar productos
- Gestión de categorías y versiones
- Control de stock por versión
- Soporte multi-moneda

### Sistema de Ventas
- Registro de ventas con seguimiento automático
- Reducción automática de stock
- Historial de ventas
- Cálculo de ganancias

### Inventario Compartido
- División de productos entre socios
- Seguimiento individual por usuario
- Filtrado por usuario
- Estadísticas por socio

### Dashboard y Reportes
- Métricas de ventas
- Análisis de productos
- Estadísticas de inventario
- Reportes de rendimiento

## 🔧 Comandos Útiles

### Desarrollo
```bash
# Compilar assets en modo desarrollo
npm run dev

# Compilar assets en modo producción
npm run build

# Limpiar caché de Laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Base de Datos
```bash
# Ejecutar migraciones
php artisan migrate

# Ejecutar seeders
php artisan db:seed

# Refrescar base de datos
php artisan migrate:refresh --seed
```

### Testing
```bash
# Ejecutar tests
php artisan test
```

## 🚀 Despliegue en Producción

### 1. Configurar Variables de Producción

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=tu-host-mysql
DB_DATABASE=tu_base_de_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
```

### 2. Optimizar para Producción

```bash
# Compilar assets
npm run build

# Optimizar autoloader
composer install --optimize-autoloader --no-dev

# Cachear configuración
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Eduardo Cárdenas**
- GitHub: [@Eduardo33123](https://github.com/Eduardo33123)

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda, puedes:

- Abrir un issue en GitHub
- Contactar al desarrollador

---

## 🎉 ¡Gracias por usar Vida Smart!

Este proyecto está en desarrollo activo. ¡Las contribuciones y sugerencias son bienvenidas!