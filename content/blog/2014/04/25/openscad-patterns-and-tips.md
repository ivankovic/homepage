+++
date = 2014-04-25T22:00:00Z
title = "OpenSCAD patterns and tips"
aliases = [
  "/blog/2014/04/25/openscad-patterns-and-tips.html"
]
+++
OpenSCAD patterns and tips
==========================

I recently started playing around with [laser cutters](http://www.ivankovic.me/blog/2014/02/15/laser-cut-raspberry-pi-case-with-camera-mount-version-1.html) and 3D printers. So far, I have learned two major lessons: my [material science](http://en.wikipedia.org/wiki/Materials_science) knowledge is lacking and [CAD](http://en.wikipedia.org/wiki/Computer-aided_design) tools are not as advanced as Iron Man would have you believe.

After a bit of searching and trying out, I ended up using [OpenSCAD](http://www.openscad.org/index.html) because it fits my programming soul. As with any other programming language, you quickly learn that there are patterns and anti-patterns, so here’s my list of OpenSCAD patterns and tips.

OpenSCAD patterns and tips:
---------------------------

  1. **Design elements in isolation**. Think about how the element will fit in the assembled object, but don’t let that influence the parameters of the element itself. Most importantly, assign priorities to axes and stick with it in all your designs. For example, if you are building the left side of a box, design it as if it was the front side. This helps immensely with [constructive solid geometry](http://en.wikipedia.org/wiki/Constructive_solid_geometry) of more complex shapes. It’s also much easier to layout the elements for cutting if they are all in the same plane already.

  2. As a corollary of 1., **Let the more complex module worry about submodule placement**. Never fix positioning of a submodule (for example one side of the box) by modifying the submodule, use rotation and translation in the supermodule. This makes it much simpler to have different views, like assembled view, print view, exploded view and so on.

  3. **Test your assembled view for overlap**. If you have overlap in the assembled view, your model is obviously physically impossible (unless you use some weird material that allows for quantum superposition). I have this handy script in a module called `testing.scad` and include it for this purpose:

    module test_overlap() {
      if ($children > 1 ) {
        for (i = [0 : $children - 2]) {
          for (j = [i + 1 : $children - 1]) {
            intersection() {
              child(i);
              child(j);
            }
          }
        }
      }
    }

Note that in the above code I use `child()` and not `children()` because the current stable OpenSCAD version (2013.06) still uses `child()`.

  4. **Add a small epsilon value to differences**. Otherwise you are left with a plane of width 0 that can interfere with 3D printing. If you follow tip 1. this epsilon value will almost always be used in the same axis (in my case Y, but to each his own).

  5. **Define a variable called exploded and use it in design view**. Translate all pieces by a multiple of exploded in a direction that makes sense for that piece. This makes it very easy to switch from exploded to assembled view.

  6. If designing for a laser cutter, **define a variable called thickness** and make sure that changing the thickness of the material doesn’t screw up the design. Use the `test_overlap` function from 3. to do this.
