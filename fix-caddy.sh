#!/usr/bin/env bash
set -euo pipefail

echo "=== Arreglando Caddyfile (http:// explícito) ==="
printf 'http://localhost:8081 {\n    root * /mnt/datos/opencode/projects/tbhbuildshare\n    file_server\n}\n\nhttp://172.27.1.3:8081 {\n    root * /mnt/datos/opencode/projects/tbhbuildshare\n    file_server\n}\n' > /etc/caddy/Caddyfile

echo "=== Recargando Caddy ==="
systemctl reload caddy
sleep 1

echo "=== Verificando ==="
curl -s -o /dev/null -w "localhost:8081 -> HTTP %{http_code}\n" http://localhost:8081
curl -s -o /dev/null -w "172.27.1.3:8081 -> HTTP %{http_code}\n" http://172.27.1.3:8081

echo ""
echo "✓ Listo"
