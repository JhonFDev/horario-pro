# Horario de Estudio Profesional — Especificación

Crea una aplicación web local, profesional, completamente funcional y lista para usar llamada:
“Horario de Estudio Profesional”

## ENTREGA OBLIGATORIA
Entrega la aplicación completa en un único archivo llamado:
index.html
El archivo debe incluir internamente:
- Todo el HTML.
- Todo el CSS.
- Todo el JavaScript.
- Los datos iniciales de ejemplo.
- Los comentarios necesarios en español.

La aplicación debe:
- Funcionar sin internet.
- Abrirse haciendo doble clic en index.html.
- No utilizar bases de datos.
- No utilizar servidores.
- No utilizar frameworks.
- No utilizar bibliotecas externas.
- No utilizar CDN.
- No cargar fuentes, iconos, imágenes o recursos externos.
- Guardar todos los datos en localStorage.
- Ser compatible con navegadores modernos de escritorio y dispositivos móviles.

## OBJETIVO
Necesito administrar una jornada de estudio de lunes a domingo, incluidos los días festivos.
Mi horario disponible comienza habitualmente a las 8:00 a. m. y puede terminar a las 8:00 p. m.
Mi trabajo es variable y pueden citarme en cualquier momento para entrevistar profesionales. Por ello, debo poder:
- Mover sesiones.
- Suspender sesiones.
- Reprogramar sesiones.
- Cambiar el estado de las sesiones.
- Mantener toda la información cuando una sesión sea interrumpida.
- Reservar bloques de trabajo que no se contabilicen automáticamente como estudio.

## ARQUITECTURA DE DATOS
Utiliza una estructura de datos consistente y estable.
Cada curso debe tener como mínimo:
- id único e inmutable.
- title.
- topics, como arreglo de textos.

Cada bloque del horario debe tener:
- id único.
- topic.
- courseId.
- category, como copia legible del título del curso.
- date.
- start.
- end.
- priority.
- status.
- type.
- notes.

## REGLA CRÍTICA DE SINCRONIZACIÓN
courseId será la referencia principal e inmutable entre un bloque y un curso.
category será el nombre legible del curso.
Cuando se cambie el título de un curso:
1. No cambies su id.
2. Actualiza su title.
3. Actualiza category en todos los bloques que tengan el mismo courseId.
4. Actualiza los filtros.
5. Actualiza el formulario de bloques.
6. Actualiza la vista semanal y diaria.
7. Guarda inmediatamente el resultado en localStorage.

Cuando se edite un bloque y se cambie su categoría:
1. Localiza el curso correspondiente.
2. Actualiza category.
3. Actualiza courseId.
4. Guarda ambos valores.
5. Evita que una función de migración restaure posteriormente la categoría anterior.

## CATÁLOGO INICIAL DE CURSOS
Crea inicialmente estos cursos:
1. Concurso SIMO número 1
Temas:
- Manual de funciones.
- Competencias funcionales.
- Competencias comportamentales.
- Misión, visión y estructura de la entidad.
- Normativa aplicable.
- Temas específicos del cargo.

2. Concurso SIMO número 2
Temas:
- Manual de funciones.
- Competencias funcionales.
- Competencias comportamentales.
- Misión, visión y estructura de la entidad.
- Normativa aplicable.
- Temas específicos del cargo.

3. MGA del DNP
Temas:
- Metodología General Ajustada — MGA del DNP.

4. Inteligencia artificial generativa
Temas:
- Ecosistema de inteligencia artificial generativa.

5. Otros temas
Este curso puede comenzar sin temas, pero debe poder editarse igual que todos los demás.

## ADMINISTRACIÓN DE CURSOS Y TEMAS
En la sección “Temas de estudio”, muestra cada curso como una tarjeta limpia y bien presentada.

### TEMAS SOCIALES (v5.0.0)
La aplicación incluye una sección dedicada “Temas sociales”, ubicada debajo de “Temas de trabajo”, que replica la arquitectura de administración por tarjetas de los cursos y de los temas de trabajo.

- Cada categoría social es una tarjeta limpia con título, lista de tareas/temas y menú “⋮”.
- El menú “⋮” permite: editar el título, modificar/agregar/eliminar temas, guardar, cancelar y eliminar la categoría social.
- Incluye el botón “+ Nueva categoría social” para crear categorías temporales editables en línea, sin usar prompt()/alert().
- Antes de eliminar una categoría social se solicita confirmación y se advierte de los bloques asociados que también se eliminarán.
- Se evitan temas duplicados (sin distinguir mayúsculas/minúsculas), se ignoran espacios iniciales/finales y no se guardan temas vacíos.

### TIPO DE BLOQUE SOCIAL
Se agrega el tipo de bloque `social` al formulario de bloques, con su selector de categoría en cascada propio:
- El modal de bloques incluye la opción “Temas sociales” junto a Estudio, Trabajo, Descanso y Almuerzo.
- Al elegir “Temas sociales”, el selector de categoría se puebla con el catálogo social.
- Los bloques sociales se diferencian visualmente con su propio color/token y badge de tipo.

Reglas de contabilización:
- Los bloques sociales NO se contabilizan como estudio efectivo.
- Las horas y métricas sociales se reportan de forma independiente en el Dashboard y en la Vista de Progreso (horas sociales, avance, sesiones).
- Siguen la misma regla que los bloques de trabajo: solo se contabilizan sesiones sociales completadas.

### ESTADO NORMAL DE LA TARJETA
Cuando la tarjeta no está en edición, debe mostrar exclusivamente:
- Título del curso.
- Lista de temas.
- Botón de tres puntos “⋮” en la esquina superior derecha.
No muestres permanentemente campos, botones de guardar ni opciones de eliminación.

### MENÚ DE TRES PUNTOS
Al pulsar “⋮”, la tarjeta debe entrar en modo edición.
En modo edición debe permitir:
- Cambiar el título del curso.
- Modificar cada tema.
- Agregar temas.
- Eliminar temas.
- Guardar todos los cambios.
- Cancelar la edición.
- Eliminar el curso completo.

Al guardar:
- Valida el título.
- Valida los temas.
- Actualiza los bloques asociados si cambió el título.
- Guarda en localStorage.
- Cierra el modo edición.
- Vuelve a mostrar una tarjeta normal y presentable.
- Muestra un mensaje de éxito.

Al cancelar:
- Descarta los cambios no guardados.
- Restaura la vista normal de la tarjeta.

### CREAR UN CURSO
Incluye un botón visible:
“+ Nuevo curso”
Al pulsarlo:
1. No dependas de prompt(), alert() o cuadros emergentes para solicitar el título.
2. Crea directamente un curso temporal con id único.
3. Usa un título provisional no duplicado, como “Nuevo curso”.
4. Si ya existe, usa “Nuevo curso 2”, “Nuevo curso 3”, etc.
5. Agrega inicialmente un tema editable llamado “Nuevo tema”.
6. Guarda el curso.
7. Renderiza las tarjetas.
8. Abre automáticamente la tarjeta nueva en modo edición.
9. Lleva el foco al campo de título.
10. Permite modificar y guardar el curso.

### ELIMINAR UN CURSO
El botón “Eliminar curso” debe funcionar.
Antes de eliminar:
- Solicita confirmación.
- Indica el nombre del curso.
- Calcula cuántos bloques están asociados mediante courseId.
- Si tiene bloques asociados, advierte claramente que también se eliminarán esos bloques.
- Permite cancelar.

Si el usuario confirma:
1. Elimina los bloques asociados.
2. Elimina el curso.
3. Actualiza filtros y formularios.
4. Guarda en localStorage.
5. Renderiza nuevamente toda la aplicación.
6. Muestra un mensaje de éxito.

No permitas eliminar el último curso existente.

### AGREGAR, MODIFICAR Y ELIMINAR TEMAS
Dentro del modo edición de una tarjeta:
- Permite agregar nuevos temas.
- Permite editar cada tema.
- Permite eliminar cada tema.
- Evita temas duplicados dentro del mismo curso.
- Ignora espacios al inicio o final.
- Compara duplicados sin distinguir mayúsculas y minúsculas.
- No guardes temas vacíos.
- Mantén abierta la tarjeta en modo edición cuando se agregue o elimine un tema.
- Cierra el modo edición únicamente al guardar o cancelar.

## VISTAS PRINCIPALES
Incluye navegación entre:
1. Panel principal.
2. Vista semanal.
3. Horario diario.
4. Temas de estudio.
5. Progreso.

### VISTA SEMANAL
- La semana comienza el lunes.
- Muestra de lunes a domingo.
- Incluye días festivos si coinciden con la semana.
- Cada columna representa un día.
- Cada bloque muestra:
- Tema.
- Horario.
- Duración.
- Estado.
- Prioridad.
- Categoría mediante color.
- Las sesiones de prioridad alta deben resaltarse claramente.
- Las sesiones completadas deben mostrar una marca visual y texto tachado.
- Debe ser posible revertir una sesión completada a pendiente.
- Incluye una opción visible de edición mediante “⋮”.

### HORARIO DIARIO
- Muestra los bloques del día seleccionado.
- Incluye selector de fecha.
- Ordena cronológicamente.
- Diferencia:
- Estudio.
- Descanso.
- Almuerzo.
- Trabajo o bloque flexible.

## BLOQUES DEL HORARIO
Permite:
- Agregar un bloque.
- Editar un bloque.
- Eliminar un bloque.
- Marcarlo como completado.
- Revertirlo a pendiente.
- Cambiarlo a “En progreso”.
- Marcarlo como reprogramado.
- Cambiar fecha y horas.
- Cambiar de curso.
- Cambiar prioridad.
- Cambiar tipo.
- Modificar notas.

Incluye los campos:
- Tema.
- Curso o categoría.
- Fecha.
- Hora de inicio.
- Hora de finalización.
- Prioridad: alta, media o baja.
- Estado: pendiente, en progreso, completado o reprogramado.
- Tipo: estudio, descanso, almuerzo o flexible/trabajo.
- Notas.

### GUARDADO DE BLOQUES
El botón “Guardar” del formulario debe funcionar tanto para bloques nuevos como existentes.
Al guardar un bloque:
1. Ejecuta preventDefault() sobre el formulario.
2. Comprueba que el tema no esté vacío.
3. Comprueba que la fecha sea válida.
4. Comprueba que la hora final sea posterior a la inicial.
5. Comprueba que la categoría seleccionada corresponda a un curso existente.
6. Actualiza category y courseId.
7. Evita duplicados accidentales.
8. Si el bloque existe, reemplázalo conservando su id.
9. Si es nuevo, agrégalo con un id único.
10. Guarda en localStorage.
11. Cierra el formulario.
12. Renderiza todas las vistas.
13. Muestra un mensaje de éxito.

Debe funcionar, por ejemplo, al cambiar el estado de “Pendiente” a “Completado”.
Incluye también una forma rápida de alternar entre completado y pendiente, pero sin impedir la edición normal.

## DISTRIBUCIÓN INICIAL DEL HORARIO
Crea datos iniciales editables para lunes a domingo con esta estructura:
- 8:00 a. m. a 9:30 a. m.: estudio profundo de SIMO.
- 9:30 a. m. a 9:45 a. m.: descanso.
- 9:45 a. m. a 11:15 a. m.: segundo tema prioritario de SIMO.
- 11:15 a. m. a 11:30 a. m.: descanso.
- 11:30 a. m. a 1:00 p. m.: normativa, misión, visión o estructura.
- 1:00 p. m. a 2:00 p. m.: almuerzo.
- 2:00 p. m. a 3:30 p. m.: MGA del DNP.
- 3:30 p. m. a 3:45 p. m.: descanso.
- 3:45 p. m. a 5:15 p. m.: bloque flexible para entrevistas, trabajo o reprogramación.
- 5:15 p. m. a 6:45 p. m.: inteligencia artificial generativa u otro tema.
- 6:45 p. m. a 7:00 p. m.: descanso.
- 7:00 p. m. a 8:00 p. m.: repaso, preguntas y evaluación.

El bloque flexible:
- Debe tener type igual a work.
- No debe contabilizarse automáticamente como estudio.
- Solo se contabiliza si el usuario cambia su tipo a study.

No programes automáticamente 12 horas de estudio efectivo. Diferencia claramente entre:
- Tiempo disponible.
- Estudio efectivo.
- Descansos.
- Almuerzo.
- Trabajo.

## BÚSQUEDA Y FILTROS
Incluye:
- Buscador por tema, categoría y notas.
- Filtro por curso o categoría.
- Filtro por prioridad.
- Filtro por estado.

Cuando se cree, cambie o elimine un curso, actualiza inmediatamente los filtros.

## PANEL DE PROGRESO
Muestra:
- Número de sesiones completadas.
- Número de sesiones pendientes.
- Porcentaje general de avance.
- Horas estudiadas durante la semana.

Reglas:
- Cuenta únicamente bloques cuyo type sea study.
- Las horas estudiadas deben contar únicamente sesiones completadas.
- No cuentes descansos, almuerzo ni bloques de trabajo.
- Actualiza las métricas inmediatamente tras guardar o cambiar un estado.

## LOCALSTORAGE
Guarda automáticamente:
- Bloques.
- Cursos.
- Temas.
- Estados.
- Modo oscuro.
- Cambios de nombres.
- Nuevos cursos.
- Eliminaciones.

Utiliza una única clave versionada y estable.
Incluye una función de migración que acepte datos anteriores con:
- blocks.
- customTopics.
Y los convierta al nuevo formato con:
- blocks.
- catalog.

La migración:
- No debe ejecutarse destructivamente en cada renderizado.
- No debe reasignar una categoría válida.
- Debe conservar los ids existentes.
- Debe agregar courseId solo cuando falte.
- Debe relacionar inicialmente por category, pero después usar courseId.

## IMPORTAR Y EXPORTAR JSON
Permite exportar una copia completa con:
- blocks.
- catalog.

Permite importar:
1. El formato nuevo con blocks y catalog.
2. El formato anterior con blocks y customTopics.

Antes de aceptar una importación, valida:
- Que blocks sea un arreglo.
- Que catalog, si existe, sea un arreglo.
- Que cada curso tenga id, title y topics.
- Que los títulos no estén vacíos.
- Que topics sea un arreglo.
- Que los bloques tengan estructura mínima válida.
- Que no existan ids de cursos duplicados.
- Que las referencias courseId puedan resolverse o migrarse.

Si la importación es válida:
- Migra si es necesario.
- Guarda.
- Actualiza categorías y filtros.
- Renderiza todas las vistas.
- Muestra un mensaje de éxito.

Si no es válida:
- No sustituyas los datos actuales.
- Muestra un mensaje claro de error.

## RESTABLECER HORARIO
Incluye un botón para restablecer los datos.
- Solicita confirmación.
- Regenera cursos y bloques iniciales.
- Migra la estructura al formato actual.
- Actualiza formularios y filtros.
- Guarda en localStorage.
- Renderiza toda la aplicación.

## DISEÑO
Utiliza una apariencia:
- Seria.
- Moderna.
- Profesional.
- Limpia.
- Sobria.
- Adaptable a computador, tableta y celular.

Incluye:
- Navegación lateral en escritorio.
- Navegación adaptable en pantallas pequeñas.
- Tarjetas.
- Etiquetas de estado.
- Barra de progreso.
- Colores diferenciados por categoría.
- Modo oscuro persistente.
- Separación visual clara.
- Tipografía del sistema.
- Sin adornos innecesarios.

## IMPRESIÓN
Incluye un botón:
“Imprimir / PDF”
Debe usar window.print() y una hoja de estilos @media print que:
- Oculte navegación y controles.
- Muestre la vista semanal.
- Use tamaños legibles.
- Permita guardar como PDF desde el navegador.

## MENSAJES Y CONFIRMACIONES
Muestra mensajes claros cuando:
- Se crea un curso.
- Se modifica un curso.
- Se elimina un curso.
- Se agrega o elimina un tema.
- Se guarda un bloque.
- Se cambia un estado.
- Se importa un respaldo.
- Se exporta un respaldo.
- Se produce un error.

No uses alert() para mensajes ordinarios. Usa notificaciones visuales tipo toast.
Puedes usar confirm() únicamente para operaciones destructivas.

## REGLAS DE IMPLEMENTACIÓN
No declares dos funciones o constantes con el mismo nombre.
Utiliza ayudantes sin conflicto, por ejemplo:
- qs(selector): devuelve un elemento con querySelector.
- qsa(selector): devuelve un arreglo con todos los resultados de querySelectorAll.
No uses el mismo identificador para qs y qsa.
Utiliza siempre:
- qs() para un único elemento.
- qsa() para colecciones que utilicen forEach(), map(), filter() u otras operaciones de arreglo.
No ejecutes .forEach() ni .map() sobre el resultado de querySelector().
Evita:
- Declaraciones duplicadas.
- Selectores de elementos inexistentes.
- Event listeners duplicados.
- Renderizados recursivos accidentales.
- Pérdida del modo edición al agregar o eliminar un tema.
- Dependencia innecesaria de setTimeout().
- Mutaciones destructivas durante simples renderizados.
- Cerrar el formulario antes de verificar que guardar tuvo éxito.
