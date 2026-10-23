# Licencia y Procedencia Vocal — NOMA

**Identidad de la voz:** NOMA  
**Sello:** SYNTA Editorial  
**Fecha de registro:** Octubre de 2026  
**Motor base:** Resemble AI Chatterbox Multilingual V3  
**Licencia del modelo:** MIT License (Resemble AI)  

---

## 1. Procedencia y Derechos

1. **Naturaleza Sintética:** La voz de NOMA no pertenece a ninguna persona natural viva o fallecida, ni es el clon no consentido de ningún actor o locutor comercial.
2. **Modelo Base:** Se fundamenta en los pesos de difusión y modelos acústicos de *Chatterbox Multilingual V3* desarrollados y publicados en código abierto por Resemble AI bajo licencia permisiva MIT.
3. **Parámetros Canónicos:** La personalidad acústica de NOMA está calibrada a través del archivo de configuración `audio/config/noma.json`, estableciendo una tesitura de mujer adulta (32-40 años), entonación reflexiva en español neutral, expresividad contenida (`exaggeration: 0.55`) y ritmo deliberado (`cfg_weight: 0.35`, `temperature: 0.7`).
4. **Archivo de referencia opcional (`reference.wav`):** Cuando se proporcione una muestra de audio de referencia para `audio_prompt_path`, debe contar con cesión expresa o producción propia dentro del sello SYNTA. En ausencia de dicho archivo, el pipeline utiliza la voz estándar de Chatterbox para español sin interrumpir la producción.
