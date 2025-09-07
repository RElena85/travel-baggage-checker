# Trip Manager - Travel Baggage Checker

Una aplicación web moderna para gestionar viajes y sus elementos asociados con un diseño retro y una experiencia de usuario moderna.

## 🌟 Características

- ✈️ **Gestión de Viajes**: Crea, edita y elimina viajes
- 📦 **Categorización de Items**: 6 categorías predefinidas (Documentos, Ropa, Electrónicos, Higiene, Medicinas, Otros)
- 🔍 **Filtrado por Categorías**: Filtra y organiza tus items fácilmente
- 📊 **Estadísticas**: Ve el conteo de items por categoría
- ✅ **Sistema de Checklist**: Marca items como empacados/desempacados
- 💾 **Persistencia Local**: Tus datos se guardan automáticamente
- 📱 **Diseño Responsivo**: Funciona en todos los dispositivos
- 🎨 **Interfaz Retro-Moderna**: Diseño atractivo y funcional

## 🚀 Demo en Vivo

La aplicación está desplegada en GitHub Pages:
**[https://tu-usuario.github.io/travel-baggage-checker](https://tu-usuario.github.io/travel-baggage-checker)**

> **Nota**: Reemplaza `tu-usuario` con tu nombre de usuario de GitHub

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/travel-baggage-checker.git
cd travel-baggage-checker/trip-manager-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Scripts Disponibles

```bash
# Desarrollo
npm start                # Inicia el servidor de desarrollo
npm test                 # Ejecuta los tests
npm run test:coverage    # Ejecuta tests con reporte de cobertura
npm run build           # Construye la aplicación para producción

# Despliegue
npm run predeploy       # Construye la aplicación automáticamente
npm run deploy          # Despliega a GitHub Pages
```

## 📦 Despliegue en GitHub Pages

### Opción 1: Despliegue Manual

```bash
# Instalar dependencia de gh-pages
npm install --save-dev gh-pages

# Construir y desplegar
npm run deploy
```

### Opción 2: Usando Scripts Automatizados

**En Windows:**
```bash
./deploy.bat
```

**En Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Opción 3: Despliegue Automático con GitHub Actions

El repositorio incluye un workflow de GitHub Actions que despliega automáticamente cuando haces push a la rama `main`.

**Configuración inicial:**

1. **Configura tu repositorio:**
   - Ve a la configuración de tu repositorio en GitHub
   - En la sección "Pages", selecciona "Deploy from a branch"
   - Elige la rama `gh-pages` como fuente

2. **Actualiza la URL en package.json:**
   ```json
   {
     "homepage": "https://TU-USUARIO.github.io/travel-baggage-checker"
   }
   ```

3. **Haz push de tus cambios:**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment configuration"
   git push origin main
   ```

El despliegue se ejecutará automáticamente y tu aplicación estará disponible en unos minutos.

## 🏗️ Estructura del Proyecto

```
trip-manager-app/
├── public/                 # Archivos públicos
├── src/
│   ├── components/         # Componentes de React
│   ├── contexts/          # Context API
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Páginas de la aplicación
│   ├── styles/            # Archivos CSS
│   ├── types/             # Definiciones de TypeScript
│   └── utils/             # Utilidades
├── .github/
│   └── workflows/         # GitHub Actions
├── deploy.bat             # Script de despliegue para Windows
├── deploy.sh              # Script de despliegue para Unix/Linux
└── package.json
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm test -- --watch
```

## 🚀 Tecnologías Utilizadas

- **React 18** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático
- **React Router** - Navegación
- **CSS3** - Estilos y animaciones
- **GitHub Pages** - Hosting
- **GitHub Actions** - CI/CD

## 📝 Cómo Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ve el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes algún problema o pregunta:
- 🐛 Crea un [issue](https://github.com/tu-usuario/travel-baggage-checker/issues)
- 💬 Inicia una [discusión](https://github.com/tu-usuario/travel-baggage-checker/discussions)

---

✨ **¡Disfruta organizando tus viajes!** ✨