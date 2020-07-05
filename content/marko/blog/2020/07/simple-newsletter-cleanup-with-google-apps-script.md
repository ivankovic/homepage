---
date: 2020-07-05T14:57:34+02:00
title: "Simple newsletter cleanup with Google Apps Script"
description: "How to remove old newsletter emails quickly using GAS."
tags:
  - scripting
  - automation
series:
type: "blog"
---

I have recently started to switch more and more of my content consumption to
email. Instead of using any social network, like Reddit or Twitter, I subscribe
to newsletters directly. This has worked great so far. Every day, I get the hot
news from news outlets like BBC, and every few days I get more creative or long
form content like XKCD scripts, delivered directly to my inbox.

However, I am not always interested in cosuming the content, and I also don't
really want to spend time cleaning up my email when I read something. Luckily,
I am using G Suite for my email, so there is a very simple solution for this. I
can set up a Google Apps Script that will keep my Inbox clean for me.

Go to [script.google.com](https://script.google.com) and create a new project.
This should open the script editor. Put the following code in the editor:

```javascript

function cleanUpOldNews() {
  var cutoffDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  Logger.log(cutoffDate);

  var query = 'in:inbox category:forums before:' + cutoffDate.getFullYear() + "/" + (cutoffDate.getMonth() + 1) + "/" + cutoffDate.getDate() ;
  Logger.log(query);

  var threads = GmailApp.search(query);
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    thread.moveToArchive();
  }
}
```

Save this and go to the project overview. Create a daily 6AM trigger that calls
cleanUpOldNews().

Now all you have to do when you recieve any newsletter is to drag and drop it
into the Forums category in Gmail. After about 2-3, ML will catch up and start
categorizing it automatically.
