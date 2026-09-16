    'use strict';

    /* ==========================================================================
       1. CONSTANTES Y CONFIGURACIÓN
       ========================================================================== */
    const STORAGE_KEY = 'HORARIO_ESTUDIO_APP_V1';
    const THEME_KEY = 'HORARIO_ESTUDIO_THEME';

    const CATEGORY_COLORS = [
      { bg: 'var(--cat-color-0)', label: '#3b82f6' },
      { bg: 'var(--cat-color-1)', label: '#8b5cf6' },
      { bg: 'var(--cat-color-2)', label: '#10b981' },
      { bg: 'var(--cat-color-3)', label: '#f59e0b' },
      { bg: 'var(--cat-color-4)', label: '#ec4899' },
      { bg: 'var(--cat-color-5)', label: '#06b6d4' },
      { bg: 'var(--cat-color-6)', label: '#6366f1' }
    ];

    /* Catálogo inicial estricto de Estudio */
    const INITIAL_CATALOG = [
      {
        id: 'course-simo-1',
        title: 'Concurso SIMO número 1',
        topics: [
          'Manual de funciones.',
          'Competencias funcionales.',
          'Competencias comportamentales.',
          'Misión, visión y estructura de la entidad.',
          'Normativa aplicable.',
          'Temas específicos del cargo.'
        ]
      },
      {
        id: 'course-simo-2',
        title: 'Concurso SIMO número 2',
        topics: [
          'Manual de funciones.',
          'Competencias funcionales.',
          'Competencias comportamentales.',
          'Misión, visión y estructura de la entidad.',
          'Normativa aplicable.',
          'Temas específicos del cargo.'
        ]
      },
      {
        id: 'course-mga-dnp',
        title: 'MGA del DNP',
        topics: [
          'Metodología General Ajustada — MGA del DNP.'
        ]
      },
      {
        id: 'course-ai-gen',
        title: 'Inteligencia artificial generativa',
        topics: [
          'Ecosistema de inteligencia artificial generativa.'
        ]
      },
      {
        id: 'course-otros',
        title: 'Otros temas de estudio',
        topics: []
      }
    ];

    /* Catálogo inicial de Temas de Trabajo */
    const INITIAL_WORK_CATALOG = [
      {
        id: 'work-proy-1',
        title: 'Proyectos y Desarrollo',
        topics: [
          'Análisis y levantamiento de requerimientos.',
          'Diseño de arquitectura y prototipado.',
          'Implementación de módulos y funciones.',
          'Revisión de código y pruebas técnicas.'
        ]
      },
      {
        id: 'work-ops-1',
        title: 'Gestión y Operaciones',
        topics: [
          'Reuniones de sincronización con el equipo.',
          'Atención de incidencias y soporte.',
          'Planificación semanal y seguimiento de entregables.'
        ]
      }
    ];

    /* Catálogo inicial de Temas Sociales */
    const INITIAL_SOCIAL_CATALOG = [
      {
        id: 'social-fam-1',
        title: 'Familia y Vida Personal',
        topics: [
          'Tiempo de calidad con la familia.',
          'Trámites y gestiones personales.',
          'Cuidado personal y descanso activo.'
        ]
      },
      {
        id: 'social-am-1',
        title: 'Amistades y Vida Social',
        topics: [
          'Reuniones y encuentros con amigos.',
          'Salidas y actividades recreativas.',
          'Celebraciones y fechas especiales.'
        ]
      }
    ];

    /* ==========================================================================
       2. HELPERS DEL DOM Y UTILIDADES
       ========================================================================== */
    const qs = (selector) => document.querySelector(selector);
    const qsa = (selector) => Array.from(document.querySelectorAll(selector));

    const generateId = (prefix = 'id') => {
      return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 6)}`;
    };

    const showToast = (message, type = 'success') => {
      const container = qs('#toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
      toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 3000);
    };

    const getCourseColor = (courseId) => {
      if (!courseId) return CATEGORY_COLORS[0];
      let hash = 0;
      for (let i = 0; i < courseId.length; i++) {
        hash = courseId.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % CATEGORY_COLORS.length;
      return CATEGORY_COLORS[index];
    };

    /* Formato de fechas YYYY-MM-DD */
    const toISODate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const getMonday = (d) => {
      const date = new Date(d);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(date.setDate(diff));
    };

    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const formatMinutesToHours = (mins) => {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      if (hours === 0) return `${remainingMins}m`;
      if (remainingMins === 0) return `${hours}h`;
      return `${hours}h ${remainingMins}m`;
    };

    /* Generación de datos iniciales para la semana actual */
    const generateInitialBlocks = (catalog, workCatalog) => {
      const blocks = [];
      const monday = getMonday(new Date());
      const simo1 = catalog.find(c => c.id === 'course-simo-1') || catalog[0] || { id: 'c1', title: 'Estudio' };
      const simo2 = catalog.find(c => c.id === 'course-simo-2') || catalog[1] || simo1;
      const mga = catalog.find(c => c.id === 'course-mga-dnp') || catalog[2] || simo1;
      const ai = catalog.find(c => c.id === 'course-ai-gen') || catalog[3] || simo1;
      const workDev = (workCatalog && workCatalog[0]) ? workCatalog[0] : { id: 'w1', title: 'Trabajo' };

      const dailyTemplate = [
        { start: '08:00', end: '09:30', topic: 'Manual de funciones.', courseId: simo1.id, category: simo1.title, type: 'study', priority: 'high', notes: 'Estudio profundo de SIMO' },
        { start: '09:30', end: '09:45', topic: 'Descanso matutino', courseId: 'activity-break', category: 'Descanso', type: 'break', priority: 'low', notes: 'Pausa activa e hidratación' },
        { start: '09:45', end: '11:15', topic: 'Competencias funcionales.', courseId: simo2.id, category: simo2.title, type: 'study', priority: 'high', notes: 'Segundo tema prioritario SIMO' },
        { start: '11:15', end: '11:30', topic: 'Descanso', courseId: 'activity-break', category: 'Descanso', type: 'break', priority: 'low', notes: 'Descanso breve' },
        { start: '11:30', end: '13:00', topic: 'Normativa aplicable.', courseId: simo1.id, category: simo1.title, type: 'study', priority: 'medium', notes: 'Normativa, misión, visión y estructura' },
        { start: '13:00', end: '14:00', topic: 'Almuerzo', courseId: 'activity-lunch', category: 'Almuerzo', type: 'lunch', priority: 'low', notes: 'Almuerzo y desconexión' },
        { start: '14:00', end: '15:30', topic: 'Metodología General Ajustada — MGA del DNP.', courseId: mga.id, category: mga.title, type: 'study', priority: 'high', notes: 'Metodología MGA' },
        { start: '15:30', end: '15:45', topic: 'Descanso vespertino', courseId: 'activity-break', category: 'Descanso', type: 'break', priority: 'low', notes: 'Pausa breve' },
        { start: '15:45', end: '17:15', topic: 'Análisis y levantamiento de requerimientos.', courseId: workDev.id, category: workDev.title, type: 'work', priority: 'medium', notes: 'Avance en proyectos de trabajo' },
        { start: '17:15', end: '18:45', topic: 'Ecosistema de inteligencia artificial generativa.', courseId: ai.id, category: ai.title, type: 'study', priority: 'medium', notes: 'IA Generativa aplicada' },
        { start: '18:45', end: '19:00', topic: 'Descanso', courseId: 'activity-break', category: 'Descanso', type: 'break', priority: 'low', notes: 'Descanso' },
        { start: '19:00', end: '20:00', topic: 'Temas específicos del cargo.', courseId: simo1.id, category: simo1.title, type: 'study', priority: 'high', notes: 'Repaso, preguntas y evaluación' }
      ];

      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = toISODate(addDays(monday, dayOffset));
        dailyTemplate.forEach((tmpl, idx) => {
          blocks.push({
            id: generateId(`block-d${dayOffset}-${idx}`),
            topic: tmpl.topic,
            courseId: tmpl.courseId,
            category: tmpl.category,
            date: currentDate,
            start: tmpl.start,
            end: tmpl.end,
            priority: tmpl.priority,
            status: 'pending',
            type: tmpl.type,
            notes: tmpl.notes
          });
        });
      }

      return blocks;
    };

    /* ==========================================================================
       3. MOTOR DE ESTADO, MIGRACIÓN Y PERSISTENCIA
       ========================================================================== */
    class Store {
      constructor() {
        this.catalog = [];
        this.workCatalog = [];
        this.socialCatalog = [];
        this.blocks = [];
        this.activeView = 'dashboard';
        this.currentWeekStart = getMonday(new Date());
        this.selectedDay = toISODate(new Date());
        this.filters = {
          search: '',
          courseId: '',
          priority: '',
          status: ''
        };
        this.editingCourseId = null;
        this.tempCourseState = null;
        this.editingWorkId = null;
        this.tempWorkState = null;
        this.editingSocialId = null;
        this.tempSocialState = null;
        this.init();
      }

      init() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            this.migrateAndLoad(parsed);
          } catch (e) {
            console.error('Error al parsear localStorage:', e);
            this.loadDefaults();
          }
        } else {
          this.loadDefaults();
        }
      }

      loadDefaults() {
        this.catalog = JSON.parse(JSON.stringify(INITIAL_CATALOG));
        this.workCatalog = JSON.parse(JSON.stringify(INITIAL_WORK_CATALOG));
        this.socialCatalog = JSON.parse(JSON.stringify(INITIAL_SOCIAL_CATALOG));
        this.blocks = generateInitialBlocks(this.catalog, this.workCatalog);
        this.save();
      }

      purgeAll() {
        this.catalog = [];
        this.workCatalog = [];
        this.socialCatalog = [];
        this.blocks = [];
        this.editingCourseId = null;
        this.tempCourseState = null;
        this.editingWorkId = null;
        this.tempWorkState = null;
        this.editingSocialId = null;
        this.tempSocialState = null;
        this.save();
        showToast('Se han eliminado todos los datos. Horario en blanco.', 'info');
      }

      migrateAndLoad(data) {
        if (!data || typeof data !== 'object') {
          this.loadDefaults();
          return;
        }

        // Migración de catálogo de estudio
        if (Array.isArray(data.catalog)) {
          this.catalog = data.catalog;
        } else if (data.customTopics && typeof data.customTopics === 'object') {
          this.catalog = Object.keys(data.customTopics).map((key, i) => ({
            id: `course-migrated-${i}`,
            title: key,
            topics: Array.isArray(data.customTopics[key]) ? data.customTopics[key] : []
          }));
        } else {
          this.catalog = JSON.parse(JSON.stringify(INITIAL_CATALOG));
        }

        // Migración de catálogo de trabajo
        if (Array.isArray(data.workCatalog)) {
          this.workCatalog = data.workCatalog;
        } else {
          this.workCatalog = JSON.parse(JSON.stringify(INITIAL_WORK_CATALOG));
        }

        // Migración de catálogo de temas sociales
        if (Array.isArray(data.socialCatalog)) {
          this.socialCatalog = data.socialCatalog;
        } else {
          this.socialCatalog = JSON.parse(JSON.stringify(INITIAL_SOCIAL_CATALOG));
        }

        // Migración de bloques
        if (Array.isArray(data.blocks)) {
          this.blocks = data.blocks.map(b => {
            let matchedCategory = null;
            let finalType = b.type || 'study';

            if (finalType === 'study') {
              matchedCategory = this.catalog.find(c => c.id === b.courseId) ||
                                this.catalog.find(c => b.category && c.title.trim().toLowerCase() === b.category.trim().toLowerCase());
            } else if (finalType === 'work') {
              matchedCategory = this.workCatalog.find(w => w.id === b.courseId) ||
                                this.workCatalog.find(w => b.category && w.title.trim().toLowerCase() === b.category.trim().toLowerCase());
            } else if (finalType === 'social') {
              matchedCategory = this.socialCatalog.find(s => s.id === b.courseId) ||
                                this.socialCatalog.find(s => b.category && s.title.trim().toLowerCase() === b.category.trim().toLowerCase());
            }

            let categoryName = b.category || (matchedCategory ? matchedCategory.title : (finalType === 'break' ? 'Descanso' : (finalType === 'lunch' ? 'Almuerzo' : 'General')));
            let courseId = matchedCategory ? matchedCategory.id : (b.courseId || finalType);

            return {
              id: b.id || generateId('block'),
              topic: b.topic || 'Actividad',
              courseId: courseId,
              category: categoryName,
              date: b.date || toISODate(new Date()),
              start: b.start || '08:00',
              end: b.end || '09:00',
              priority: b.priority || 'medium',
              status: b.status || 'pending',
              type: finalType,
              notes: b.notes || ''
            };
          });
        } else {
          this.blocks = generateInitialBlocks(this.catalog, this.workCatalog);
        }

        this.save();
      }

      save() {
        const payload = {
          version: 2,
          catalog: this.catalog,
          workCatalog: this.workCatalog,
          socialCatalog: this.socialCatalog,
          blocks: this.blocks
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }

      /* Mutaciones de Cursos de Estudio */
      addCourse() {
        let baseTitle = 'Nuevo curso';
        let title = baseTitle;
        let counter = 2;
        while (this.catalog.some(c => c.title.trim().toLowerCase() === title.trim().toLowerCase())) {
          title = `${baseTitle} ${counter}`;
          counter++;
        }

        const newCourse = {
          id: generateId('course'),
          title: title,
          topics: ['Nuevo tema de estudio']
        };

        this.catalog.push(newCourse);
        this.save();
        this.editingCourseId = newCourse.id;
        this.tempCourseState = JSON.parse(JSON.stringify(newCourse));
        return newCourse;
      }

      saveCourseEdit(courseId, newTitle, newTopics) {
        const trimmedTitle = newTitle.trim();
        if (!trimmedTitle) {
          showToast('El título del curso no puede estar vacío.', 'error');
          return false;
        }

        const course = this.catalog.find(c => c.id === courseId);
        if (!course) return false;

        const cleanTopics = [];
        for (const t of newTopics) {
          const clean = t.trim();
          if (clean) {
            const exists = cleanTopics.some(item => item.toLowerCase() === clean.toLowerCase());
            if (!exists) cleanTopics.push(clean);
          }
        }

        const oldTitle = course.title;
        course.title = trimmedTitle;
        course.topics = cleanTopics;

        if (oldTitle !== trimmedTitle) {
          this.blocks.forEach(b => {
            if (b.courseId === courseId) {
              b.category = trimmedTitle;
            }
          });
        }

        this.save();
        this.editingCourseId = null;
        this.tempCourseState = null;
        showToast('Curso guardado correctamente.');
        return true;
      }

      deleteCourse(courseId) {
        const course = this.catalog.find(c => c.id === courseId);
        if (!course) return false;

        this.blocks = this.blocks.filter(b => b.courseId !== courseId);
        this.catalog = this.catalog.filter(c => c.id !== courseId);

        this.save();
        this.editingCourseId = null;
        this.tempCourseState = null;
        showToast('Curso y bloques asociados eliminados.');
        return true;
      }

      /* Mutaciones de Categorías de Trabajo */
      addWorkCategory() {
        let baseTitle = 'Nueva categoría de trabajo';
        let title = baseTitle;
        let counter = 2;
        while (this.workCatalog.some(w => w.title.trim().toLowerCase() === title.trim().toLowerCase())) {
          title = `${baseTitle} ${counter}`;
          counter++;
        }

        const newWork = {
          id: generateId('work'),
          title: title,
          topics: ['Nueva tarea / actividad']
        };

        this.workCatalog.push(newWork);
        this.save();
        this.editingWorkId = newWork.id;
        this.tempWorkState = JSON.parse(JSON.stringify(newWork));
        return newWork;
      }

      saveWorkCategoryEdit(workId, newTitle, newTopics) {
        const trimmedTitle = newTitle.trim();
        if (!trimmedTitle) {
          showToast('El título de la categoría no puede estar vacío.', 'error');
          return false;
        }

        const workCat = this.workCatalog.find(w => w.id === workId);
        if (!workCat) return false;

        const cleanTopics = [];
        for (const t of newTopics) {
          const clean = t.trim();
          if (clean) {
            const exists = cleanTopics.some(item => item.toLowerCase() === clean.toLowerCase());
            if (!exists) cleanTopics.push(clean);
          }
        }

        const oldTitle = workCat.title;
        workCat.title = trimmedTitle;
        workCat.topics = cleanTopics;

        if (oldTitle !== trimmedTitle) {
          this.blocks.forEach(b => {
            if (b.courseId === workId) {
              b.category = trimmedTitle;
            }
          });
        }

        this.save();
        this.editingWorkId = null;
        this.tempWorkState = null;
        showToast('Categoría de trabajo guardada correctamente.');
        return true;
      }

      deleteWorkCategory(workId) {
        const workCat = this.workCatalog.find(w => w.id === workId);
        if (!workCat) return false;

        this.blocks = this.blocks.filter(b => b.courseId !== workId);
        this.workCatalog = this.workCatalog.filter(w => w.id !== workId);

        this.save();
        this.editingWorkId = null;
        this.tempWorkState = null;
        showToast('Categoría de trabajo y bloques asociados eliminados.');
        return true;
      }

      /* Mutaciones de Categorías Sociales */
      addSocialCategory() {
        let baseTitle = 'Nueva categoría social';
        let title = baseTitle;
        let counter = 2;
        while (this.socialCatalog.some(s => s.title.trim().toLowerCase() === title.trim().toLowerCase())) {
          title = `${baseTitle} ${counter}`;
          counter++;
        }

        const newSocial = {
          id: generateId('social'),
          title: title,
          topics: ['Nueva actividad']
        };

        this.socialCatalog.push(newSocial);
        this.save();
        this.editingSocialId = newSocial.id;
        this.tempSocialState = JSON.parse(JSON.stringify(newSocial));
        return newSocial;
      }

      saveSocialCategoryEdit(socialId, newTitle, newTopics) {
        const trimmedTitle = newTitle.trim();
        if (!trimmedTitle) {
          showToast('El título de la categoría no puede estar vacío.', 'error');
          return false;
        }

        const socialCat = this.socialCatalog.find(s => s.id === socialId);
        if (!socialCat) return false;

        const cleanTopics = [];
        for (const t of newTopics) {
          const clean = t.trim();
          if (clean) {
            const exists = cleanTopics.some(item => item.toLowerCase() === clean.toLowerCase());
            if (!exists) cleanTopics.push(clean);
          }
        }

        const oldTitle = socialCat.title;
        socialCat.title = trimmedTitle;
        socialCat.topics = cleanTopics;

        if (oldTitle !== trimmedTitle) {
          this.blocks.forEach(b => {
            if (b.courseId === socialId) {
              b.category = trimmedTitle;
            }
          });
        }

        this.save();
        this.editingSocialId = null;
        this.tempSocialState = null;
        showToast('Categoría social guardada correctamente.');
        return true;
      }

      deleteSocialCategory(socialId) {
        const socialCat = this.socialCatalog.find(s => s.id === socialId);
        if (!socialCat) return false;

        this.blocks = this.blocks.filter(b => b.courseId !== socialId);
        this.socialCatalog = this.socialCatalog.filter(s => s.id !== socialId);

        this.save();
        this.editingSocialId = null;
        this.tempSocialState = null;
        showToast('Categoría social y bloques asociados eliminados.');
        return true;
      }

      /* Mutaciones de Bloques */
      saveBlock(blockData) {
        let categoryTitle = 'Actividad';
        let courseId = blockData.courseId || '';

        if (blockData.type === 'study') {
          const matched = this.catalog.find(c => c.id === blockData.courseId);
          if (matched) {
            categoryTitle = matched.title;
            courseId = matched.id;
          } else {
            categoryTitle = 'Temas de Estudio';
          }
        } else if (blockData.type === 'work') {
          const matched = this.workCatalog.find(w => w.id === blockData.courseId);
          if (matched) {
            categoryTitle = matched.title;
            courseId = matched.id;
          } else {
            categoryTitle = 'Trabajo';
          }
        } else if (blockData.type === 'social') {
          const matched = this.socialCatalog.find(s => s.id === blockData.courseId);
          if (matched) {
            categoryTitle = matched.title;
            courseId = matched.id;
          } else {
            categoryTitle = 'Temas Sociales';
          }
        } else if (blockData.type === 'break') {
          categoryTitle = 'Descanso';
          courseId = 'activity-break';
        } else if (blockData.type === 'lunch') {
          categoryTitle = 'Almuerzo';
          courseId = 'activity-lunch';
        }

        const cleanBlock = {
          id: blockData.id || generateId('block'),
          topic: blockData.topic.trim(),
          courseId: courseId,
          category: categoryTitle,
          date: blockData.date,
          start: blockData.start,
          end: blockData.end,
          priority: blockData.priority || 'medium',
          status: blockData.status || 'pending',
          type: blockData.type || 'study',
          notes: (blockData.notes || '').trim()
        };

        const newStart = timeToMinutes(cleanBlock.start);
        const newEnd = timeToMinutes(cleanBlock.end);

        // Validar conflicto de horario / solapamiento con otros bloques en la misma fecha
        const conflict = this.blocks.find(b => {
          if (b.id === cleanBlock.id) return false;
          if (b.date !== cleanBlock.date) return false;
          const bStart = timeToMinutes(b.start);
          const bEnd = timeToMinutes(b.end);
          return (newStart < bEnd && newEnd > bStart);
        });

        if (conflict) {
          showToast(`⚠️ Horario ocupado: Ya existe la actividad "${conflict.topic}" (${conflict.start} - ${conflict.end}) programada para ese intervalo.`, 'error');
          return false;
        }

        const existingIndex = this.blocks.findIndex(b => b.id === cleanBlock.id);
        if (existingIndex >= 0) {
          this.blocks[existingIndex] = cleanBlock;
        } else {
          this.blocks.push(cleanBlock);
        }

        this.save();
        showToast('Bloque guardado exitosamente.');
        return true;
      }

      deleteBlock(blockId) {
        this.blocks = this.blocks.filter(b => b.id !== blockId);
        this.save();
        showToast('Bloque eliminado.');
      }

      toggleBlockStatus(blockId) {
        const block = this.blocks.find(b => b.id === blockId);
        if (!block) return;
        block.status = block.status === 'completed' ? 'pending' : 'completed';
        this.save();
        showToast(`Sesión marcada como ${block.status === 'completed' ? 'completada' : 'pendiente'}.`);
      }

      /* Consultas y Filtros */
      getFilteredBlocks() {
        return this.blocks.filter(b => {
          if (this.filters.courseId && b.courseId !== this.filters.courseId) return false;
          if (this.filters.priority && b.priority !== this.filters.priority) return false;
          if (this.filters.status && b.status !== this.filters.status) return false;
          if (this.filters.search) {
            const query = this.filters.search.toLowerCase();
            const inTopic = b.topic.toLowerCase().includes(query);
            const inCat = b.category.toLowerCase().includes(query);
            const inNotes = (b.notes || '').toLowerCase().includes(query);
            if (!inTopic && !inCat && !inNotes) return false;
          }
          return true;
        });
      }
    }

    const appStore = new Store();

    /* ==========================================================================
       4. CONTROLADOR DE MODALES Y FORMULARIO EN CASCADA
       ========================================================================== */
    let confirmCallback = null;

    const openConfirm = (title, message, onConfirm) => {
      qs('#confirm-modal-title').textContent = title;
      qs('#confirm-modal-message').textContent = message;
      confirmCallback = onConfirm;
      qs('#confirm-modal').classList.add('active');
    };

    const closeConfirm = () => {
      qs('#confirm-modal').classList.remove('active');
      confirmCallback = null;
    };

    qs('#btn-confirm-ok').addEventListener('click', () => {
      if (typeof confirmCallback === 'function') {
        confirmCallback();
      }
      closeConfirm();
    });

    qs('#btn-confirm-cancel').addEventListener('click', closeConfirm);
    qs('#btn-close-confirm').addEventListener('click', closeConfirm);

    /* Modal de Borrado Total (Purga) */
    const openPurgeModal = () => {
      const modal = qs('#purge-modal');
      const input = qs('#purge-input-confirm');
      const btn = qs('#btn-confirm-purge-action');
      input.value = '';
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      modal.classList.add('active');
      input.focus();
    };

    const closePurgeModal = () => {
      qs('#purge-modal').classList.remove('active');
    };

    qs('#btn-purge-open').addEventListener('click', openPurgeModal);
    qs('#btn-close-purge').addEventListener('click', closePurgeModal);
    qs('#btn-cancel-purge').addEventListener('click', closePurgeModal);

    qs('#purge-input-confirm').addEventListener('input', (e) => {
      const isValid = e.target.value.trim().toUpperCase() === 'BORRAR';
      const btn = qs('#btn-confirm-purge-action');
      btn.disabled = !isValid;
      btn.style.opacity = isValid ? '1' : '0.5';
      btn.style.cursor = isValid ? 'pointer' : 'not-allowed';
    });

    qs('#btn-confirm-purge-action').addEventListener('click', () => {
      appStore.purgeAll();
      closePurgeModal();
      renderAll();
    });

    /* Lógica en Cascada para el Modal de Bloque */
    const syncBlockModalCascades = (selectedCourseId = null, initialTopic = '') => {
      const scope = qs('#block-scope').value;
      const groupCat = qs('#group-block-category');
      const labelCat = qs('#label-block-category');
      const selectCat = qs('#block-category-select');
      const groupTopic = qs('#group-block-topic');
      const selectTopic = qs('#block-topic-select');
      const inputCustom = qs('#block-topic-custom');

      if (scope === 'break') {
        groupCat.style.display = 'none';
        groupTopic.style.display = 'block';
        selectTopic.style.display = 'none';
        qs('#label-block-topic').style.display = 'none';
        inputCustom.value = initialTopic || 'Descanso';
        return;
      } else if (scope === 'lunch') {
        groupCat.style.display = 'none';
        groupTopic.style.display = 'block';
        selectTopic.style.display = 'none';
        qs('#label-block-topic').style.display = 'none';
        inputCustom.value = initialTopic || 'Almuerzo';
        return;
      }

      // Estudio, Trabajo o Social
      groupCat.style.display = 'flex';
      groupTopic.style.display = 'flex';
      selectTopic.style.display = 'block';
      qs('#label-block-topic').style.display = 'block';

      let items = [];
      if (scope === 'study') {
        labelCat.textContent = 'Curso de estudio *';
        items = appStore.catalog;
      } else if (scope === 'work') {
        labelCat.textContent = 'Proyecto / Categoría de trabajo *';
        items = appStore.workCatalog;
      } else if (scope === 'social') {
        labelCat.textContent = 'Categoría social *';
        items = appStore.socialCatalog;
      }

      if (items.length === 0) {
        selectCat.innerHTML = `<option value="">(Sin categorías creadas)</option>`;
        selectTopic.innerHTML = `<option value="__custom__">Escribir tema personalizado...</option>`;
        if (!initialTopic) inputCustom.value = '';
        return;
      }

      selectCat.innerHTML = items.map(item => `
        <option value="${item.id}" ${item.id === selectedCourseId ? 'selected' : ''}>${item.title}</option>
      `).join('');

      const activeCatId = selectCat.value;
      updateTopicDropdown(scope, activeCatId, initialTopic);
    };

    const updateTopicDropdown = (scope, categoryId, initialTopic = '') => {
      const selectTopic = qs('#block-topic-select');
      const inputCustom = qs('#block-topic-custom');
      let items = appStore.catalog;
      if (scope === 'work') {
        items = appStore.workCatalog;
      } else if (scope === 'social') {
        items = appStore.socialCatalog;
      }
      const currentItem = items.find(i => i.id === categoryId);

      const topics = currentItem ? currentItem.topics : [];
      let optionsHTML = '';

      if (topics.length > 0) {
        optionsHTML += topics.map(t => `<option value="${t}">${t}</option>`).join('');
      }
      optionsHTML += `<option value="__custom__">✏️ Otro tema personalizado...</option>`;
      selectTopic.innerHTML = optionsHTML;

      if (initialTopic && topics.includes(initialTopic)) {
        selectTopic.value = initialTopic;
        inputCustom.value = initialTopic;
      } else if (initialTopic) {
        selectTopic.value = '__custom__';
        inputCustom.value = initialTopic;
      } else {
        if (topics.length > 0) {
          selectTopic.value = topics[0];
          inputCustom.value = topics[0];
        } else {
          selectTopic.value = '__custom__';
          inputCustom.value = '';
        }
      }
    };

    qs('#block-scope').addEventListener('change', () => {
      syncBlockModalCascades();
    });

    qs('#block-category-select').addEventListener('change', (e) => {
      const scope = qs('#block-scope').value;
      updateTopicDropdown(scope, e.target.value);
    });

    qs('#block-topic-select').addEventListener('change', (e) => {
      const inputCustom = qs('#block-topic-custom');
      if (e.target.value === '__custom__') {
        inputCustom.value = '';
        inputCustom.focus();
      } else {
        inputCustom.value = e.target.value;
      }
    });

    /* Modal de Bloque */
    const openBlockModal = (block = null) => {
      const modal = qs('#block-modal');
      const form = qs('#block-form');
      const titleEl = qs('#block-modal-title');
      const deleteBtn = qs('#btn-delete-block-modal');

      if (block) {
        titleEl.textContent = 'Editar Bloque de Horario';
        if (deleteBtn) deleteBtn.style.display = 'inline-flex';
        qs('#block-id').value = block.id;
        qs('#block-scope').value = block.type || 'study';
        qs('#block-date').value = block.date;
        qs('#block-start').value = block.start;
        qs('#block-end').value = block.end;
        qs('#block-priority').value = block.priority || 'medium';
        qs('#block-status').value = block.status || 'pending';
        qs('#block-notes').value = block.notes || '';
        syncBlockModalCascades(block.courseId, block.topic);
      } else {
        titleEl.textContent = 'Nuevo Bloque de Horario';
        if (deleteBtn) deleteBtn.style.display = 'none';
        form.reset();
        qs('#block-id').value = '';
        qs('#block-scope').value = 'study';
        qs('#block-date').value = appStore.selectedDay || toISODate(new Date());
        qs('#block-start').value = '08:00';
        qs('#block-end').value = '09:30';
        qs('#block-priority').value = 'medium';
        qs('#block-status').value = 'pending';
        qs('#block-notes').value = '';
        syncBlockModalCascades();
      }

      modal.classList.add('active');
    };

    const closeBlockModal = () => {
      qs('#block-modal').classList.remove('active');
    };

    qs('#btn-close-block-modal').addEventListener('click', closeBlockModal);
    qs('#btn-cancel-block').addEventListener('click', closeBlockModal);
    qs('#btn-add-block').addEventListener('click', () => openBlockModal());

    qs('#btn-delete-block-modal').addEventListener('click', () => {
      const blockId = qs('#block-id').value;
      if (!blockId) return;
      openConfirm('Eliminar bloque', '¿Estás seguro de que deseas eliminar este bloque de horario?', () => {
        appStore.deleteBlock(blockId);
        closeBlockModal();
        renderAll();
      });
    });

    qs('#block-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const topic = qs('#block-topic-custom').value.trim();
      const date = qs('#block-date').value;
      const start = qs('#block-start').value;
      const end = qs('#block-end').value;
      const scope = qs('#block-scope').value;

      if (!topic) {
        showToast('El tema no puede estar vacío.', 'error');
        return;
      }
      if (!date) {
        showToast('Debes seleccionar una fecha válida.', 'error');
        return;
      }
      if (timeToMinutes(end) <= timeToMinutes(start)) {
        showToast('La hora de finalización debe ser posterior a la de inicio.', 'error');
        return;
      }

      const blockData = {
        id: qs('#block-id').value || null,
        courseId: qs('#block-category-select').value || null,
        topic: topic,
        date: date,
        type: scope,
        start: start,
        end: end,
        priority: qs('#block-priority').value,
        status: qs('#block-status').value,
        notes: qs('#block-notes').value
      };

      if (appStore.saveBlock(blockData)) {
        closeBlockModal();
        renderAll();
      }
    });

    /* ==========================================================================
       5. RENDERIZADORES DE VISTAS
       ========================================================================== */
    const renderFilters = () => {
      const selectCourse = qs('#filter-course');
      const currentVal = appStore.filters.courseId;
      
      let html = '<option value="">Todos los cursos y temas</option>';
      if (appStore.catalog.length > 0) {
        html += `<optgroup label="📚 Temas de Estudio">`;
        html += appStore.catalog.map(c => `<option value="${c.id}" ${c.id === currentVal ? 'selected' : ''}>${c.title}</option>`).join('');
        html += `</optgroup>`;
      }
      if (appStore.workCatalog.length > 0) {
        html += `<optgroup label="💼 Temas de Trabajo">`;
        html += appStore.workCatalog.map(w => `<option value="${w.id}" ${w.id === currentVal ? 'selected' : ''}>${w.title}</option>`).join('');
        html += `</optgroup>`;
      }
      if (appStore.socialCatalog.length > 0) {
        html += `<optgroup label="🤝 Temas Sociales">`;
        html += appStore.socialCatalog.map(s => `<option value="${s.id}" ${s.id === currentVal ? 'selected' : ''}>${s.title}</option>`).join('');
        html += `</optgroup>`;
      }

      selectCourse.innerHTML = html;
    };

    /* Render Dashboard */
    const renderDashboard = () => {
      // Métricas de Estudio
      const studyBlocks = appStore.blocks.filter(b => b.type === 'study');
      const completedStudy = studyBlocks.filter(b => b.status === 'completed');
      const totalStudy = studyBlocks.length;
      const progressPercent = totalStudy > 0 ? Math.round((completedStudy.length / totalStudy) * 100) : 0;

      const currentMonday = appStore.currentWeekStart;
      const currentSunday = addDays(currentMonday, 6);
      const startStr = toISODate(currentMonday);
      const endStr = toISODate(currentSunday);

      let weekStudyMinutes = 0;
      let weekWorkMinutes = 0;
      let weekSocialMinutes = 0;

      appStore.blocks.forEach(b => {
        if (b.status === 'completed' && b.date >= startStr && b.date <= endStr) {
          const dur = timeToMinutes(b.end) - timeToMinutes(b.start);
          if (b.type === 'study') weekStudyMinutes += dur;
          else if (b.type === 'work') weekWorkMinutes += dur;
          else if (b.type === 'social') weekSocialMinutes += dur;
        }
      });

      qs('#dash-hours-val').textContent = `${(weekStudyMinutes / 60).toFixed(1)} h`;
      qs('#dash-progress-val').textContent = `${progressPercent}%`;
      qs('#dash-progress-desc').textContent = `${completedStudy.length} de ${totalStudy} sesiones completadas`;
      qs('#dash-courses-val').textContent = appStore.catalog.length;

      // Métricas de Trabajo
      const workBlocks = appStore.blocks.filter(b => b.type === 'work');
      const completedWork = workBlocks.filter(b => b.status === 'completed');
      const totalWork = workBlocks.length;
      const workProgressPercent = totalWork > 0 ? Math.round((completedWork.length / totalWork) * 100) : 0;

      const todayStr = toISODate(new Date());
      const todayStudyBlocks = studyBlocks.filter(b => b.date === todayStr);
      const todayStudyPending = todayStudyBlocks.filter(b => b.status !== 'completed').length;
      qs('#dash-today-val').textContent = todayStudyBlocks.length;
      qs('#dash-today-pending').textContent = `${todayStudyPending} pendientes`;

      const todayWorkBlocks = workBlocks.filter(b => b.date === todayStr);
      const todayWorkPending = todayWorkBlocks.filter(b => b.status !== 'completed').length;

      qs('#dash-work-hours-val').textContent = `${(weekWorkMinutes / 60).toFixed(1)} h`;
      qs('#dash-work-progress-val').textContent = `${workProgressPercent}%`;
      qs('#dash-work-progress-desc').textContent = `${completedWork.length} de ${totalWork} sesiones completadas`;
      qs('#dash-work-today-val').textContent = todayWorkBlocks.length;
      qs('#dash-work-today-pending').textContent = `${todayWorkPending} pendientes`;
      qs('#dash-work-val').textContent = appStore.workCatalog.length;

      // Métricas de Temas Sociales
      const socialBlocks = appStore.blocks.filter(b => b.type === 'social');
      const completedSocial = socialBlocks.filter(b => b.status === 'completed');
      const totalSocial = socialBlocks.length;
      const socialProgressPercent = totalSocial > 0 ? Math.round((completedSocial.length / totalSocial) * 100) : 0;

      const todaySocialBlocks = socialBlocks.filter(b => b.date === todayStr);
      const todaySocialPending = todaySocialBlocks.filter(b => b.status !== 'completed').length;

      qs('#dash-social-hours-val').textContent = `${(weekSocialMinutes / 60).toFixed(1)} h`;
      qs('#dash-social-progress-val').textContent = `${socialProgressPercent}%`;
      qs('#dash-social-progress-desc').textContent = `${completedSocial.length} de ${totalSocial} sesiones completadas`;
      qs('#dash-social-today-val').textContent = todaySocialBlocks.length;
      qs('#dash-social-today-pending').textContent = `${todaySocialPending} pendientes`;
      qs('#dash-social-val').textContent = appStore.socialCatalog.length;

      // Sesiones Programadas para Hoy
      const todayBlocks = appStore.blocks.filter(b => b.date === todayStr);
      const todayContainer = qs('#dash-today-list');
      if (todayBlocks.length === 0) {
        todayContainer.innerHTML = '<p style="color: var(--text-muted); font-style: italic; padding: 1rem 0;">No hay bloques programados para hoy.</p>';
      } else {
        const sorted = [...todayBlocks].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
        todayContainer.innerHTML = sorted.map(b => renderTimelineItemHTML(b)).join('');
      }

      // Distribución de Cursos
      const breakdownContainer = qs('#dash-courses-breakdown');
      if (appStore.catalog.length === 0) {
        breakdownContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; font-style: italic;">Sin cursos registrados.</p>';
      } else {
        breakdownContainer.innerHTML = appStore.catalog.map(c => {
          const cBlocks = appStore.blocks.filter(b => b.courseId === c.id && b.type === 'study');
          const cComp = cBlocks.filter(b => b.status === 'completed').length;
          const pct = cBlocks.length > 0 ? Math.round((cComp / cBlocks.length) * 100) : 0;
          const color = getCourseColor(c.id);

          return `
            <div style="margin-bottom: 0.85rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.2rem;">
                <span style="font-weight: 600;">${c.title}</span>
                <span style="color: var(--text-muted);">${cComp}/${cBlocks.length} (${pct}%)</span>
              </div>
              <div class="progress-bar-wrap" style="height: 6px; margin: 0;">
                <div class="progress-bar-fill" style="width: ${pct}%; background: ${color.bg};"></div>
              </div>
            </div>
          `;
        }).join('');
      }

      // Distribución de Trabajos
      const workBreakdownContainer = qs('#dash-work-breakdown');
      if (appStore.workCatalog.length === 0) {
        workBreakdownContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; font-style: italic;">Sin categorías de trabajo registradas.</p>';
      } else {
        workBreakdownContainer.innerHTML = appStore.workCatalog.map(w => {
          const wBlocks = appStore.blocks.filter(b => b.courseId === w.id && b.type === 'work');
          const wComp = wBlocks.filter(b => b.status === 'completed').length;
          const pct = wBlocks.length > 0 ? Math.round((wComp / wBlocks.length) * 100) : 0;
          const color = getCourseColor(w.id);

          return `
            <div style="margin-bottom: 0.85rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.2rem;">
                <span style="font-weight: 600;">${w.title}</span>
                <span style="color: var(--text-muted);">${wComp}/${wBlocks.length} (${pct}%)</span>
              </div>
              <div class="progress-bar-wrap" style="height: 6px; margin: 0;">
                <div class="progress-bar-fill" style="width: ${pct}%; background: ${color.bg};"></div>
              </div>
            </div>
          `;
        }).join('');
      }

      // Distribución de Temas Sociales
      const socialBreakdownContainer = qs('#dash-social-breakdown');
      if (appStore.socialCatalog.length === 0) {
        socialBreakdownContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; font-style: italic;">Sin categorías sociales registradas.</p>';
      } else {
        socialBreakdownContainer.innerHTML = appStore.socialCatalog.map(s => {
          const sBlocks = appStore.blocks.filter(b => b.courseId === s.id && b.type === 'social');
          const sComp = sBlocks.filter(b => b.status === 'completed').length;
          const pct = sBlocks.length > 0 ? Math.round((sComp / sBlocks.length) * 100) : 0;
          const color = getCourseColor(s.id);

          return `
            <div style="margin-bottom: 0.85rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.2rem;">
                <span style="font-weight: 600;">${s.title}</span>
                <span style="color: var(--text-muted);">${sComp}/${sBlocks.length} (${pct}%)</span>
              </div>
              <div class="progress-bar-wrap" style="height: 6px; margin: 0;">
                <div class="progress-bar-fill" style="width: ${pct}%; background: ${color.bg};"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    };

    /* Render Vista Semanal */
    const renderWeekView = () => {
      const monday = appStore.currentWeekStart;
      const sunday = addDays(monday, 6);
      const todayStr = toISODate(new Date());

      const startMonth = monday.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      const endMonth = sunday.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' });
      qs('#week-range-text').textContent = `Semana: ${startMonth} - ${endMonth}`;

      const filteredBlocks = appStore.getFilteredBlocks();
      const grid = qs('#week-grid-container');
      grid.innerHTML = '';

      const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

      for (let i = 0; i < 7; i++) {
        const currentDay = addDays(monday, i);
        const dayIso = toISODate(currentDay);
        const isToday = dayIso === todayStr;

        const dayCol = document.createElement('div');
        dayCol.className = `day-column ${isToday ? 'is-today' : ''}`;
        dayCol.dataset.date = dayIso;
        dayCol.title = 'Doble clic para ver el horario diario de este día';

        const dayBlocks = filteredBlocks
          .filter(b => b.date === dayIso)
          .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

        dayCol.innerHTML = `
          <div class="day-header" style="cursor: pointer;" title="Doble clic para ir al horario diario de este día">
            <div class="day-name">${dayNames[i]}</div>
            <div class="day-date">${currentDay.getDate()} ${currentDay.toLocaleDateString('es-ES', { month: 'short' })}</div>
          </div>
          <div class="day-blocks">
            ${dayBlocks.map(b => renderScheduleCardHTML(b)).join('')}
          </div>
        `;

        dayCol.addEventListener('dblclick', (e) => {
          if (e.target.closest('.card-actions') || e.target.closest('button') || e.target.closest('.btn-quick-check') || e.target.closest('.btn-icon')) {
            return;
          }
          appStore.selectedDay = dayIso;
          switchView('day');
        });

        grid.appendChild(dayCol);
      }
    };

    /* Render Vista Diaria */
    const renderDayView = () => {
      const dateInput = qs('#day-picker-input');
      dateInput.value = appStore.selectedDay;

      const container = qs('#day-timeline-container');
      const dayBlocks = appStore.getFilteredBlocks()
        .filter(b => b.date === appStore.selectedDay)
        .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

      if (dayBlocks.length === 0) {
        container.innerHTML = '<div class="card-panel" style="text-align: center; color: var(--text-muted); padding: 2rem;">No hay actividades registradas para este día.</div>';
        return;
      }

      container.innerHTML = dayBlocks.map(b => renderTimelineItemHTML(b)).join('');
    };

    /* Render Catálogo de Cursos */
    const renderCoursesView = () => {
      const container = qs('#courses-grid-container');
      if (appStore.catalog.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">No hay cursos de estudio registrados. Pulsa "+ Nuevo curso" para comenzar.</div>';
        return;
      }

      container.innerHTML = appStore.catalog.map(course => {
        const isEditing = appStore.editingCourseId === course.id;
        const color = getCourseColor(course.id);
        const courseBlocks = appStore.blocks.filter(b => b.courseId === course.id);

        if (isEditing && appStore.tempCourseState) {
          const temp = appStore.tempCourseState;
          return `
            <div class="course-card is-editing" data-course-id="${course.id}" style="border-top: 4px solid ${color.bg};">
              <div class="edit-course-form">
                <div class="form-group">
                  <label>Título del curso:</label>
                  <input type="text" id="edit-course-title" value="${temp.title}" required autofocus>
                </div>

                <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Temas de estudio:</label>
                <div id="edit-topics-container" style="display: flex; flex-direction: column; gap: 0.4rem;">
                  ${temp.topics.map((t, idx) => `
                    <div class="edit-topic-row">
                      <input type="text" class="edit-topic-input" data-index="${idx}" value="${t}" placeholder="Nombre del tema...">
                      <button type="button" class="btn-icon btn-remove-topic" data-index="${idx}" title="Eliminar tema" style="color: var(--danger);">✕</button>
                    </div>
                  `).join('')}
                </div>

                <button type="button" class="btn-outline" id="btn-add-topic-row" style="margin-top: 0.3rem;">+ Agregar tema</button>

                <div class="edit-actions-bar">
                  <button type="button" class="btn-danger" id="btn-delete-course-action">Eliminar curso</button>
                  <div style="display: flex; gap: 0.4rem;">
                    <button type="button" class="btn-outline" id="btn-cancel-course-edit">Cancelar</button>
                    <button type="button" class="btn-primary" id="btn-save-course-edit">Guardar</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }

        return `
          <div class="course-card" data-course-id="${course.id}" style="border-top: 4px solid ${color.bg};">
            <div class="course-card-header">
              <h3 class="course-card-title">${course.title}</h3>
              <button class="btn-icon btn-edit-course" data-course-id="${course.id}" title="Editar curso">⋮</button>
            </div>
            ${course.topics.length > 0 ? `
              <ul class="course-topics-list">
                ${course.topics.map(t => `
                  <li class="topic-item">
                    <span class="topic-bullet" style="background-color: ${color.bg};"></span>
                    <span>${t}</span>
                  </li>
                `).join('')}
              </ul>
            ` : `
              <div class="course-card-empty-topics">Sin temas registrados todavía. Pulsa ⋮ para agregar temas.</div>
            `}
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: auto; padding-top: 0.5rem; border-top: 1px dashed var(--border-color); display: flex; justify-content: space-between;">
              <span>${course.topics.length} temas</span>
              <span>${courseBlocks.length} sesiones asociadas</span>
            </div>
          </div>
        `;
      }).join('');

      if (appStore.editingCourseId) {
        const titleInput = qs('#edit-course-title');
        if (titleInput) titleInput.focus();
      }
    };

    /* Render Catálogo de Temas de Trabajo */
    const renderWorkView = () => {
      const container = qs('#work-grid-container');
      if (appStore.workCatalog.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">No hay categorías de trabajo registradas. Pulsa "+ Nueva categoría de trabajo" para comenzar.</div>';
        return;
      }

      container.innerHTML = appStore.workCatalog.map(work => {
        const isEditing = appStore.editingWorkId === work.id;
        const color = getCourseColor(work.id);
        const workBlocks = appStore.blocks.filter(b => b.courseId === work.id);

        if (isEditing && appStore.tempWorkState) {
          const temp = appStore.tempWorkState;
          return `
            <div class="course-card is-editing" data-work-id="${work.id}" style="border-top: 4px solid ${color.bg};">
              <div class="edit-course-form">
                <div class="form-group">
                  <label>Título de la categoría de trabajo:</label>
                  <input type="text" id="edit-work-title" value="${temp.title}" required autofocus>
                </div>

                <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Tareas y temas de trabajo:</label>
                <div id="edit-work-topics-container" style="display: flex; flex-direction: column; gap: 0.4rem;">
                  ${temp.topics.map((t, idx) => `
                    <div class="edit-topic-row">
                      <input type="text" class="edit-work-topic-input" data-index="${idx}" value="${t}" placeholder="Nombre de la tarea...">
                      <button type="button" class="btn-icon btn-remove-work-topic" data-index="${idx}" title="Eliminar tarea" style="color: var(--danger);">✕</button>
                    </div>
                  `).join('')}
                </div>

                <button type="button" class="btn-outline" id="btn-add-work-topic-row" style="margin-top: 0.3rem;">+ Agregar tarea / tema</button>

                <div class="edit-actions-bar">
                  <button type="button" class="btn-danger" id="btn-delete-work-action">Eliminar categoría</button>
                  <div style="display: flex; gap: 0.4rem;">
                    <button type="button" class="btn-outline" id="btn-cancel-work-edit">Cancelar</button>
                    <button type="button" class="btn-primary" id="btn-save-work-edit">Guardar</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }

        return `
          <div class="course-card" data-work-id="${work.id}" style="border-top: 4px solid ${color.bg};">
            <div class="course-card-header">
              <h3 class="course-card-title">${work.title}</h3>
              <button class="btn-icon btn-edit-work" data-work-id="${work.id}" title="Editar categoría">⋮</button>
            </div>
            ${work.topics.length > 0 ? `
              <ul class="course-topics-list">
                ${work.topics.map(t => `
                  <li class="topic-item">
                    <span class="topic-bullet" style="background-color: ${color.bg};"></span>
                    <span>${t}</span>
                  </li>
                `).join('')}
              </ul>
            ` : `
              <div class="course-card-empty-topics">Sin tareas registradas todavía. Pulsa ⋮ para agregar temas de trabajo.</div>
            `}
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: auto; padding-top: 0.5rem; border-top: 1px dashed var(--border-color); display: flex; justify-content: space-between;">
              <span>${work.topics.length} tareas</span>
              <span>${workBlocks.length} sesiones asociadas</span>
            </div>
          </div>
        `;
      }).join('');

      if (appStore.editingWorkId) {
        const titleInput = qs('#edit-work-title');
        if (titleInput) titleInput.focus();
      }
    };

    /* Render Catálogo de Temas Sociales */
    const renderSocialView = () => {
      const container = qs('#social-grid-container');
      if (appStore.socialCatalog.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">No hay categorías sociales registradas. Pulsa "+ Nueva categoría social" para comenzar.</div>';
        return;
      }

      container.innerHTML = appStore.socialCatalog.map(social => {
        const isEditing = appStore.editingSocialId === social.id;
        const color = getCourseColor(social.id);
        const socialBlocks = appStore.blocks.filter(b => b.courseId === social.id);

        if (isEditing && appStore.tempSocialState) {
          const temp = appStore.tempSocialState;
          return `
            <div class="course-card is-editing" data-social-id="${social.id}" style="border-top: 4px solid ${color.bg};">
              <div class="edit-course-form">
                <div class="form-group">
                  <label>Título de la categoría social:</label>
                  <input type="text" id="edit-social-title" value="${temp.title}" required autofocus>
                </div>

                <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Actividades y temas sociales:</label>
                <div id="edit-social-topics-container" style="display: flex; flex-direction: column; gap: 0.4rem;">
                  ${temp.topics.map((t, idx) => `
                    <div class="edit-topic-row">
                      <input type="text" class="edit-social-topic-input" data-index="${idx}" value="${t}" placeholder="Nombre de la actividad...">
                      <button type="button" class="btn-icon btn-remove-social-topic" data-index="${idx}" title="Eliminar actividad" style="color: var(--danger);">✕</button>
                    </div>
                  `).join('')}
                </div>

                <button type="button" class="btn-outline" id="btn-add-social-topic-row" style="margin-top: 0.3rem;">+ Agregar actividad / tema</button>

                <div class="edit-actions-bar">
                  <button type="button" class="btn-danger" id="btn-delete-social-action">Eliminar categoría</button>
                  <div style="display: flex; gap: 0.4rem;">
                    <button type="button" class="btn-outline" id="btn-cancel-social-edit">Cancelar</button>
                    <button type="button" class="btn-primary" id="btn-save-social-edit">Guardar</button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }

        return `
          <div class="course-card" data-social-id="${social.id}" style="border-top: 4px solid ${color.bg};">
            <div class="course-card-header">
              <h3 class="course-card-title">${social.title}</h3>
              <button class="btn-icon btn-edit-social" data-social-id="${social.id}" title="Editar categoría">⋮</button>
            </div>
            ${social.topics.length > 0 ? `
              <ul class="course-topics-list">
                ${social.topics.map(t => `
                  <li class="topic-item">
                    <span class="topic-bullet" style="background-color: ${color.bg};"></span>
                    <span>${t}</span>
                  </li>
                `).join('')}
              </ul>
            ` : `
              <div class="course-card-empty-topics">Sin actividades registradas todavía. Pulsa ⋮ para agregar temas sociales.</div>
            `}
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: auto; padding-top: 0.5rem; border-top: 1px dashed var(--border-color); display: flex; justify-content: space-between;">
              <span>${social.topics.length} actividades</span>
              <span>${socialBlocks.length} sesiones asociadas</span>
            </div>
          </div>
        `;
      }).join('');

      if (appStore.editingSocialId) {
        const titleInput = qs('#edit-social-title');
        if (titleInput) titleInput.focus();
      }
    };

    /* Render Progreso */
    const renderProgressView = () => {
      // Métricas de Estudio
      const studyBlocks = appStore.blocks.filter(b => b.type === 'study');
      const completedStudy = studyBlocks.filter(b => b.status === 'completed');
      const pendingStudy = studyBlocks.filter(b => b.status !== 'completed');
      const totalStudy = studyBlocks.length;
      const percent = totalStudy > 0 ? Math.round((completedStudy.length / totalStudy) * 100) : 0;

      // Métricas de Trabajo
      const workBlocks = appStore.blocks.filter(b => b.type === 'work');
      const completedWork = workBlocks.filter(b => b.status === 'completed');
      const pendingWork = workBlocks.filter(b => b.status !== 'completed');
      const totalWork = workBlocks.length;
      const workPercent = totalWork > 0 ? Math.round((completedWork.length / totalWork) * 100) : 0;

      // Métricas de Temas Sociales
      const socialBlocks = appStore.blocks.filter(b => b.type === 'social');
      const completedSocial = socialBlocks.filter(b => b.status === 'completed');
      const pendingSocial = socialBlocks.filter(b => b.status !== 'completed');
      const totalSocial = socialBlocks.length;
      const socialPercent = totalSocial > 0 ? Math.round((completedSocial.length / totalSocial) * 100) : 0;

      const monday = appStore.currentWeekStart;
      const sunday = addDays(monday, 6);
      const startStr = toISODate(monday);
      const endStr = toISODate(sunday);

      let weekStudyMinutes = 0;
      let weekWorkMinutes = 0;
      let weekSocialMinutes = 0;
      appStore.blocks.forEach(b => {
        if (b.status === 'completed' && b.date >= startStr && b.date <= endStr) {
          const dur = timeToMinutes(b.end) - timeToMinutes(b.start);
          if (b.type === 'study') weekStudyMinutes += dur;
          else if (b.type === 'work') weekWorkMinutes += dur;
          else if (b.type === 'social') weekSocialMinutes += dur;
        }
      });

      // Actualizar Métricas de Estudio en UI
      qs('#prog-percent-text').textContent = `${percent}%`;
      qs('#prog-bar-fill').style.width = `${percent}%`;
      qs('#prog-completed-count').textContent = `${completedStudy.length} sesiones`;
      qs('#prog-pending-count').textContent = `${pendingStudy.length} sesiones`;
      qs('#prog-hours-week').textContent = `${(weekStudyMinutes / 60).toFixed(1)} h`;

      // Actualizar Métricas de Trabajo en UI
      qs('#prog-work-percent-text').textContent = `${workPercent}%`;
      qs('#prog-work-bar-fill').style.width = `${workPercent}%`;
      qs('#prog-work-completed-count').textContent = `${completedWork.length} sesiones`;
      qs('#prog-work-pending-count').textContent = `${pendingWork.length} sesiones`;
      qs('#prog-work-hours-week').textContent = `${(weekWorkMinutes / 60).toFixed(1)} h`;

      // Actualizar Métricas de Temas Sociales en UI
      qs('#prog-social-percent-text').textContent = `${socialPercent}%`;
      qs('#prog-social-bar-fill').style.width = `${socialPercent}%`;
      qs('#prog-social-completed-count').textContent = `${completedSocial.length} sesiones`;
      qs('#prog-social-pending-count').textContent = `${pendingSocial.length} sesiones`;
      qs('#prog-social-hours-week').textContent = `${(weekSocialMinutes / 60).toFixed(1)} h`;

      // Tabla de Estudio
      const tbodyStudy = qs('#progress-table-body');
      if (appStore.catalog.length === 0) {
        tbodyStudy.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No hay cursos registrados para mostrar progreso.</td></tr>';
      } else {
        tbodyStudy.innerHTML = appStore.catalog.map(c => {
          const cBlocks = appStore.blocks.filter(b => b.courseId === c.id && b.type === 'study');
          const cComp = cBlocks.filter(b => b.status === 'completed');
          const cPend = cBlocks.filter(b => b.status !== 'completed');
          const cMinutes = cComp.reduce((acc, b) => acc + (timeToMinutes(b.end) - timeToMinutes(b.start)), 0);
          const cPct = cBlocks.length > 0 ? Math.round((cComp.length / cBlocks.length) * 100) : 0;
          const color = getCourseColor(c.id);

          return `
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color.bg};"></span>
                  <strong>${c.title}</strong>
                </div>
              </td>
              <td>${cBlocks.length}</td>
              <td style="color: var(--status-completed); font-weight: 600;">${cComp.length}</td>
              <td style="color: var(--text-muted);">${cPend.length}</td>
              <td>${(cMinutes / 60).toFixed(1)} h</td>
              <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <div class="progress-bar-wrap" style="width: 80px; height: 6px; margin: 0;">
                    <div class="progress-bar-fill" style="width: ${cPct}%; background-color: ${color.bg};"></div>
                  </div>
                  <span style="font-size: 0.8rem; font-weight: 600;">${cPct}%</span>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }

      // Tabla de Trabajo
      const tbodyWork = qs('#progress-work-table-body');
      if (appStore.workCatalog.length === 0) {
        tbodyWork.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No hay categorías de trabajo registradas para mostrar progreso.</td></tr>';
      } else {
        tbodyWork.innerHTML = appStore.workCatalog.map(w => {
          const wBlocks = appStore.blocks.filter(b => b.courseId === w.id && b.type === 'work');
          const wComp = wBlocks.filter(b => b.status === 'completed');
          const wPend = wBlocks.filter(b => b.status !== 'completed');
          const wMinutes = wComp.reduce((acc, b) => acc + (timeToMinutes(b.end) - timeToMinutes(b.start)), 0);
          const wPct = wBlocks.length > 0 ? Math.round((wComp.length / wBlocks.length) * 100) : 0;
          const color = getCourseColor(w.id);

          return `
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color.bg};"></span>
                  <strong>${w.title}</strong>
                </div>
              </td>
              <td>${wBlocks.length}</td>
              <td style="color: var(--status-completed); font-weight: 600;">${wComp.length}</td>
              <td style="color: var(--text-muted);">${wPend.length}</td>
              <td>${(wMinutes / 60).toFixed(1)} h</td>
              <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <div class="progress-bar-wrap" style="width: 80px; height: 6px; margin: 0;">
                    <div class="progress-bar-fill" style="width: ${wPct}%; background-color: ${color.bg};"></div>
                  </div>
                  <span style="font-size: 0.8rem; font-weight: 600;">${wPct}%</span>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }

      // Tabla de Temas Sociales
      const tbodySocial = qs('#progress-social-table-body');
      if (appStore.socialCatalog.length === 0) {
        tbodySocial.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No hay categorías sociales registradas para mostrar progreso.</td></tr>';
      } else {
        tbodySocial.innerHTML = appStore.socialCatalog.map(s => {
          const sBlocks = appStore.blocks.filter(b => b.courseId === s.id && b.type === 'social');
          const sComp = sBlocks.filter(b => b.status === 'completed');
          const sPend = sBlocks.filter(b => b.status !== 'completed');
          const sMinutes = sComp.reduce((acc, b) => acc + (timeToMinutes(b.end) - timeToMinutes(b.start)), 0);
          const sPct = sBlocks.length > 0 ? Math.round((sComp.length / sBlocks.length) * 100) : 0;
          const color = getCourseColor(s.id);

          return `
            <tr>
              <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color.bg};"></span>
                  <strong>${s.title}</strong>
                </div>
              </td>
              <td>${sBlocks.length}</td>
              <td style="color: var(--status-completed); font-weight: 600;">${sComp.length}</td>
              <td style="color: var(--text-muted);">${sPend.length}</td>
              <td>${(sMinutes / 60).toFixed(1)} h</td>
              <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <div class="progress-bar-wrap" style="width: 80px; height: 6px; margin: 0;">
                    <div class="progress-bar-fill" style="width: ${sPct}%; background-color: ${color.bg};"></div>
                  </div>
                  <span style="font-size: 0.8rem; font-weight: 600;">${sPct}%</span>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    };

    /* HTML Helpers de Bloques */
    const renderScheduleCardHTML = (b) => {
      const color = getCourseColor(b.courseId);
      const isCompleted = b.status === 'completed';
      const typeLabels = { study: 'Estudio', break: 'Descanso', lunch: 'Almuerzo', work: 'Trabajo', social: 'Temas Sociales' };

      return `
        <div class="schedule-card ${b.priority === 'high' ? 'priority-high' : ''} ${isCompleted ? 'status-completed' : ''}" 
             style="border-left-color: ${color.bg};" data-block-id="${b.id}">
          <div class="card-top-row">
            <span class="card-category-badge" style="background-color: ${color.bg}22; color: ${color.bg};" title="${b.category}">
              ${b.category}
            </span>
            <span class="card-time">${b.start} - ${b.end}</span>
          </div>

          <div class="card-topic">${b.topic}</div>

          <div class="card-footer">
            <div class="card-badges">
              <span class="badge badge-type-${b.type}">${typeLabels[b.type] || b.type}</span>
              ${b.priority === 'high' ? `<span class="badge badge-priority-high">Alta</span>` : ''}
            </div>
            <div class="card-actions">
              <button class="btn-quick-check ${isCompleted ? 'completed' : ''}" data-action="toggle-status" data-block-id="${b.id}" title="${isCompleted ? 'Marcar como pendiente' : 'Marcar como completado'}">
                ${isCompleted ? '✓ Hecho' : '○'}
              </button>
              <button class="btn-icon" data-action="edit-block" data-block-id="${b.id}" title="Editar bloque">⋮</button>
            </div>
          </div>
        </div>
      `;
    };

    const renderTimelineItemHTML = (b) => {
      const color = getCourseColor(b.courseId);
      const isCompleted = b.status === 'completed';
      const durationMins = timeToMinutes(b.end) - timeToMinutes(b.start);
      const typeLabels = { study: 'Estudio', break: 'Descanso', lunch: 'Almuerzo', work: 'Trabajo', social: 'Temas Sociales' };
      const statusLabels = { pending: 'Pendiente', in_progress: 'En progreso', completed: 'Completado', rescheduled: 'Reprogramado' };
      const priorityLabels = { high: 'Alta', medium: 'Media', low: 'Baja' };

      return `
        <div class="timeline-item" style="border-left: 4px solid ${color.bg};">
          <div class="timeline-time-col">
            <span class="timeline-hours">${b.start} - ${b.end}</span>
            <span class="timeline-duration">${formatMinutesToHours(durationMins)}</span>
            <span class="badge badge-type-${b.type}" style="margin-top: 0.3rem;">${typeLabels[b.type] || b.type}</span>
          </div>

          <div class="timeline-content-col">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
              <span class="card-category-badge" style="background-color: ${color.bg}22; color: ${color.bg};">
                ${b.category}
              </span>
              <div style="display: flex; gap: 0.3rem;">
                <span class="badge badge-priority-${b.priority === 'high' ? 'high' : (b.priority === 'medium' ? 'med' : 'low')}">
                  Prioridad ${priorityLabels[b.priority] || b.priority}
                </span>
                <span class="badge" style="background-color: var(--bg-card); color: var(--text-secondary);">
                  ${statusLabels[b.status] || b.status}
                </span>
              </div>
            </div>

            <div style="font-size: 1rem; font-weight: 600; ${isCompleted ? 'text-decoration: line-through; opacity: 0.7;' : ''}">
              ${b.topic}
            </div>

            ${b.notes ? `<div style="font-size: 0.82rem; color: var(--text-muted);">${b.notes}</div>` : ''}

            <div style="display: flex; justify-content: flex-end; gap: 0.4rem; margin-top: 0.3rem;">
              <button class="btn-outline btn-quick-check ${isCompleted ? 'completed' : ''}" data-action="toggle-status" data-block-id="${b.id}">
                ${isCompleted ? '✓ Completado' : 'Marcar completado'}
              </button>
              <button class="btn-outline" data-action="edit-block" data-block-id="${b.id}">Editar</button>
              <button class="btn-outline" data-action="delete-block" data-block-id="${b.id}" style="color: var(--danger);">Eliminar</button>
            </div>
          </div>
        </div>
      `;
    };

    const renderAll = () => {
      renderFilters();
      if (appStore.activeView === 'dashboard') renderDashboard();
      else if (appStore.activeView === 'week') renderWeekView();
      else if (appStore.activeView === 'day') renderDayView();
      else if (appStore.activeView === 'courses') renderCoursesView();
      else if (appStore.activeView === 'work') renderWorkView();
      else if (appStore.activeView === 'social') renderSocialView();
      else if (appStore.activeView === 'progress') renderProgressView();
    };

    /* ==========================================================================
       6. CONTROL DE NAVEGACIÓN Y EVENTOS
       ========================================================================== */
    const titlesMap = {
      dashboard: 'Panel Principal',
      week: 'Vista Semanal del Horario',
      day: 'Horario Diario',
      courses: 'Temas de Estudio y Cursos',
      work: 'Temas de Trabajo y Proyectos',
      social: 'Temas Sociales',
      progress: 'Progreso y Métricas'
    };

    const switchView = (viewName) => {
      if (!titlesMap[viewName]) return;
      appStore.activeView = viewName;

      qsa('.nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === viewName);
      });

      qsa('.view-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `view-${viewName}`);
      });

      qs('#page-title').textContent = titlesMap[viewName];

      // Visibilidad contextual de la barra de filtros: solo activa en Vista Semanal y Horario Diario
      const filterBar = qs('#filters-container');
      if (filterBar) {
        filterBar.style.display = (viewName === 'week' || viewName === 'day') ? 'grid' : 'none';
      }

      renderAll();
    };

    qsa('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        switchView(view);
      });
    });

    qs('#btn-goto-today').addEventListener('click', () => {
      appStore.selectedDay = toISODate(new Date());
      switchView('day');
    });

    /* Navegación Semanal */
    qs('#btn-week-prev').addEventListener('click', () => {
      appStore.currentWeekStart = addDays(appStore.currentWeekStart, -7);
      renderWeekView();
    });

    qs('#btn-week-next').addEventListener('click', () => {
      appStore.currentWeekStart = addDays(appStore.currentWeekStart, 7);
      renderWeekView();
    });

    qs('#btn-week-current').addEventListener('click', () => {
      appStore.currentWeekStart = getMonday(new Date());
      renderWeekView();
    });

    /* Navegación Diaria */
    qs('#day-picker-input').addEventListener('change', (e) => {
      if (e.target.value) {
        appStore.selectedDay = e.target.value;
        renderDayView();
      }
    });

    qs('#btn-day-prev').addEventListener('click', () => {
      const cur = new Date(appStore.selectedDay + 'T00:00:00');
      appStore.selectedDay = toISODate(addDays(cur, -1));
      renderDayView();
    });

    qs('#btn-day-next').addEventListener('click', () => {
      const cur = new Date(appStore.selectedDay + 'T00:00:00');
      appStore.selectedDay = toISODate(addDays(cur, 1));
      renderDayView();
    });

    qs('#btn-day-today').addEventListener('click', () => {
      appStore.selectedDay = toISODate(new Date());
      renderDayView();
    });

    /* Filtros Globales */
    qs('#filter-search').addEventListener('input', (e) => {
      appStore.filters.search = e.target.value;
      renderAll();
    });

    qs('#filter-course').addEventListener('change', (e) => {
      appStore.filters.courseId = e.target.value;
      renderAll();
    });

    qs('#filter-priority').addEventListener('change', (e) => {
      appStore.filters.priority = e.target.value;
      renderAll();
    });

    qs('#filter-status').addEventListener('change', (e) => {
      appStore.filters.status = e.target.value;
      renderAll();
    });

    qs('#btn-clear-filters').addEventListener('click', () => {
      appStore.filters = { search: '', courseId: '', priority: '', status: '' };
      qs('#filter-search').value = '';
      qs('#filter-course').value = '';
      qs('#filter-priority').value = '';
      qs('#filter-status').value = '';
      renderAll();
      showToast('Filtros restablecidos.');
    });

    /* Event Delegation para Bloques (Toggle, Edit, Delete) */
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');
      const blockId = target.getAttribute('data-block-id');

      if (action === 'toggle-status') {
        appStore.toggleBlockStatus(blockId);
        renderAll();
      } else if (action === 'edit-block') {
        const block = appStore.blocks.find(b => b.id === blockId);
        if (block) openBlockModal(block);
      } else if (action === 'delete-block') {
        openConfirm('Eliminar bloque', '¿Estás seguro de que deseas eliminar este bloque de horario?', () => {
          appStore.deleteBlock(blockId);
          renderAll();
        });
      }
    });

    /* ==========================================================================
       7. GESTIÓN INTERACTIVA DE CURSOS DE ESTUDIO
       ========================================================================== */
    qs('#btn-new-course').addEventListener('click', () => {
      appStore.addCourse();
      renderCoursesView();
    });

    qs('#courses-grid-container').addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit-course');
      if (editBtn) {
        const courseId = editBtn.getAttribute('data-course-id');
        const course = appStore.catalog.find(c => c.id === courseId);
        if (course) {
          appStore.editingCourseId = courseId;
          appStore.tempCourseState = JSON.parse(JSON.stringify(course));
          renderCoursesView();
        }
        return;
      }

      if (e.target.id === 'btn-add-topic-row') {
        syncTempCourseInputs();
        appStore.tempCourseState.topics.push('Nuevo tema');
        renderCoursesView();
        return;
      }

      const removeTopicBtn = e.target.closest('.btn-remove-topic');
      if (removeTopicBtn) {
        syncTempCourseInputs();
        const index = parseInt(removeTopicBtn.getAttribute('data-index'), 10);
        appStore.tempCourseState.topics.splice(index, 1);
        renderCoursesView();
        return;
      }

      if (e.target.id === 'btn-cancel-course-edit') {
        appStore.editingCourseId = null;
        appStore.tempCourseState = null;
        renderCoursesView();
        return;
      }

      if (e.target.id === 'btn-save-course-edit') {
        syncTempCourseInputs();
        const title = appStore.tempCourseState.title;
        const topics = appStore.tempCourseState.topics;
        if (appStore.saveCourseEdit(appStore.editingCourseId, title, topics)) {
          renderAll();
        }
        return;
      }

      if (e.target.id === 'btn-delete-course-action') {
        const courseId = appStore.editingCourseId;
        const course = appStore.catalog.find(c => c.id === courseId);
        if (!course) return;

        const count = appStore.blocks.filter(b => b.courseId === courseId).length;
        const warningMsg = count > 0
          ? `¿Estás seguro de eliminar el curso "${course.title}"? También se eliminarán los ${count} bloques asociados a este curso.`
          : `¿Estás seguro de eliminar el curso "${course.title}"?`;

        openConfirm('Eliminar curso', warningMsg, () => {
          if (appStore.deleteCourse(courseId)) {
            renderAll();
          }
        });
      }
    });

    const syncTempCourseInputs = () => {
      if (!appStore.tempCourseState) return;
      const titleInput = qs('#edit-course-title');
      if (titleInput) appStore.tempCourseState.title = titleInput.value;

      const topicInputs = qsa('.edit-topic-input');
      appStore.tempCourseState.topics = topicInputs.map(input => input.value);
    };

    /* ==========================================================================
       7.1 GESTIÓN INTERACTIVA DE TEMAS DE TRABAJO
       ========================================================================== */
    qs('#btn-new-work').addEventListener('click', () => {
      appStore.addWorkCategory();
      renderWorkView();
    });

    qs('#work-grid-container').addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit-work');
      if (editBtn) {
        const workId = editBtn.getAttribute('data-work-id');
        const work = appStore.workCatalog.find(w => w.id === workId);
        if (work) {
          appStore.editingWorkId = workId;
          appStore.tempWorkState = JSON.parse(JSON.stringify(work));
          renderWorkView();
        }
        return;
      }

      if (e.target.id === 'btn-add-work-topic-row') {
        syncTempWorkInputs();
        appStore.tempWorkState.topics.push('Nueva tarea');
        renderWorkView();
        return;
      }

      const removeTopicBtn = e.target.closest('.btn-remove-work-topic');
      if (removeTopicBtn) {
        syncTempWorkInputs();
        const index = parseInt(removeTopicBtn.getAttribute('data-index'), 10);
        appStore.tempWorkState.topics.splice(index, 1);
        renderWorkView();
        return;
      }

      if (e.target.id === 'btn-cancel-work-edit') {
        appStore.editingWorkId = null;
        appStore.tempWorkState = null;
        renderWorkView();
        return;
      }

      if (e.target.id === 'btn-save-work-edit') {
        syncTempWorkInputs();
        const title = appStore.tempWorkState.title;
        const topics = appStore.tempWorkState.topics;
        if (appStore.saveWorkCategoryEdit(appStore.editingWorkId, title, topics)) {
          renderAll();
        }
        return;
      }

      if (e.target.id === 'btn-delete-work-action') {
        const workId = appStore.editingWorkId;
        const work = appStore.workCatalog.find(w => w.id === workId);
        if (!work) return;

        const count = appStore.blocks.filter(b => b.courseId === workId).length;
        const warningMsg = count > 0
          ? `¿Estás seguro de eliminar la categoría "${work.title}"? También se eliminarán los ${count} bloques asociados.`
          : `¿Estás seguro de eliminar la categoría "${work.title}"?`;

        openConfirm('Eliminar categoría de trabajo', warningMsg, () => {
          if (appStore.deleteWorkCategory(workId)) {
            renderAll();
          }
        });
      }
    });

    const syncTempWorkInputs = () => {
      if (!appStore.tempWorkState) return;
      const titleInput = qs('#edit-work-title');
      if (titleInput) appStore.tempWorkState.title = titleInput.value;

      const topicInputs = qsa('.edit-work-topic-input');
      appStore.tempWorkState.topics = topicInputs.map(input => input.value);
    };

    /* ==========================================================================
       7.2 GESTIÓN INTERACTIVA DE TEMAS SOCIALES
       ========================================================================== */
    qs('#btn-new-social').addEventListener('click', () => {
      appStore.addSocialCategory();
      renderSocialView();
    });

    qs('#social-grid-container').addEventListener('click', (e) => {
      const editBtn = e.target.closest('.btn-edit-social');
      if (editBtn) {
        const socialId = editBtn.getAttribute('data-social-id');
        const social = appStore.socialCatalog.find(s => s.id === socialId);
        if (social) {
          appStore.editingSocialId = socialId;
          appStore.tempSocialState = JSON.parse(JSON.stringify(social));
          renderSocialView();
        }
        return;
      }

      if (e.target.id === 'btn-add-social-topic-row') {
        syncTempSocialInputs();
        appStore.tempSocialState.topics.push('Nueva actividad');
        renderSocialView();
        return;
      }

      const removeTopicBtn = e.target.closest('.btn-remove-social-topic');
      if (removeTopicBtn) {
        syncTempSocialInputs();
        const index = parseInt(removeTopicBtn.getAttribute('data-index'), 10);
        appStore.tempSocialState.topics.splice(index, 1);
        renderSocialView();
        return;
      }

      if (e.target.id === 'btn-cancel-social-edit') {
        appStore.editingSocialId = null;
        appStore.tempSocialState = null;
        renderSocialView();
        return;
      }

      if (e.target.id === 'btn-save-social-edit') {
        syncTempSocialInputs();
        const title = appStore.tempSocialState.title;
        const topics = appStore.tempSocialState.topics;
        if (appStore.saveSocialCategoryEdit(appStore.editingSocialId, title, topics)) {
          renderAll();
        }
        return;
      }

      if (e.target.id === 'btn-delete-social-action') {
        const socialId = appStore.editingSocialId;
        const social = appStore.socialCatalog.find(s => s.id === socialId);
        if (!social) return;

        const count = appStore.blocks.filter(b => b.courseId === socialId).length;
        const warningMsg = count > 0
          ? `¿Estás seguro de eliminar la categoría "${social.title}"? También se eliminarán los ${count} bloques asociados.`
          : `¿Estás seguro de eliminar la categoría "${social.title}"?`;

        openConfirm('Eliminar categoría social', warningMsg, () => {
          if (appStore.deleteSocialCategory(socialId)) {
            renderAll();
          }
        });
      }
    });

    const syncTempSocialInputs = () => {
      if (!appStore.tempSocialState) return;
      const titleInput = qs('#edit-social-title');
      if (titleInput) appStore.tempSocialState.title = titleInput.value;

      const topicInputs = qsa('.edit-social-topic-input');
      appStore.tempSocialState.topics = topicInputs.map(input => input.value);
    };

    /* ==========================================================================
       8. IMPRESIÓN, TEMA OSCURO, BACKUP Y RESTABLECIMIENTO
       ========================================================================== */
    // Toggle del menu desplegable de Configuracion
const settingsWrapper = document.querySelector('.settings-wrapper');
const settingsDropdown = qs('#settings-dropdown');
const settingsToggle = qs('#btn-settings-toggle');

const toggleSettingsDropdown = (e) => {
  e.stopPropagation();
  settingsWrapper.classList.toggle('active');
};

const closeSettingsDropdown = () => {
  if (settingsWrapper) settingsWrapper.classList.remove('active');
};

if (settingsToggle) {
  settingsToggle.addEventListener('click', toggleSettingsDropdown);
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', (e) => {
  if (settingsWrapper && !settingsWrapper.contains(e.target)) {
    closeSettingsDropdown();
  }
});

qs('#btn-print-week').addEventListener('click', () => {
      renderAll();
      setTimeout(() => {
        window.print();
      }, 50);
    });

    const initTheme = () => {
      const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
      updateThemeUI(savedTheme);
    };

    const updateThemeUI = (theme) => {
      const icon = qs('#theme-icon');
      const text = qs('#theme-text');
      if (theme === 'light') {
        icon.textContent = '🌙';
        text.textContent = 'Modo Oscuro';
      } else {
        icon.textContent = '☀️';
        text.textContent = 'Modo Claro';
      }
    };

    qs('#btn-theme-toggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      updateThemeUI(next);
      showToast(`Cambiado a ${next === 'light' ? 'modo claro' : 'modo oscuro'}.`);
    });

    // Copias de Seguridad (Modal)
    const openBackupModal = () => qs('#backup-modal').classList.add('active');
    const closeBackupModal = () => qs('#backup-modal').classList.remove('active');

    qs('#btn-backup-open').addEventListener('click', openBackupModal);
    qs('#btn-close-backup').addEventListener('click', closeBackupModal);
    qs('#btn-cancel-backup').addEventListener('click', closeBackupModal);

    // Exportar JSON
    qs('#btn-export-json').addEventListener('click', () => {
      const dataStr = JSON.stringify({
        version: 2,
        exportedAt: new Date().toISOString(),
        catalog: appStore.catalog,
        workCatalog: appStore.workCatalog,
        socialCatalog: appStore.socialCatalog,
        blocks: appStore.blocks
      }, null, 2);

      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `horario_respaldo_${toISODate(new Date())}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Copia de respaldo exportada correctamente.');
    });

    // Importar JSON con validación
    qs('#import-file-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          if (!json || typeof json !== 'object') {
            throw new Error('El archivo no contiene un objeto JSON válido.');
          }

          if (json.catalog && !Array.isArray(json.catalog)) {
            throw new Error('El formato de catálogo de estudio no es válido.');
          }

          if (json.workCatalog && !Array.isArray(json.workCatalog)) {
            throw new Error('El formato de catálogo de trabajo no es válido.');
          }

          if (json.socialCatalog && !Array.isArray(json.socialCatalog)) {
            throw new Error('El formato de catálogo de temas sociales no es válido.');
          }

          if (json.blocks && !Array.isArray(json.blocks)) {
            throw new Error('El formato de bloques no es válido.');
          }

          appStore.migrateAndLoad(json);
          renderAll();
          closeBackupModal();
          showToast('Datos importados y sincronizados correctamente.');
        } catch (err) {
          showToast(`Error al importar: ${err.message}`, 'error');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    // Restablecer Horario
    qs('#btn-reset-open').addEventListener('click', () => {
      openConfirm(
        'Restablecer a valores iniciales',
        '¿Estás seguro de que deseas restablecer los cursos, temas de trabajo, temas sociales y bloques a la configuración de fábrica? Se perderán los cambios no guardados en un respaldo.',
        () => {
          appStore.loadDefaults();
          renderAll();
          showToast('Horario restablecido a la configuración inicial.');
        }
      );
    });

    /* ==========================================================================
       9. INICIALIZACIÓN DE LA APLICACIÓN
       ========================================================================== */
    window.addEventListener('DOMContentLoaded', () => {
      initTheme();
      switchView(appStore.activeView || 'dashboard');
    });
