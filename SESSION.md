# TBH Build Share — Session Context

Proyecto creado el 31 Mayo 2026 a partir del análisis del wiki de TBH (Task Bar Hero).

## Resumen del Proyecto

Static SPA para planificar y compartir builds de TBH. Sin dependencias, sin build step. 5 archivos, ~2.600 líneas.

## Archivos

| Archivo | Rol |
|---------|-----|
| `index.html` | Build planner — selector de héroe, skill tree, active skills, gear, pet, estadísticas, export/import |
| `browse.html` | Galería de builds guardadas con búsqueda, filtros por héroe, sort, delete, import |
| `styles.css` | Tema dark game-oriented, responsive, scrollbars, animaciones |
| `data.js` | Game database: 6 héroes con skill trees completos (8 tiers c/u), 36 active skills, 8 pets, tipos de gear, rarezas |
| `app.js` | Planner logic: skill tree interactivo (inc/dec/maxout/reset), equipamiento, build sharing via URL hash, localStorage, JSON |
| `SESSION.md` | Este archivo — contexto de sesión |

## Features Implementadas

- **6 héroes**: Knight, Ranger, Sorcerer, Priest, Hunter, Slayer con skill trees completos extraídos del wiki
- **Skill tree**: 8 tiers, hasta 100 puntos (Lv. 100), todos los tiers disponibles
- **Active skills**: Checkbox equip (hasta 6 slots), muestra elemento/rango/activación/Lv.
- **Gear loadout**: 4 slots (weapon, off-hand, armor, accessory) con rarezas Common→Cosmic, adaptado al arma del héroe
- **Pets**: Grid con 8 mascotas, selección única, muestra bonus principal
- **Base stats**: DPS, HP, ATK, ARM, ASPD, Crit%, Crit Dmg, Move Speed con highlighting
- **Sharing**: URL con hash base64 (`#build=...`), copia al portapapeles, fallback prompt()
- **Export/Import**: JSON export con download, JSON import desde texto o share link
- **Persistencia**: localStorage (builds guardadas + build actual)
- **Gallery**: Build cards con búsqueda, filtro por héroe, sort newest/oldest, load/delete
- **Responsive**: Desktop y mobile

## Stack Técnico

- HTML5 + CSS3 + vanilla JS (ES6)
- Sin frameworks, sin bundlers, sin dependencias externas
- Imágenes servidas desde `https://www.taskbarhero.wiki/` (wiki CDN)
- Favicon desde el wiki
- fallback SVG inline para imágenes que fallen

## Datos Extraídos del Wiki

Fuente: https://www.taskbarhero.wiki/

### Heroes
6 héroes con datos completos: stats base, weapon/off-hand types, skill trees de 8 tiers con skills pasivas y activas (nombres, IDs, maxLevel, elemento, rango, activación, statBonus, icons).

### Active Skills
36 skills (6 por héroe), cada una con: id, hero, name, activation type, element (Physical/Fire/Cold/Lightning), range, maxLevel, icon.

### Pets
8 mascotas: Bat, Watcher, Burning Skeleton, Blue Golem, Dark Spirit, Sword, Butterfly, Dragon. Cada una con bonuses y unlock conditions.

### Gear
- 6 weapon types: Sword, Bow, Staff, Scepter, Crossbow, Axe
- 6 off-hand types: Shield, Arrow, Orb, Tome, Bolt, Hatchet
- 10 rarities: Common→Uncommon→Rare→Legendary→Immortal→Arcana→Beyond→Celestial→Divine→Cosmic
- 3 armor weight classes, 7 accessory types
- Nota: hay 5.760 items de gear en el wiki. Para el MVP se incluye el modelo de datos completo. La selección detallada de ítems específicos (con stats variables por nivel/rareza) es una mejora pendiente.

### No incluido en el MVP
- **Runas**: 197 nodos en árbol interactivo en wiki (sin API de datos plana visible) → pendiente
- **Items detallados**: 5.760 items de gear, 45 datasets (~40k rows) en la DB page → pendiente
- **Stages**: 120 stages, información disponible pero no esencial para build planner
- **Cálculo de stats reales**: el planner muestra stats base del héroe no modificadas por gear/skills → mejora futura

## Cómo Usar

Abrir `index.html` directo en el navegador. Todo funciona en `file://` excepto `navigator.clipboard` en Chrome (fallback a prompt()). Para servir en LAN:

```bash
# Con Python (simple)
python3 -m http.server 8080

# Con Caddy (recomendado para LAN con dominio custom)
# Ver abajo
```

## Para Correr en LAN con Nombre de Dominio

### Opción A: Caddy (recomendado)

```bash
sudo apt install caddy
echo 'tbh.local {
    root * /mnt/datos/opencode/projects/tbhbuildshare
    file_server
}' | sudo tee /etc/caddy/Caddyfile
sudo systemctl start caddy
```

Agregar `192.168.1.X  tbh.local` al `/etc/hosts` de cada cliente en la LAN, o configurar DNS local.

### Opción B: Nginx

```nginx
server {
    listen 80;
    server_name tbh.local;
    root /mnt/datos/opencode/projects/tbhbuildshare;
}
```

### Opción C: Python directo

```bash
cd /mnt/datos/opencode/projects/tbhbuildshare
python3 -m http.server 8080
# Acceder via http://192.168.1.X:8080
```

## Pendiente / Mejoras Futuras

- [ ] Gear detallado: integrar los 5.760 ítems del wiki con búsqueda y filtros por nivel/rareza/tipo
- [ ] Runas: agregar selector de nodos del árbol de 197 nodos
- [ ] Cálculo de stats reales: sumar bonuses de passives + gear + pet
- [ ] Build validation: marcar si skills equipadas sin puntos asignados
- [ ] Exportar build como imagen/card PNG
- [ ] Modo offline: service worker para cachear assets del wiki
- [ ] Traducción completa al español de la UI
