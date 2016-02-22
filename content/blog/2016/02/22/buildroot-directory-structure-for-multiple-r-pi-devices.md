+++
date = "2016-02-22T01:14:28+01:00"
title = "Buildroot directory structure for multiple R-Pi devices"
+++
Buildroot directory structure for multiple R-Pi devices
=======================================================

I have been experimenting with embedded Linux builds on my R-Pi devices for quite some time now. There are at least 3 ways you can do that:

1.    [Linux From Scratch](http://www.linuxfromscratch.org/) - Very good for educational value, almost meaningless for multiple devices since it is completely manual and hard to reproduce
2.    [Yocto Project](https://www.yoctoproject.org/) - Linux foundation project aimed at enabling embedded Linux developement. But it offers a lot more than that and can deal with any target size from tiny (1 package extremely specific use case) to "too much" (100 packages, basically a full distribution for all intents and purposes). Unfortunately as a side-effect it also has a steep learning curve and just feels bulky.
3.    [Buildroot](https://buildroot.org/) - Makefile, menuconfig based simple and efficient tool. It still has a learning curve, but perhaps not as steep as Yocto. And it just feels more elegant.

As you might have guessed, after trying them all out, I went with Buildroot and have been using it now for 3-4 months.

Buildroot
---------

The [Buildroot documentation](https://buildroot.org/downloads/manual/manual.html) is reasonably well done and Buildroot [supports Raspberry Pi](https://git.busybox.net/buildroot/tree/board/raspberrypi) 1 and 2 out of the box.

What is less clear however is the directory structure one should use for multiple devices. Now, it's important to note that normal workflow for Buildroot is to clone the Buildroot Git repo, run `make menuconfig` and `make` and so on, and then your image and other results can be found in `./output`. Obviously, if you need different images on different devices using the normal workflow would imply multiple clones of the Buildroot depo for no good reason.

The key to a good directory structure is actually in the manual, but it is very easy to miss! The feature is called ["out-of-tree" build](https://buildroot.org/downloads/manual/manual.html#_building_out_of_tree) and what it does is basically enable you to change the output directory from `./output` to something else. As a nice usability bonus, it also creates a small Makefile wrapper in the "out-of-tree" output directory to avoid the need for passing the directory as an environment variable all the time.

Directory structure for multiple devices
----------------------------------------

"out-of-tree" builds allow for the following structure:

    rpi/
       | buildroot/
       | device-1/
       | device-2/
       | device-3/

Which conveniently allows the use of the same Buildroot source tree from each device-X directory.

Sensitive material sidenote
---------------------------

Another thing you should also consider is to store all cryptographic or otherwise sensitive material completely out from the project structure and move it to an encrypted USB. When you are not actively building the images, there's no need to store that material on the machine.

You can then easily use [post-build scripts](https://buildroot.org/downloads/manual/manual.html#rootfs-custom) to copy the material to the image and [post-image scripts](https://buildroot.org/downloads/manual/manual.html#_customization_emphasis_after_emphasis_the_images_have_been_created) to copy the image on an SD card and delete the material away from the workstation.
