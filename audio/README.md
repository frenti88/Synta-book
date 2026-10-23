# SYNTA Audio Engine — Pipeline de Audiolibros con Chatterbox

Este módulo contiene el sistema de producción editorial de audiolibros para el sello **SYNTA**, impulsado por el motor de síntesis y clonación vocal de código abierto **Chatterbox Multilingual V3** (Resemble AI).

---

## 1. Principio Arquitectónico

- **Generación Local Offline:** Chatterbox se ejecuta exclusivamente en local/servidores de producción editorial mediante scripts Python con aceleración por hardware (Apple Silicon MPS / CUDA).
- **Cero carga en frontend/Vercel:** Vercel y el cliente web únicamente reciben y reproducen los archivos finales optimizados en formato MP3 (160 kbps) a través de un reproductor nativo accesible y minimalista. No hay PyTorch ni llamadas serverless de TTS en tiempo de ejecución.

---

## 2. Estructura de Directorios

```text
audio/
├── README.md                 # Guía operativa completa
├── requirements.txt          # Dependencias Python (torch, chatterbox-tts, soundfile...)
├── audiobook.json            # Manifiesto local de la última compilación
├── config/
│   ├── noma.json             # Parámetros vocales de NOMA (temperatura, exageración, seed...)
│   └── synta-001.json        # Estructura capitular y dirección emocional
├── voices/
│   └── noma/
│       ├── reference.wav     # Audio prompt de referencia vocal (opcional)
│       └── VOICE_LICENSE.md  # Procedencia, derechos y licencia MIT
├── manuscripts/
│   └── synta-001.md          # Manuscrito fuente en Markdown
├── generated/
│   └── synta-001/
│       ├── chapter-01/       # Chunks individuales WAV
│       ├── chapter-01.wav    # Master continuo WAV con pausas naturales
│       └── prepared_chunks.json # Segmentación fonética por frases
└── scripts/
    ├── prepare_manuscript.py # Limpieza de Markdown y chunking (180-320 caracteres)
    ├── stitch_chapter.py     # Montaje con pausas editoriales (párrafos, diálogos, fin de escena)
    ├── export_web_audio.py   # Codificación MP3 (160 kbps) y publicación en public/audio/
    └── generate_audiobook.py # CLI maestro unificado
```

---

## 3. Instalación y Puesta en Marcha

### Requisitos Previos
- Python 3.11 instalado (recomendado mediante `uv python install 3.11`).
- `ffmpeg` en el sistema (`brew install ffmpeg`).

### Activar Entorno
```bash
cd audio
source .venv/bin/activate
pip install -r requirements.txt
```

---

## 4. Comandos de Producción

### Generar todo el libro (SYNTA 001)
```bash
python scripts/generate_audiobook.py --book synta-001
```

### Generar un solo capítulo (ejemplo: Capítulo 1)
```bash
python scripts/generate_audiobook.py --book synta-001 --chapter 1
```

### Forzar regeneración de chunks existentes
```bash
python scripts/generate_audiobook.py --book synta-001 --chapter 1 --force
```

### Especificar dispositivo manualmente (o detección automática)
```bash
python scripts/generate_audiobook.py --book synta-001 --device mps
# O en servidores con GPU NVIDIA:
python scripts/generate_audiobook.py --book synta-001 --device cuda
```

### Re-exportar a MP3 y actualizar manifiesto sin regenerar audio
```bash
python scripts/export_web_audio.py synta-001
```

---

## 5. Referencia Vocal de NOMA

Para imprimir la identidad vocal a partir de una muestra propia:
1. Colocar un archivo WAV limpio de 10 a 30 segundos (sin música, sin reverberación) en:
   `audio/voices/noma/reference.wav`
2. Si el archivo no existe, el motor genera automáticamente utilizando la voz base de Chatterbox para español latinoamericano con los parámetros calibrados en `audio/config/noma.json`.

---

## 6. Soporte para Futuros Libros y Autores

Para agregar un nuevo libro o autor sintético al pipeline:
1. Añadir el manuscrito a `audio/manuscripts/synta-002.md`.
2. Crear su configuración capitular en `audio/config/synta-002.json`.
3. Para un nuevo autor (ejemplo: MIRA):
   - Crear `audio/voices/mira/config.json`.
   - Colocar `audio/voices/mira/reference.wav`.
4. Ejecutar:
   ```bash
   python scripts/generate_audiobook.py --book synta-002 --voice voices/mira/reference.wav
   ```
