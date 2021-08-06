---
date: 2020-07-05T14:57:34+02:00
title: "Čišćenje pretinca elektroničke pošte korištenjem Google Apps Scripta"
description: "Kako jednostavno maknuti tjednike i ostale pretplate iz preticna eletroničke pošte"
tags:
  - scripting
  - automation
series: []
type: "blog"
---

U zadnje vrijeme sve više i više koristim Email pretplate umjesto društvenih
mreža. Umjesto da svaki dan otvaram Reddit ili Twitter, jednostavno se pretplatim
na izvore kvalitetnog sadržaja i svaki dan me u Emailu dočeka par mailova. Izgled
mailova je uvijek isti, gumbi za navigaciju su uvijek na istom mjestu a i sadržaj
je donekle bolji jer je unaprijed ograničen samo na ono što me zanima.

Međutim ponekad nemam vremena za pročitati sve poruke, a dobar dio pretplata je
dnevni. Zbog toga se ponekad nakupi dosta nepročitanih poruka. Na sreću, koristim
G Suite za svoj Email, pa mogu koristit Google Apps Script.

Sljedeća skripta arhivira sve poruke u "Forums" kategoriji u Gmailu:

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

Sve što sad moram raditi ručno je pomicati pretplate u "Forums" kategoriju. Nakon
2 - 3 ručno pomaknute poruke AI nauči moj odabir i sve daljnje poruke automatski
završe u "Forums".
