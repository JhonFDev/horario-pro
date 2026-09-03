# Horario de Estudio Profesional — Documento de Diseño de Arquitectura (`sdd-design`)

## 1. Visión General y Restricciones
- **Archivo único:** `index.html` (contiene todo el HTML5 semántico, CSS3 moderno y Vanilla JavaScript ES6+).
- **Cero dependencias:** Sin librerías externas, sin fuentes ni iconos remotos (íconos SVG inline o caracteres Unicode estándar), 100% offline.
- **Persistencia:** `localStorage` bajo la clave versionada `HORARIO_ESTUDIO_V1`.

---

## 2. Arquitectura de Datos y Estado

### 2.1 Esquema de Datos
```typescript
interface TopicCourse {
  id: string;          // UUID v4 o timestamp-slug inmutable (ej: "course-1")
  title: string;       // Nombre del curso/categoría
  topics: string[];    // Arreglo de strings normalizados
}

type BlockType = 'study' | 'break' | 'lunch' | 'work' | 'social';
type BlockPriority = 'high' | 'medium' | 'low';
type BlockStatus = 'pending' | 'in_progress' | 'completed' | 'rescheduled';

interface ScheduleBlock {
  id: string;          // UUID v4 o id inmutable (ej: "block-1")
  topic: string;       // Tema específico
  courseId: string;    // FK inmutable hacia TopicCourse.id
  category: string;    // Copia legible sincronizada de TopicCourse.title
  date: string;        // Formato ISO: "YYYY-MM-DD"
  start: string;       // Formato 24h: "HH:mm" (ej: "08:00")
  end: string;         // Formato 24h: "HH:mm" (ej: "09:30")
  priority: BlockPriority;
  status: BlockStatus;
  type: BlockType;
  notes: string;
}

interface AppState {
  version: number;
  catalog: TopicCourse[];
  workCatalog: TopicCourse[];   // Catálogo de temas de trabajo (v2.0.0)
  socialCatalog: TopicCourse[]; // Catálogo de temas sociales (v5.0.0)
  blocks: ScheduleBlock[];
  theme: 'dark' | 'light';
  activeView: 'dashboard' | 'week' | 'day' | 'courses' | 'progress';
  selectedDate: string; // "YYYY-MM-DD"
  filters: {
    search: string;
    courseId: string;
    priority: string;
    status: string;
  };
}
```

### 2.2 Sincronización y Reglas de Integridad
1. **Renombrado de Cursos:**
   - La función `updateCourse(courseId, newTitle, newTopics)` busca todos los bloques con `b.courseId === courseId` y actualiza `b.category = newTitle`.
2. **Reasignación de Bloque a otro Curso:**
   - Al editar un bloque y cambiar el curso seleccionado, se actualiza `courseId` y `category` en base al curso destino en el catálogo.
3. **Eliminación en Cascada:**
   - Al eliminar un curso (previo diálogo de confirmación que calcula y advierte cuántos bloques están asociados), se eliminan todos los bloques que tengan dicho `courseId`.
   - Se bloquea la eliminación si solo queda 1 curso en el catálogo.
4. **Motor de Migración:**
   - `migrateData(rawState)`: Si detecta la propiedad legada `customTopics`, genera el array `catalog` normalizado, vincula los `blocks` asociando `courseId` a partir del match de `category` o creando cursos de respaldo si no existían. Preserva IDs existentes.

---

## 3. Arquitectura Modular en Vanilla JS

Se estructurará el código en un único espacio de nombres encapsulado (patrón de módulos / Store):

```
┌────────────────────────────────────────────────────────┐
│                      INDEX.HTML                        │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ CSS: Design Tokens, CSS Grid/Flexbox, Dark Mode  │  │
│  │      & @media print                              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ HTML: Semantic Structure (Nav, Views, Modals)    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ JAVASCRIPT:                                      │  │
│  │  ├─ Helpers (qs, qsa, dateUtils, idGen, toast)   │  │
│  │  ├─ Initial Seeds (Cursos y Horario inicial)     │  │
│  │  ├─ Storage & Migration Engine                   │  │
│  │  ├─ Centralized Store (State, Actions, Mutators) │  │
│  │  ├─ View Renderers:                              │  │
│  │  │   ├─ Dashboard View                           │  │
│  │  │   ├─ Weekly Calendar View (Lunes a Domingo)   │  │
│  │  │   ├─ Daily Schedule View (Timeline)           │  │
│  │  │   ├─ Course/Topic Admin View (Cards + Edit)   │  │
│  │  │   └─ Progress & Analytics View                │  │
│  │  ├─ Block Form & Modal Controller                │  │
│  │  ├─ Import/Export & Backup Controller            │  │
│  │  └─ App Initialization & Event Delegations       │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### 3.1 Helpers Libres de Conflicto
- `qs(selector)`: Envuelve `document.querySelector(selector)`.
- `qsa(selector)`: Envuelve `Array.from(document.querySelectorAll(selector))`.
- `showToast(message, type)`: Muestra notificaciones flotantes temporizadas sin usar `alert()`.
- `formatHours(minutes)`: Conversión a formato amigable (ej: "1h 30m").

---

## 4. Diseño de Vistas y Componentes UI

### 4.1 Navegación y Layout
- **Sidebar persistente en Desktop / Barra adaptable en Mobile.**
- **Tema:** Dark mode por defecto o switch persistente en `localStorage`. Paleta basada en variables CSS (`--bg-primary`, `--text-primary`, `--accent-color`, `--card-bg`, etc.).

### 4.2 Vista Semanal (Weekly Grid)
- Cálculo dinámico de la semana actual (lunes a domingo con navegación previa/siguiente/hoy).
- Columnas para cada uno de los 7 días.
- Renderizado de tarjetas de bloques con:
  - Color distintivo de categoría (asignado determinísticamente según `courseId`).
  - Distintivo visual para `priority === 'high'` (borde y badge).
  - Efecto de tachado y opacidad para `status === 'completed'`.
  - Acción rápida de cambio de estado (Toggle Pendiente/Completado) y menú "⋮" para editar.

### 4.3 Horario Diario (Daily Timeline)
- Selector de fecha nativo (`input[type="date"]`).
- Lista cronológica ordenada por hora de inicio (`start`).
- Separación visual y badges para tipos: `study`, `break`, `lunch`, `work`.

### 4.4 Administración de Cursos y Temas (Tarjetas Interactivas)
- **Modo Lectura:** Muestra título, lista de temas (pills o lista limpia) y botón "⋮".
- **Modo Edición In-Place:**
  - Se activa al presionar "⋮" o al hacer clic en "+ Nuevo curso".
  - Mantiene el estado en memoria para que agregar o eliminar temas no cierre la tarjeta ni provoque parpadeos.
  - Valida temas vacíos o duplicados (case-insensitive, trimmed).
  - Botones "Guardar cambios", "Cancelar" y "Eliminar curso".

### 4.5 Panel de Progreso y Métricas
- **Sesiones completadas vs. pendientes:** Filtra únicamente bloques con `type === 'study'`.
- **Porcentaje de avance general.**
- **Horas efectivas estudiadas en la semana:** Suma de `(end - start)` de bloques donde `type === 'study'` y `status === 'completed'`.
- Se excluyen descansos, almuerzos y bloques de trabajo (`work`).

### 4.6 Sistema de Impresión / PDF
- Reglas `@media print`:
  - Oculta sidebar, botones de acción, filtros y modales.
  - Adapta la vista semanal en formato apaisado/legible de alto contraste.
  - Disparado limpiamente con `window.print()`.

---

## 5. Validación y Estrategia de Importación/Exportación
1. **Exportar:** Serializa a JSON `{ version: 1, catalog: [...], blocks: [...] }` y descarga como archivo `.json`.
2. **Importar:**
   - Lee el archivo mediante `FileReader`.
   - Ejecuta validaciones estrictas de esquema (validación de arrays, IDs no vacíos, campos mínimos de bloques).
   - Ejecuta migración si viene en formato legado.
   - Reemplaza el estado atómicamente y notifica vía toast.
