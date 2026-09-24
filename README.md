# ⚽ CanchasDioguinho - Sistema Integral de Reserva y Gestión de Canchas Deportivas

> **Proyecto Académico / Profesional Full-Stack**  
> Plataforma web moderna de reserva de canchas de fútbol con autenticación JWT, panel de administración multi-rol, validación de comprobantes de pago bancarios y panel analítico con métricas en tiempo real.

---

## 🌟 Resumen Ejecutivo del Proyecto

**CanchasDioguinho** es una solución tecnológica integral diseñada para digitalizar y optimizar la administración de complejos deportivos de fútbol 5. 

El sistema resuelve los problemas tradicionales de los centros deportivos:
- ❌ **Conflictos por reservas dobles o solapadas:** Eliminados mediante restricciones lógicas e índices calculados a nivel de base de datos MySQL.
- ❌ **Falta de control en pagos informales:** Solucionado mediante un flujo de solicitud con verificación manual de transferencias bancarias y número de comprobante.
- ❌ **Desconocimiento del rendimiento del negocio:** Mitigado a través de un panel analítico completo con métricas clave (KPIs), gráficos de distribución y mapas de calor de ocupación horaria.

---

## 🛠️ Arquitectura y Stack Tecnológico

| Capa | Tecnologías | Propósito |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 16 (App Router)**, React 19, TypeScript | Renderizado híbrido (SSR/CSR), interfaces reactivas y tipado estricto. |
| **Estilos & UI** | **Tailwind CSS v4**, Radix UI, Framer Motion, Lucide Icons | Diseño responsive, transiciones fluidas y estética deportiva premium. |
| **Backend & APIs** | **Next.js API Routes (Serverless Handlers)** | Controladores REST para reservas, autenticación y analítica. |
| **Autenticación** | **JWT (`jose`)**, Cookies `HttpOnly`, **Bcryptjs** | Seguridad sin dependencias externas pesadas, cifrado de contraseñas con sal y tokens seguros. |
| **Base de Datos** | **MySQL 8.0** con `mysql2/promise` (Connection Pooling) | Integridad referencial, transacciones y alto rendimiento en concurrencia. |
| **Visualización** | **Recharts** | Gráficos interactivos de dona y mapas de calor analíticos. |

---

## 🚀 Módulos y Funcionalidades del Sistema

### 1. 👥 Experiencia del Cliente / Usuario
- **Exploración y Disponibilidad en Vivo:** Calendario interactivo con vista de turnos disponibles de 08:00 a 22:00 en las 10 canchas sintéticas.
- **Selección Múltiple de Horarios:** Permite al cliente seleccionar turnos consecutivos o en diferentes canchas en una sola transacción.
- **Pasarela de Transferencia Bancaria:** Generación del total a transferir ($15 USD/hora), copia rápida de números de cuenta (Banco Pichincha) e ingreso del número de comprobante de depósito/transferencia.
- **Panel "Mis Reservas":** Pestañas divididas en *Próximas Reservas* y *Historial Pasado*, con opción de cancelación inmediata de turnos pendientes.

### 2. 🛡️ Seguridad y Control de Acceso
- **Autenticación Basada en Roles:** Separación estricta entre clientes (`customer`) y administradores (`admin`).
- **Middleware / Proxy de Rutas:** Protección de rutas `/admin/*`, `/booking/*` y `/reservations` contra accesos no autorizados.
- **Tokens Criptográficos:** Sesiones firmadas con algoritmo `HS256` y expiración automática a los 7 días.

### 3. 👨‍💼 Panel de Control del Administrador
- **⏳ Módulo de Verificación de Pagos (`/admin/payments`):**
  - Lista de turnos en estado `pending` (Revisión Pendiente).
  - Visualización del nombre del cliente, correo, cancha, fecha, hora, monto y número de comprobante ingresado.
  - Botones de acción inmediata: **Confirmar Reserva** o **Rechazar / Cancelar**.
- **📅 Panel General de Reservas (`/admin/bookings`):**
  - Cuadrícula interactiva por horas y canchas estilo matriz para ver la ocupación del día (Hoy, Mañana o Fecha personalizada).
  - Permite al operador cambiar el estado de cualquier turno en caliente (`pending`, `confirmed`, `completed`, `cancelled`, `no_show`).
- **📊 Centro de Métricas y Estadísticas (`/admin/stats`):**
  - **KPIs:** Total de registros, usuarios nuevos, tasa de cancelación (%) y tasa de ausencias / no-show (%).
  - **Gráficos de Dona:** Distribución porcentual por estado de reserva y categorías.
  - **Mapa de Calor Semanal:** Matriz de intensidad de ocupación cruzando los 7 días de la semana con las 24 horas del día.

---

## 📐 Diseño de Base de Datos y Lógica de Negocio

El esquema se encuentra definido en [`init.sql`](./init.sql) y cuenta con una arquitectura optimizada:

### Prevención de Doble Reserva (Algoritmo en BD)
```sql
active_slot VARCHAR(60) AS (
    IF(booking_status IN ('pending', 'confirmed'), CONCAT(court_id, '-', booked_date, '-', booked_time), NULL)
) STORED,
UNIQUE KEY uq_active_slot (active_slot)
```
> **¿Por qué es innovador para la exposición?**  
> En lugar de depender de validaciones lentas en el backend susceptibles a condiciones de carrera (*Race Conditions*), la base de datos utiliza una **columna generada y almacenada con un índice único**. Si dos usuarios intentan pagar o apartar la misma cancha a la misma hora, el motor MySQL rechaza atómicamente la segunda inserción. Cuando una reserva pasa a `cancelled`, la columna calculada se vuelve `NULL`, liberando el slot al instante.

---

## 💻 Guía de Instalación y Ejecución Local

### Prerrequisitos
- **Node.js** (v18 o superior)
- **MySQL Server** (Local o en la nube)

### Pasos de Configuración
1. **Clonar e instalar dependencias:**
   ```bash
   git clone <url-del-repositorio>
   cd canchas-dioguinho
   npm install
   ```

2. **Configurar variables de entorno (`.env`):**
   ```env
   DATABASE_HOST=localhost
   DATABASE_USER=root
   DATABASE_PASSWORD=tu_contraseña_mysql
   DATABASE_NAME=dioghinoDB
   DATABASE_PORT=3306
   JWT_SECRET_KEY=tu_clave_secreta_jwt_super_segura_2026
   ```

3. **Inicializar y Resetear Credenciales de Administrador:**
   ```bash
   npm run seed:admin
   ```
   *Credenciales generadas:*
   - **Correo:** `admin@canchas.com`
   - **Contraseña:** `Admin123!`

4. **Iniciar en Modo Desarrollo:**
   ```bash
   npm run dev
   ```
   Accede en tu navegador a: **`http://localhost:3000`**

---

## 🌐 Guía de Despliegue en Producción con Vercel

Dado que Vercel es una plataforma *Serverless* (sin base de datos MySQL local persistente), el despliegue requiere conectar una base de datos MySQL en la nube:

### Paso 1: Base de Datos MySQL en la Nube (Gratuita)
1. Crea una cuenta en [Railway.app](https://railway.app), [Aiven.io](https://aiven.io) o [PlanetScale](https://planetscale.com).
2. Crea un nuevo servicio **MySQL Database**.
3. Abre la consola / Query Editor de tu base de datos remota y ejecuta el contenido completo del archivo [`init.sql`](./init.sql).

### Paso 2: Subir el Código a GitHub
1. Inicializa y sube el proyecto a tu repositorio de GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: proyecto final canchas dioguinho listo para despliegue"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/canchas-dioguinho.git
   git push -u origin main
   ```

### Paso 3: Importar y Desplegar en Vercel
1. Ingresa a [Vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..."** ➔ **"Project"** y selecciona tu repositorio `canchas-dioguinho`.
3. En la sección **Environment Variables**, agrega las variables con los datos de tu MySQL en la nube:
   - `DATABASE_HOST` (Ej: `mysql.railway.internal` o host público provisto)
   - `DATABASE_USER` (Ej: `root`)
   - `DATABASE_PASSWORD` (La contraseña dada por el proveedor)
   - `DATABASE_NAME` (Ej: `railway` o `dioghinoDB`)
   - `DATABASE_PORT` (Ej: `3306` o el puerto asignado)
   - `DATABASE_SSL` = `true` (requerido por la mayoría de servicios cloud)
   - `JWT_SECRET_KEY` = `un_secreto_aleatorio_muy_largo`
4. Presiona **Deploy**. Vercel compilará la aplicación y te entregará tu dominio `.vercel.app` listo para usar en tu exposición.

---

## 🎯 Puntos Clave para Destacar en la Exposición

1. **Arquitectura desacoplada y moderna:** Uso del App Router de Next.js combinando componentes de servidor de alto rendimiento con componentes de cliente interactivos.
2. **Robustez ante fallos humanos y concurrencia:** El uso de índices UNIQUE en columnas virtuales calculadas garantiza que nunca habrá dos personas jugando en la misma cancha al mismo tiempo.
3. **Control total de la sesión:** Autenticación construida desde cero con JSON Web Tokens almacenados en cookies seguras `HttpOnly`, eliminando vulnerabilidades XSS en el almacenamiento local.
4. **Impacto de negocio real:** No es solo una agenda; integra un módulo financiero para validar comprobantes y analítica gerencial para la toma de decisiones.

---

## 📄 Licencia
Este proyecto se distribuye bajo la licencia **MIT**. Consulta el archivo [`LICENSE`](./LICENSE) para más detalles.
