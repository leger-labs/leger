#!/bin/bash
# RPM postinstall script for leger
# Based on Tailscale's rpm.postinst.sh pattern
#
# RPM scriptlet parameters:
# $1 == 1 for initial installation
# $1 == 2 for upgrades

if [ $1 -eq 1 ]; then
    # Initial installation

    # Create runtime and state directories if they don't exist
    mkdir -p /var/lib/legerd/staged
    mkdir -p /var/lib/legerd/backups
    mkdir -p /run/legerd

    # Set proper permissions
    chmod 755 /var/lib/legerd
    chmod 755 /var/lib/legerd/staged
    chmod 755 /var/lib/legerd/backups
    chmod 755 /run/legerd

    # Reload systemd to pick up new units
    systemctl daemon-reload >/dev/null 2>&1 || :

    # Follow RPM convention: use systemd preset policy
    # Don't auto-enable unless administrator has configured a preset
    systemctl preset legerd.service >/dev/null 2>&1 || :

    echo ""
    echo "leger installed successfully."
    echo ""
    echo "To start:"
    echo "  systemctl enable --now legerd.service    # System-wide"
    echo "  systemctl --user enable --now legerd.service  # Per-user"
    echo ""
    echo "Configuration: /etc/leger/config.yaml"
    echo "Documentation: https://leger.run/docs/"
    echo ""
fi

# For upgrades ($1 == 2), daemon-reload happens in postrm
# This matches Tailscale's pattern
