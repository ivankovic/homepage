---
title: "Sinkronizacija MikroTik Vatrozid Filtera"
description: "Skripta za sinkronizaciju filtera. Pogodna za CAPsMAN."
date: "2025-03-06"
keywords: [ "MikroTik", "CAPsMAN", "sinkronizacija vatrozid pravila", "MikroTik skripta" ]
layout: "blogpost"
---
## Problem

Imate jedan glavni MikroTik router. Želite sinkronizirati pravila vatrozida s glavnog routera na sve susjedne uređaje.

Ovo je često slučaj kada imate CAPsMAN na središnjem routeru i nekoliko CAP pristupnih točaka, jer CAPsMAN ne sinkronizira vatrozid pravila.

## Skripta

**Morate** imati omogućenu [SSH autentifikaciju javnim ključem](https://help.mikrotik.com/docs/spaces/ROS/pages/132350014/SSH#SSH-EnablingPKIauthentication).

Evo skripte:

```sh
:put "Spremanje trenutnih vatrozid filtera...";

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

:put "Sinkronizacija vatrozida završena!"
```

Ova skripta prvo briše sva ručno dodana pravila na cAP-ovima, pa to imajte na umu. Osigurat će da su pravila **točno** ista. Sve promjene koje napravite nakon toga bit će izbrisane ako ponovno pokrenete skriptu. 