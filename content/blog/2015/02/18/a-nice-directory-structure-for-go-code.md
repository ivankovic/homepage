+++
date = 2015-02-18T20:59:50Z
title = "A nice directory structure for Go code"
+++
A nice directory structure for Go code
======================================

I recently discovered the wonders of [Go](https://golang.org). I have been using it at work, on the Raspberry Pi and to solve competitive programming problems on [Project Euler](https://projecteuler.net/profile/markoivankovic.png). I even tried out my hand at [open sourcing](https://github.com/ivankovic/go-competitive) some Go code on GitHub. And I found it really really fun to use in all these situations.

One of the things I like the most about Go is how easy it is to reuse code across projects. The `go get` and `go install` commands are the best thing since distributed version control systems were invented and the automatic import fetching is just crazy.

However, I did struggle with one thing initially. Because Go depends a lot on the path structure of your workspace(s?) it was not immediately clear to me what workspace structure would work best for such an eclectic collection of projects. But I think that now I have found one that works really really well.

Number of workspaces
--------------------

The obvious first question is: "One workspace per project or one big global workspace?". I have found that one big global workspace is a much better choice here. Unless you have other requirements that would force you to have a clean separation between sets of projects, for example having to separate work and private code, there are only upsides to having one global workspace.

It makes code reuse easier: You have one version of code and that one is used everywhere. No need to cross-import common code.
It reduces mental overhead: No need to keep track of which workspace you are in. There's only one.
It reduces management overhead: Just one root directory to back up, just one root directory to secure.

Directory structure
-------------------

Let's remind ourselves of the directory structure Go already has built in:

  1.  Source code lives under `/src`.
  2.  Compiled binaries live under `/bin`.
  3.  Package objects live under `/pkg`.
  4.  The package name (that appears on the first line of each go file) must be the **last** element of the package path, unless the file is an executable command in which case it must use `package main`.
  5.  All files in one package must use the same package name.
  6.  If the import path starts with `<location>.<vcs>/`, where `<vcs>` is one of `.bzr`, `.git`, `.hg` or `.svn`, then Go will use the appropriate version control system to fetch the repository from `<location>`. Note that `<location>` in this context is usually of the form `<domain>/<path>`.
  7.  For the 5 popular built-in repositories a custom shorter syntax is built-in.

The built-in repositories are interesting here because we either need to follow their structure or live with inconsistencies. Luckily the structure they use is really good and we can easily copy it for all our code. The built-in repositories almost all use the following structure: `<domain>/<username>/<project>/`, with the exception of `code.google.com` that doesn't have the `<username>`. 

What is really cool is that we can have almost the same structure with other repositories. The only thing you need to do is choose the level of granularity for you version control system. If you have multiple users and wish to give each user exactly one repository, you would use the following structure: `<domain>/<user>.<vcs>/<project>`. If you want each user to have one repository per project, you would use the following structure:
`<domain>/<user>/<project>.<vcs>/`. If you just want one giant repository, you can use `<domain>/.<vcs>/`.

This leaves just one thing: local files. I find it helps to have a `local/` path that mostly contains just one file `main.go`. Whenever I need to script a one-off real quick, I just modify this file, run it and move on. Very rarely, I'll `cp` that file and have `main2.go` and so on.

Packages
--------

Because each time you import something you need to type the whole path, I strongly recommend you limit the subpackage depth. Since you always have `<project>` as part of your path, usually you can just have all packages directly in the project directory. If you need subpackages, consider instead extracting them into a separate project. After all, you might reuse them somewhere else!

Real example
------------

This is the current structure of my Go workspace:

    workspace/
             | bin/
             | pkg/
             | src/
                  | github.com/ivankovic/go-competitive/<packages>/*.go          
                  | ivankovic.me/
                                | projecteuler.git/*.go
                                | swarm.git/<packages>/*.go
                  | local/main.go

That's all there is to it.

