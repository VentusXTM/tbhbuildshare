#!/usr/bin/env bash
set -euo pipefail

CADDYFILE="/etc/caddy/Caddyfile"
PROJECT_DIR="/mnt/datos/opencode/projects/tbhbuildshare"
ZEROTIER_IP="172.27.1.3"

echo "=== Instalando Caddy ==="
apt install -y caddy

echo "=== Configurando Caddyfile ==="
cat > "$CADDYFILE" <<CADDY
http://localhost:8081 {
    root * $PROJECT_DIR
    file_server
}

http://$ZEROTIER_IP:8081 {
    root * $PROJECT_DIR
    file_server
}
CADDY

echo "=== Habilitando e iniciando servicio ==="
systemctl enable --now caddy

echo "=== Verificando ==="
sleep 1
curl -s -o /dev/null -w "localhost:8081 -> HTTP %{http_code}\n" http://localhost:8081
curl -s -o /dev/null -w "172.27.1.3:8081 -> HTTP %{http_code}\n" http://172.27.1.3:8081

echo ""
echo "✓ TBH Build Share corriendo en:"
echo "  http://localhost:8081"
echo "  http://172.27.1.3:8081"
