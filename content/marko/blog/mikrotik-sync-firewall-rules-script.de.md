---
title: "MikroTik Firewall-Filterregeln synchronisieren"
description: "Ein Skript zur Synchronisation von Firewall-Filterregeln. Geeignet für CAPsMAN."
date: "2025-03-06"
keywords: [ "MikroTik", "CAPsMAN", "Firewall-Regeln synchronisieren", "MikroTik Skript" ]
layout: "blogpost"
---
## Das Problem

Sie haben einen einzelnen Haupt-MikroTik-Router. Sie möchten die Firewall-Regeln vom Hauptrouter zu allen Nachbargeräten synchronisieren.

Dies ist häufig der Fall, wenn Sie CAPsMAN auf einem zentralen Router und mehrere CAP Access Points haben, da CAPsMAN keine Filterregeln synchronisiert.

## Das Skript

Sie **müssen** [SSH-Public-Key-Login](https://help.mikrotik.com/docs/spaces/ROS/pages/132350014/SSH#SSH-EnablingPKIauthentication) aktiviert haben.

Hier ist das Skript:

```sh
:put "Exportiere aktuelle Firewall-Filterregeln...";

/ip firewall filter export file=filterRules

:local cpes [/ip neighbor print as-value];

:foreach cpe in=$cpes do={
    :put (($cpe->"address") . " " . $cpe->"identity");

    /tool fetch upload=yes mode=ftp \
        user="admin" password="PASSWORD" \
        src-path=filterRules.rsc dst-path=filterRules.rsc \
        address=($cpe->"address")

    /system ssh-exec user="admin" address=($cpe->"address") \
        command="/ip firewall filter remove [find dynamic=no]; import filterRules.rsc; /file remove filterRules.rsc;"
}

:put "Synchronisation der Firewall-Filterregeln abgeschlossen!"
```

Dieses Skript löscht zuerst alle manuell hinzugefügten Regeln auf den cAPs. Bitte beachten Sie dies. Es stellt sicher, dass die Regeln **exakt** gleich sind. Alle Änderungen, die Sie danach vornehmen, werden gelöscht, wenn Sie das Skript erneut ausführen. 