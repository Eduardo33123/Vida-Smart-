# Arquitectura SOLID - Vida Smart

## 📋 Principios SOLID Implementados

### 1. **S - Single Responsibility Principle (SRP)**

-   **ProductController**: Solo maneja las peticiones HTTP y respuestas
-   **ProductService**: Solo contiene la lógica de negocio
-   **ProductRepository**: Solo maneja el acceso a datos

### 2. **O - Open/Closed Principle (OCP)**

-   Las interfaces permiten extender funcionalidad sin modificar código existente
-   Nuevos repositorios pueden implementar `ProductRepositoryInterface`

### 3. **L - Liskov Substitution Principle (LSP)**

-   Cualquier implementación de `ProductRepositoryInterface` puede sustituir a `ProductRepository`
-   Cualquier implementación de `ProductServiceInterface` puede sustituir a `ProductService`

### 4. **I - Interface Segregation Principle (ISP)**

-   Interfaces específicas y cohesivas
-   `ProductRepositoryInterface` solo contiene métodos relacionados con productos
-   `ProductServiceInterface` solo contiene lógica de negocio de productos

### 5. **D - Dependency Inversion Principle (DIP)**

-   Controlador depende de `ProductServiceInterface` (abstracción)
-   Servicio depende de `ProductRepositoryInterface` (abstracción)
-   Implementaciones concretas se inyectan via Service Provider

## 🏗️ Estructura de Capas

```
┌─────────────────────────────────────┐
│           PRESENTATION LAYER        │
│  ┌─────────────────────────────────┐│
│  │     ProductController           ││
│  │  - index()                      ││
│  │  - show()                       ││
│  │  - store()                      ││
│  │  - update()                     ││
│  │  - destroy()                    ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│           BUSINESS LAYER            │
│  ┌─────────────────────────────────┐│
│  │     ProductService              ││
│  │  - createProduct()              ││
│  │  - updateProduct()              ││
│  │  - deleteProduct()              ││
│  │  - validateProductData()        ││
│  │  - getInventoryStatistics()     ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│            DATA LAYER               │
│  ┌─────────────────────────────────┐│
│  │     ProductRepository           ││
│  │  - getAll()                     ││
│  │  - findById()                   ││
│  │  - create()                     ││
│  │  - update()                     ││
│  │  - delete()                     ││
│  │  - findBySku()                  ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│           DATABASE LAYER            │
│  ┌─────────────────────────────────┐│
│  │     Product Model               ││
│  │  - Eloquent ORM                 ││
│  │  - Mass Assignment              ││
│  │  - Accessors/Mutators           ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## 🔧 Inyección de Dependencias

### Service Provider Configuration

```php
// app/Providers/AppServiceProvider.php
public function register(): void
{
    // Repository bindings
    $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);

    // Service bindings
    $this->app->bind(ProductServiceInterface::class, ProductService::class);
}
```

### Constructor Injection

```php
// ProductController
public function __construct(ProductServiceInterface $productService)
{
    $this->productService = $productService;
}

// ProductService
public function __construct(ProductRepositoryInterface $productRepository)
{
    $this->productRepository = $productRepository;
}
```

## 📁 Estructura de Archivos

```
app/
├── Http/
│   └── Controllers/
│       └── ProductController.php
├── Services/
│   ├── Contracts/
│   │   └── ProductServiceInterface.php
│   └── ProductService.php
├── Repositories/
│   ├── Contracts/
│   │   └── ProductRepositoryInterface.php
│   └── ProductRepository.php
├── Models/
│   └── Product.php
└── Providers/
    └── AppServiceProvider.php
```

## 🚀 Beneficios de esta Arquitectura

### 1. **Mantenibilidad**

-   Código organizado en capas claras
-   Responsabilidades bien definidas
-   Fácil de entender y modificar

### 2. **Testabilidad**

-   Interfaces permiten mocking fácil
-   Cada capa puede ser probada independientemente
-   Inyección de dependencias facilita testing

### 3. **Escalabilidad**

-   Fácil agregar nuevas funcionalidades
-   Nuevas implementaciones sin romper código existente
-   Separación clara de responsabilidades

### 4. **Reutilización**

-   Servicios pueden ser reutilizados en diferentes controladores
-   Repositorios pueden ser compartidos entre servicios
-   Lógica de negocio centralizada

### 5. **Flexibilidad**

-   Cambiar implementaciones sin afectar otras capas
-   Fácil migración a diferentes bases de datos
-   Configuración centralizada de dependencias

## 🔄 Flujo de Datos

1. **Request** → ProductController
2. **Controller** → ProductService (lógica de negocio)
3. **Service** → ProductRepository (acceso a datos)
4. **Repository** → Product Model (Eloquent)
5. **Model** → Database
6. **Response** ← Controller ← Service ← Repository ← Model

## 📝 Ejemplo de Uso

```php
// En el controlador
public function store(Request $request): RedirectResponse
{
    try {
        $product = $this->productService->createProduct($request->all());
        return redirect()->route('inventario')
                       ->with('success', 'Producto creado exitosamente');
    } catch (ValidationException $e) {
        return back()->withErrors($e->errors())->withInput();
    }
}
```

Esta arquitectura garantiza código limpio, mantenible y escalable siguiendo los principios SOLID.
