#!/bin/bash
# SSH-Hardening — auf frischem VPS ausführen
# Disables password-auth, disables root-login, custom port, fail2ban, ufw
set -euo pipefail

NEW_SSH_PORT=${1:-2222}

echo "▶ Hardening SSH (port $NEW_SSH_PORT)..."

# sshd_config
sed -i.bak \
  -e 's/^#?PasswordAuthentication.*/PasswordAuthentication no/' \
  -e 's/^#?PubkeyAuthentication.*/PubkeyAuthentication yes/' \
  -e 's/^#?PermitRootLogin.*/PermitRootLogin prohibit-password/' \
  -e 's/^#?ChallengeResponseAuthentication.*/ChallengeResponseAuthentication no/' \
  -e 's/^#?UsePAM.*/UsePAM no/' \
  -e "s/^#?Port .*/Port $NEW_SSH_PORT/" \
  /etc/ssh/sshd_config

# fail2ban
apt-get update -qq
apt-get install -y fail2ban
systemctl enable --now fail2ban

cat > /etc/fail2ban/jail.d/sshd.local <<EOF
[sshd]
enabled = true
port = $NEW_SSH_PORT
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF

systemctl restart fail2ban

# ufw
apt-get install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow $NEW_SSH_PORT/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP (Letsencrypt)'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable

# Restart sshd
systemctl restart sshd

echo "✓ SSH hardened. New port: $NEW_SSH_PORT"
echo "  ⚠ Make sure to update your SSH config (~/.ssh/config) and CI secrets!"
