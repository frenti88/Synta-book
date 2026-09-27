# SYNTA — Editorial de Literatura Sintética

Landing editorial de lanzamiento, experiencia de lectura inmersiva y plataforma de descubrimiento cultural para **SYNTA**, editorial dedicada a la literatura creada por autores sintéticos.

---

## 1. Principio Editorial y Narrativo

SYNTA no se presenta como una startup de inteligencia artificial ni apela al efectismo tecnológico. La tecnología habita detrás de la experiencia; la literatura permanece en el primer plano.

### Journey Principal
1. **Descubrimiento**: Portada tipográfica con sutil anomalía gráfica y pregunta central: *¿Qué hace real a una historia?*.
2. **Curiosidad**: *Lee antes de conocer a su autor*.
3. **Primera obra**: *La casa que empezó a olvidarnos* (SYNTA 001).
4. **Desbloqueo**: Únicamente correo electrónico (sin contraseñas ni formularios extensos). Efecto dotación: *Tu acceso está abierto*.
5. **Lectura**: Lector digital nativo (Newsreader, control de tamaño de letra `Aa`, modo papel claro/oscuro, persistencia milimétrica de scroll).
6. **Final**: Pausa visual tras la última frase, `FIN`, y transición voluntaria hacia el autor.
7. **Revelación**: Descubrimiento de **NOMA** (identidad abstracta y conceptual, no humana).
8. **Reacción**: 3 preguntas breves de feedback estético y reflexión opcional.
9. **Conversión siguiente**: *Quiero leer la próxima* en un solo clic, sin volver a solicitar correo.

---

## 2. Sistema Visual y Tipografía

- **Paleta de Color**:
  - `Paper`: `#F4F1EA` (fondo principal)
  - `Ink`: `#121212` (texto principal y acentos primarios)
  - `Secondary Ink`: `#64615C` (subtítulos y metadatos)
  - `Signal`: `#E34A32` (llamados de acción y acento tipográfico mínimo)
- **Tipografías**:
  - **Newsreader**: Titulares editoriales, títulos de obras, citas y cuerpo de lectura del reader.
  - **Inter**: Navegación, controles del reader, botones y metadatos secundarios.

---

## 3. Estructura del Código

```
SYNTA/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── readers/route.ts          # Registro de lectores (Supabase + fallback)
│   │   │   ├── reading-progress/route.ts # Persistencia de avance
│   │   │   ├── feedback/route.ts         # Encuesta post-lectura
│   │   │   ├── next-story/route.ts       # Conversión para la siguiente obra
│   │   │   └── events/route.ts           # Analítica y telemetría de eventos
│   │   ├── globals.css                   # Variables CSS editoriales y tipografía
│   │   ├── layout.tsx                    # Metadatos, Schema.org y accesibilidad
│   │   └── page.tsx                      # Orquestador principal de la landing
│   ├── components/
│   │   ├── Header.tsx                    # Header sticky dinámico (68px)
│   │   ├── Hero.tsx                      # Jerarquía editorial principal
│   │   ├── BookCover.tsx                 # Portada tipográfica reactiva
│   │   ├── BreathingQuote.tsx            # Silencio y respiro editorial
│   │   ├── BookFeature.tsx               # Presentación de SYNTA 001
│   │   ├── UnlockDrawer.tsx              # Captura de correo y desbloqueo
│   │   ├── Reader.tsx                    # Lector digital con Aa, modo noche y progreso
│   │   ├── AuthorReveal.tsx              # Revelación de NOMA con glifo abstracto
│   │   ├── FeedbackSection.tsx           # Formulario de reacción post-lectura
│   │   ├── NextStorySection.tsx          # Captura en un clic de interés
│   │   ├── FutureSection.tsx             # Panorama editorial ("Esto apenas comienza")
│   │   ├── ManifestoSection.tsx          # Manifiesto condensado
│   │   ├── CommunitySection.tsx          # Captura de comunidad
│   │   ├── Footer.tsx                    # Pie minimalista
│   │   ├── PrivacyModal.tsx              # Política de datos (Habeas Data / Colombia)
│   │   └── ManifestoModal.tsx            # Manifiesto completo
│   ├── lib/
│   │   ├── analytics.ts                  # Seguimiento analítico y sesiones
│   │   ├── story.ts                      # Texto completo de 'La casa que empezó a olvidarnos'
│   │   └── supabase.ts                   # Cliente Supabase
│   └── types/
│       └── index.ts                      # Interfaces y tipos TypeScript
└── supabase/
    └── migrations/
        └── 20260927_synta_init.sql       # Tablas readers, reading_progress, feedback, events
```

---

## 4. Ejecución en Local

```bash
# Instalar dependencias
npm install

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm run start
# o en desarrollo:
npm run dev
```

---

## 5. Integración con Supabase

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Ejecuta el script SQL ubicado en `supabase/migrations/20260927_synta_init.sql` desde el SQL Editor de tu panel de Supabase.
3. Configura tus variables de entorno en `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon
   ```
*(Nota: Si no se configuran credenciales de Supabase, la aplicación opera de forma transparente con persistencia en localStorage y respuestas API resilientes).*
