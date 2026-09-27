# P.A.P.A. Creador de Consumibles

Aplicación web oficial para el diseño, cálculo y gestión de objetos consumibles (*Pociones, Elixires, Ungüentos, Bálsamos, Aceites, Bombas, Sellos y Talismanes*) para el juego de rol **Sistema P.A.P.A.**, basada en la **Revisión 2 de Creación de Consumibles** y el manual básico.

---

## 🎨 Características

- **Diseño de Consumibles según las 3 Categorías Oficiales:**
  - **Comestible:** Activación como Acción Rápida (o Principal si el objetivo está inconsciente).
  - **Aplicable:** 1 minuto de aplicación, siempre fuera de combate.
  - **Activable:** Acción Principal (o Rápida/Reacción según conjuro base), con tirada a distancia si es hostil.
- **Grimorio Completo:** 150 conjuros del manual clasificados en las 6 Energías (*Destrucción, Creación, Transformación, Conservación, Orden, Caos*) y 5 Niveles.
- **Cálculo Alquímico de Lectos ($L$):** Precios base por Nivel ($25\,L$, $75\,L$, $200\,L$, $500\,L$, Sin precio común para Nivel V), modificadores de ingredientes y caducidad, y coste de materiales de fabricación (50%).
- **Catálogo de Desventajas:** *Uso complejo*, *Efectos adversos*, *Fórmula inestable*, *Frágil*, *Adictiva* (con ND de respaldo dinámico $8 + \text{Nivel}$).
- **Simulador de Tiradas P.A.P.A.:** Tiradas de dados integradas ($1\text{d}6$ inestabilidad, $2\text{d}6$ adicción, salvaciones y tiradas de experto $3\text{d}6$ con detección de críticos por dados dobles).
- **Descargas & Exportación:**
  - Exportación en imagen de alta resolución (**PNG**) lista para imprimir o recortar en mesa.
  - Ficha en texto plano (**TXT**) con la plantilla oficial del manual.
  - Formato Markdown (**MD**) para notas digitales.
  - Exportación e importación completa del alijo en **JSON**.

---

## 🚀 Despliegue en GitHub Pages

Este proyecto es 100% estático y utiliza rutas relativas (`base: './'`).

Para publicarlo gratis en GitHub Pages:

### Paso 1: Activar GitHub Actions en tu repositorio
1. Entra a tu repositorio en **GitHub.com**.
2. Haz clic en **Add file** > **Create new file**.
3. En el nombre escribe: `.github/workflows/deploy.yml`
4. Copia y pega el contenido que está en el archivo `github-pages-workflow.example.yml` de este proyecto.
5. Haz clic en **Commit changes...**.

### Paso 2: Activar Pages
1. Ve a **Settings** > **Pages** en tu repositorio.
2. En **Build and deployment** > **Source**, selecciona **GitHub Actions**.
3. ¡Listo! En un par de minutos tu página estará activa en `https://<tu-usuario>.github.io/<tu-repo>/`.

---

## 🛠️ Desarrollo local

Para ejecutar el proyecto en tu máquina:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```
