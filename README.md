<div align="center">

# ⚔️ TBH Build Share

### Planificador de builds para **Task Bar Hero**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#)
[![GitHub](https://img.shields.io/badge/GitHub-VentusXTM/tbhbuildshare-4a9eff)](https://github.com/VentusXTM/tbhbuildshare)

<br>

</div>

**TBH Build Share** es una SPA (Single Page Application) para planear, visualizar y compartir builds de *Task Bar Hero*, un juego RPG idle de héroes. Podés asignar skill points en el árbol de talentos, invertir en runas con su árbol SVG interactivo, y compartir tus builds con un simple link.

---

## ✨ Features

| | |
|---|---|
| 🧙 **Skill Tree** | Árbol de talentos por héroe con tiers bloqueables, max out automático y conteo de puntos |
| 🏹 **Múltiples héroes** | Seleccioná entre todos los héroes del juego con sus stats base |
| 🔮 **Árbol de Runas SVG** | Árbol interactivo con 197 nodos, zoom, pan, tooltips y allocate/deallocate con click |
| 🔗 **Share por link** | Compartí tu build y tus runas con un solo link cifrado en el hash de la URL |
| 💾 **Persistencia local** | Tus builds se guardan en localStorage |
| 📥 **Export / Import** | Exportá tu build como JSON o importalo desde un link compartido |

---

## 📋 Requisitos

Esta aplicación es **puro frontend** — HTML, CSS y JavaScript vanilla. No necesita build ni dependencias.

**PERO** como usa `fetch()` para cargar datos locales (`data/rune_tree.json`), **debés servir los archivos con un servidor web**. No funciona abriendo `index.html` directamente desde el filesystem.

Opciones rápidas:

```bash
# Python 3
python3 -m http.server 8080

# Node (con http-server instalado)
npx http-server -p 8080

# PHP
php -S 0.0.0.0:8080
```

Después abrí [`http://localhost:8080`](http://localhost:8080) en tu navegador.

---

## 🚀 Cómo usar

1. **Elegí un héroe** — clickeá la tarjeta del héroe que quieras
2. **Asigná skills** — usá los botones `+` / `−` en el árbol de talentos
3. **Equipá habilidades activas** — checkeá las skills que querés llevar al mapa
4. **Invertí en runas** — andá a la pestaña **Rune Tree**, hacé click en los nodos para asignar niveles (click derecho para sacar)
5. **Compartí** — usá el botón **Share Link** para copiar tu build al portapapeles

---

## 🗂️ Estructura

```
├── index.html          # SPA principal
├── browse.html         # Explorador de builds comunitarios
├── app.js              # Lógica de la aplicación
├── rune-tree.js        # Árbol de runas SVG interactivo
├── data.js             # Datos de héroes, skills y stats
├── styles.css          # Estilos
├── data/
│   ├── rune_tree.json  # Datos del árbol de runas (sourced de la wiki)
│   └── runes.json      # Catálogo de runas
└── assets/runes/       # Iconos de runas (wiki)
```

---

## 🛠️ Stack

- JavaScript vanilla (sin frameworks)
- SVG DOM para el árbol de runas
- localStorage para persistencia
- Hash de URL para compartir (base64 + encodeURIComponent)
- Datos sourced de [taskbarhero.wiki](https://www.taskbarhero.wiki/runes)

---

<div align="center">
  <br>
  <sub>Hecho con ❤️ por la comunidad de Task Bar Hero</sub>
  <br>
  <sub>
    <a href="https://store.steampowered.com/app/3678970">Steam</a> ·
    <a href="https://www.taskbarhero.wiki/">Wiki</a> ·
    <a href="https://discord.gg/taskbarhero">Discord</a>
  </sub>
</div>
