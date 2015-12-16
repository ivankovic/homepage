+++
date = 2013-09-15T20:37:00Z
title = "Monitoring the Raspberry Pi CPU Temperature"
aliases = [
  "/blog/2013/09/15/monitoring-the-raspberry-pi-cpu-temperature.html"
]
+++
Monitoring the Raspberry PI - CPU Temperature
=============================================

If you are like me, you have a few Raspberry PI-es in the house. They are the perfect platform for hacker enthusiasts and rightfully so. Cheap, versatile, unified platform shared by hundreds of thousands of people, what’s not to like.

While I do have a few pies for development, one of them is my “production” home server. It serves as the SSH server that bridges my home network and the internet. In the past, this has proven to be quite a stable setup. The PI very rarely goes down and then a simple power cycle fixes the thing. Still, some protection is a good idea, so I bought one of the nice plastic cases.

As I installed the case, I became worried that the temperature increase might slow the system down or cause instability, and because of the quite sporadic use patterns I might not notice in time. So I decided to sit down and write a small script to deal with this problem.

The idea is simple: get the raw number from the CPU, stick it in some form of database, once per day send myself an email with the temperature numbers, preferably in graphical chart format.

Raw Temperature Numbers
-----------------------

Getting the raw temperature number is super simple. All you have to do is read

    cat /sys/class/thermal/thermal_zone0/temp

and you are done. Of course the format of that file is a bit wonky:

    49768

but that can easily be fixed.

RRDTool
-------

[RRDTool](http://en.wikipedia.org/wiki/RRDtool) is one of the fantastic Linux tools. It does one thing, storing time-series, and does it fantastically well. The use case we are interested here, a sequence of temperature measurements, is the most basic use case for RRD. The RRD database for us can be created like this:

    DEST_DIR=/tmp/cputemp
    mkdir -p $DEST_DIR

    rrdtool create $DEST_DIR/db.rrd --step=60 \ 
      DS:cputemp:GAUGE:600:U:U \ 
      RRA:AVERAGE:0.5:1:30 \ 
      RRA:AVERAGE:0.5:2:30 \
      RRA:AVERAGE:0.5:10:144

This will define a simple variable, cputemp, as a gauge. RRD Gauge type is a good fit for temperature because it is an increasing and decreasing quantity, and each measurement is a simple measurement that does not depend on previous results.

We also define 3 averages, one for the last 30 minutes (with 1 minute resolution), one for the last hour (with 2 minute resolution) and one for the last day (with 10 minute resolution).

Once we have the database, we can create a small script:

    #!/bin/bash
    DEST_DIR=/tmp/cputemp
    mkdir -p $DEST_DIR

    TEMPERATURE=`cat /sys/class/thermal/thermal_zone0/temp`
    echo "Measured $TEMPERATURE degrees millicelsius."

    rrdtool update $DEST_DIR/db.rrd `date +"%s"`:$TEMPERATURE
    rrdtool graph $DEST_DIR/cputemp.png DEF:cputemp=$DEST_DIR/db.rrd:cputemp:AVERAGE LINE1:cputemp#FF0000 --width 800

We can invoke this script once per minute from our crontab.

Email
-----

In the same crontab, we can also send ourselves an email once per day with the png attached.

    * * * * * bash measure.sh
    13 13 * * * mail -s "R-PI Monitoring" -a /tmp/cputemp/cputemp.png youremail@example.com < message.txt

Where you can set the `message.txt` to some nice template. Of course, you need to have mail configured, or use an alternative emailing mechanism.
