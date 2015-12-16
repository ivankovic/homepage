+++
date = 2013-01-16T20:37:00Z
title = "Nanoc and App Engine"
aliases = [
  "/blog/2013/01/17/nanoc-and-app-engine.html"
]
+++
Nanoc and App Engine
====================

You can get away with a lot these days just by using static sites. Or just by using client side scripts. A lot of services out there cover the basic things a website should have. Need comments? Social networks! Need visitor metrics? Google Analytics! And static website generators are really good now. I recently decided to use [nanoc](http://nanoc.stoneship.org/) to make a small website. And it is simple, fast and works really well with Vim.

Another thing you can do these days, if you have a small enough site, is host it for free. Google [AppEngine quota](https://developers.google.com/appengine/docs/quotas) is pretty good. Most important for static sites is the 1GB/day upload and 1GB/day download quota. Fantastic for a small site (and if you have a big site, you can always start paying a bit more).

So, how difficult is it to get nanoc and AppEngine to play nice together? Easy. You can get a nanoc compiled site up and serving from AppEngine in minutes. Starting from a totally new nanoc site, you just need to follow this tutorial.

Create a new nanoc item by creating “app.yaml” in the nanoc content directory. This is your usual AppEngine app.yaml. Open the newly created file and put in the default metadata:

    application: <app_ID>
    version: 1
    runtime: python27
    api_version: 1
    threadsafe: true

    handlers:
    - url: /
      static_dir: website

Since we have a completely static site, we will use the built-in AppEngine static handler for almost everything.

Next we need to make sure the app.yaml file is copied every time we compile the site. To do this, add the following to Rules file:

    compile '/app/' do
      # GAE, don't filter or layout
    end

    route '/app/' do
      '/app.yaml'
    end

Now when you compile the site, the `app.yaml` file will always be copied to your output folder.

Now we need to modify the Rules file so that it puts the website in the static directory of the AppEngine app. This is super simple:

    route '/' do
      '/website/index.html'
    end

    route '*' do
      if item.binary?
        # Write item with identifier /foo/ to /foo.ext
        '/website' + item.identifier.chop + '.' + item[:extension]
      else
        '/website' + item.identifier.chop + '.html'
      end
    end

At this point, you can compile your site and actually run it on AppEngine! Try it out with the development server. On of the things you might notice is that if you go to [http://localhost:8080/](http://localhost:8080/) you will get an error. This is because the AppEngine static_dir handler maps the files with their full name. So you have to go to [http://localhost:8080/index.html](http://localhost:8080/index.html) to get to your site. So let’s fix that. Open up the app.yaml file and add the following:

    application: <app_ID>
    version: 1
    runtime: python27
    api_version: 1
    threadsafe: true

    handlers:
    - url: /
      script: redirector.app

    - url: /
      static_dir: website

This will make the naked root url (http://localhost:8080/) handled by the redirect app. Which we are going to write right now! So you create a redirect.py file in the nanoc content directory with the following content:

    import webapp2

    class MainPage(webapp2.RequestHandler):
      def get(self):
        self.redirect('/index.html') 


    app = webapp2.WSGIApplication([('/', MainPage)],
                                  debug=True)

This is a simple webapp2 app that will handle any request made to the ‘/’ path and redirect to ‘/index.html’ by returning a HTTP 302 response. This is a simple and effective way of doing the redirect, and is according to the standard. You might be wondering, well what about other urls, like “/fake.htm” or “/non-existent.html”. Although we could make an app that would handle those cases as well, I think it is far better to let AppEngine return HTTP 404 for them. Because, they really are not there, and 404 is more appropriate than an redirect.

Now to add some Rules to make the redirect.py file end up in the fight place:

    compile '/redirector/' do
      # GAE, do not touch
    end

    route '/redirector/' do
      '/redirector.py'
    end

And that is it. You can now go and host your nanoc compiled site on AppEngine!

(Optional) Make sure you do not auto-prune *.pyc files. I managed to cause the AppEngine development server to have a fit when nanoc purged the compiled python files. In config.yaml, look for the “prune:” section. In there, add ‘.pyc’ to the “exclude:” list.
