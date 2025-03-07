---
title: "Sync MikroTik Firewall Filtering Rules"
description: "A script that syncs firewall filtering rules. Good fit for CAPsMAN."
date: "2025-03-06"
keywords: [ "MikroTik", "CAPsMAN", "sync firewall rules", "MikroTik script" ]
layout: "blogpost"
---
## The problem

You have a single main MikroTik router. You want to sync the firewall rules from the main router to all neighbors.

Commonly, this would be the case if you have CAPsMAN on a central router, and a few CAP APs, because CAPsMAN doesn't sync filtering rules.

## The script

You **must** have [SSH public key login](https://help.mikrotik.com/docs/spaces/ROS/pages/132350014/SSH#SSH-EnablingPKIauthentication) enabled.

Here is the script:

```sh
:put "Exporting current firewall filter rules...";

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

:put "Firewall filter rule sync complete!"
```

This script first deletes all manually added rules on the cAPs, so keep that in mind. It will ensure that the rules are **exactly** the same. Any modifications you do afterwards will be deleted if you run the script again.