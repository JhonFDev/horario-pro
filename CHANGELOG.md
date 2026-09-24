# Changelog — Horario Profesional

Todas las versiones notables de este proyecto se documentan en este archivo.

## [v5.2.2] — 2026-09-23

### Corrección

- **Acceso a configuración en modo responsive (≤900px)**: Se agrega botón de Configuración duplicado en el header principal que aparece solo en pantallas móviles/tablets.
  - El botón original en el sidebar-footer se mantiene funcional en desktop (>900px).
  - En móvil, el botón del sidebar se oculta y aparece uno nuevo en la esquina superior derecha del header.
  - El dropdown se abre hacia abajo y alineado a la derecha desde el header.
  - En pantallas muy pequeñas (<520px) se muestra solo el icono ⚙️ para ahorrar espacio.
  - Todas las opciones (Imprimir/PDF, Importar/Exportar, Restablecer, Borrar todo) accesibles en ambos breakpoints.

## [v5.2.1] — 2026-09-19

### Nueva característica

- **Auto-colapso de secciones de métricas con 0 pendientes**: Al cargar el Dashboard, las secciones "Métricas de Estudio", "Métricas de Trabajo" y "Métricas de Temas Sociales" se colapsan automáticamente cuando sus contadores de sesiones pendientes muestran "0 pendientes".
  - Se verifica `dash-today-pending` (Sesiones Estudio Hoy), `dash-work-today-pending` (Sesiones Trabajo Hoy) y `dash-social-today-pending` (Sesiones Sociales Hoy).
  - El usuario puede expandir manualmente las secciones colapsadas haciendo clic en el título.
  - No afecta otras vistas, solo el Dashboard.

## [v5.2.0] — 2026-09-17

### Nueva característica

- **Marca de completado para categorías y filtrado de activos en Dashboard**: Se agrega propiedad `completed` a cursos, trabajos y sociales.
  - Checkbox "Marcar como completado" en el formulario de edición de cada categoría.
  - Los contadores de Cursos Activos, Trabajos Activos y Temas Sociales Activos en el Dashboard muestran solo ítems con `completed === false`.
  - Persistencia en localStorage con normalización para datos antiguos.
  - Indicador visual de opacidad en tarjetas completadas.

## [v5.1.2] — 2026-09-17

### Corrección

- **Altura independiente de categorías en vistas de catálogo**: Se corrige el estiramiento conjunto de tarjetas en las vistas de Temas de Estudio, Trabajo y Social. Ahora cada categoría mantiene su altura según su propio contenido gracias a `align-items: start` y `grid-auto-rows: min-content` en `.courses-grid`.

## [v5.1.1] — 2026-09-16

### Corrección

- **Colapso de secciones de métricas**: Las flechas de colapso ahora están en el encabezado de cada sección (`📚 Métricas de Estudio`, `💼 Métricas de Trabajo`, `🤝 Métricas de Temas Sociales`) y colapsan las 4 cards de esa sección de forma independiente. Corrige el comportamiento introducido en v5.1.0 donde las flechas estaban dentro de cada card individual.

## [v5.1.0] — 2025-09-15

### Nueva característica

- **Dropdown de Configuración en el sidebar**: Se reemplazan los 4 botones individuales del pie del sidebar (Imprimir/PDF, Importar/Exportar, Restablecer horario, Borrar todo) por un único botón ⚙️ **Configuración** con un menú desplegable animado hacia arriba. Esto reduce el espacio vertical ocupado y mejora la experiencia visual manteniendo intacta toda la funcionalidad original.

  - Botón toggle con ícono de engrane y flecha que rota 180° al abrir/cerrar
  - Dropdown con animación suave (fade + translateY)
  - Cierre automático al hacer clic fuera del menú
  - Estilos consistentes con el sistema de diseño actual (claro/oscuro)

### Cambios técnicos

- `index.html`: Reemplazo de 4 botones por wrapper con dropdown
- `css/styles.css`: Nuevos estilos `.settings-wrapper`, `.settings-dropdown`, `.settings-item`
- `js/app.js`: Lógica de toggle y cierre al hacer clic fuera

## [v5.0.0] — 2025-09-03

### Nueva característica

- **Temas Sociales**: Se agrega una nueva categoría independiente para actividades personales, familiares y sociales, con sus propias métricas de progreso en el Dashboard y Vista de Progreso.
  - Catálogo separado `INITIAL_SOCIAL_CATALOG` con categorías predeterminadas (Familia, Amistades)
  - Tipo `social` en el selector de bloques del formulario
  - Métricas sociales en Dashboard y Vista de Progreso
  - Tablas de desglose detallado en la vista de progreso

## [v4.0.0] — 2025-09-01

### Mejoras

- **Validación de solapamientos de horarios**: Se implementa detección automática de conflictos al crear/editar bloques, impidiendo que dos actividades ocupen el mismo intervalo horario en la misma fecha.
- **Botón "Eliminar bloque" en el modal de edición**: Visible solo en modo edición, con confirmación previa.
- **Navegación por doble clic**: En la vista semanal, un doble clic en un día lleva al horario diario de ese día.
- **Impresión/PDF mejorada**: Imprime la vista activa en lugar de forzar siempre la vista semanal.
- **Botón Modo Claro/Oscuro reubicado**: Ahora está en el encabezado superior.
- **Botón Imprimir/PDF reubicado**: Ahora está en el pie del sidebar.

## [v3.1.0] — 2025-08-31

### Mejoras

- Refinamiento de la UI del sidebar (desduplicación y reubicación de badges al pie).
- Traducción de prioridades de bloques a español.
- Corrección de orientación de tooltips hacia abajo.

## [v3.0.0] — 2025-08-30

### Nueva característica

- Integración de catálogo y métricas de trabajo en Dashboard/Progreso.
- Filtros contextuales.
- Purga segura de datos (borrado total con confirmación por palabra clave).

## [v2.0.0] — 2025-08-20

### Nueva característica

- Motor de persistencia en `localStorage` con esquema v2 y migración automática de versiones anteriores.
- Importación/Exportación JSON con validación estricta.

## [v1.0.0] — 2025-08-15

### Lanzamiento inicial

- Aplicación web 100% offline para administrar horarios de estudio, trabajo y vida social.
- Vista semanal (grilla lunes-domingo) y vista diaria (timeline cronológico).
- Catálogo de cursos con temas de estudio.
- Dashboard con métricas de progreso.
- Modo oscuro/claro persistente.
- Impresión/PDF.