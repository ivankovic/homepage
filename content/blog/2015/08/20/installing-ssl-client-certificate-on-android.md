+++
date = "2015-08-20T01:08:07+02:00"
title = "Installing SSL client certificate on Android"
+++
Installing SSL client certificate on Android
============================================

This is just a quick tip for anyone who is trying to install client SSL certificates on Android devices.

First, make sure you follow [this Google support page](https://support.google.com/nexus/answer/2844832?hl=en). Pay particular attention to the file *extension*. If you have a [PKCS 12](https://en.wikipedia.org/wiki/PKCS_12) formatted file, it **must end in `.p12`**.

Next, make sure you download the certificate on the internal memory. Google Drive, Dropbox, your own personal cloud or any other network storage *will not work*. And the worst thing is, it will look like it works since you can select the folders in the file chooser, and it doesn't give you any errors. But the certificate files will be *greyed out and you will not be able to select it*!

Last, **don't click on any shortcuts in the file chooser**. Go through "Internal Storage" -> "Downloads". Otherwise the certificate file will simply be greyed out and you will not be able to select it!!

So there's that. I spent waaaay to much time figuring this one out. I'm leaving the note here in the hope that some other poor soul will find it in their hour of need.
