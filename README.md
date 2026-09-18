# 🕘 Horario Profesional

Aplicación web **100% offline** para administrar tu jornada de estudio, trabajo y vida social de lunes a domingo. Todo en un solo lugar: cursos, temas, bloques de horario, métricas de progreso y respaldos.

> **Un solo archivo, cero dependencias, cero servidores.** Tus datos viven en tu navegador.

---

## ✨ Características

- 📅 **Vista semanal** — grilla de lunes a domingo con navegación de fechas, prioridades y estados.
- ⏰ **Horario diario** — timeline cronológico diferenciando estudio, descanso, almuerzo y trabajo.
- 📚 **Temas de estudio** — administra cursos y temas con edición in-place.
- 💼 **Temas de trabajo** — catálogo propio de categorías laborales.
- 🫂 **Temas sociales** — categoría independiente con métricas propias.
- 📊 **Dashboard y Progreso** — horas efectivas, avance, sesiones completadas y desglose por categoría.
- 🚫 **Validación de solapamientos** — evita que dos bloques ocupen el mismo horario.
- 🔍 **Búsqueda y filtros** — por tema, categoría, prioridad y estado.
- 💾 **Importar / Exportar JSON** — copias de seguridad y restauración completas.
- 🌙 **Modo oscuro / claro** persistente.
- 🖨️ **Imprimir / PDF** — exporta la vista activa limpiamente.

---

## 🖥️ Cómo usarla (local)

### Opción A — Directo (sin instalar nada)

1. Descarga el repositorio.
2. Abre `index.html` haciendo **doble clic** en tu navegador.

### Opción B — Con un servidor local (recomendado)

Desde la raíz del proyecto:

```bash
# Con Python
python -m http.server 8000

# O con Node.js
npx serve .
```

Luego abre `http://localhost:8000` en tu navegador.

> 💡 **Privacidad:** todos los datos se guardan en `localStorage` de tu navegador. La app funciona 100% offline y nada se envía a servidores externos.

---

## 🛠️ Estructura del proyecto

```
horario-pro/
├── index.html          # Estructura HTML (vistas, modales, navegación)
├── css/
│   └── styles.css      # Todos los estilos y el sistema de diseño
├── js/
│   └── app.js          # Toda la lógica (store, renderizado, eventos)
└── .sdd/               # Papelería SDD (especificación, diseño, tareas)
```

---

## 🤝 Cómo contribuir

¡Gracias por tu interés! Las contribuciones son bienvenidas. Así se hace:

1. **Crea un issue** describiendo el problema o la mejora que quieres proponer.
2. **Haz un fork** del repositorio.
3. **Crea una rama** con un nombre descriptivo:
   ```bash
   git checkout -b fix/titulo-del-cambio
   # o: git checkout -b feat/nueva-funcionalidad
   ```
4. **Haz tus cambios** y confirma que la app sigue funcionando.
5. **Abre un Pull Request** hacia la rama `main` con una descripción clara de qué cambiaste y por qué.

**Guía de commits:** usa [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` para nuevas funcionalidades
- `fix:` para correcciones de errores
- `refactor:` para cambios que no alteran comportamiento
- `docs:` para documentación

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

Desarrollado por **JohnFDev** — *Hecho con 💚 y cero dependencias.*