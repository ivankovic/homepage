+++
date = 2011-03-26T10:16:00Z
title = "Can JavaScript getTime() be used for measuring performance of JavaScript code"
aliases = [
  "/blog/2011/03/26/research-results-can-javascript-gettime-be-used-for-measuring-performance-of-javascript-code.html"
]
+++
Can JavaScipt getTime() be used for measuring performance of JavaScript code?
=============================================================================

Recently, during research for my masters thesis I had to answer the question “Can we use JavaScirpt `getTime()` function in our benchmarks and get portable benchmarks that are valid?”.

For the tl;dr crowd here is a short answer: Yes on Linux (and OS X **probably**) - not really on Windows.

After some research on the Internet, I found [this blog post](http://ejohn.org/blog/accuracy-of-javascript-time/) from 2008. by John Resig that explores this issue. He concludes that `getTime()` is basically useless on Windows XP irregardless of browser choice, while being safe to use it on OS X. I wanted to update his results to 2011 and explore the issue a bit more.

My goal was to measure the precision and not the accuracy (the difference is nicely explained in [this Wikipedia article](http://en.wikipedia.org/wiki/Accuracy_and_precision)) of the `getTime()` function. We could do *some* analysis of accuracy, but opt not to because it’s not so easy to setup a good experiment for accuracy. Precision on the other hand is nicely quantified in terms of the standard deviation of the experiment. **Smaller standard deviation is better**. The best possible outcome would be for the results to follow a very narrow Gaussian distribution.

The setup
---------

The code for most benchmarks in JavaScript can be summarized in these three lines:

    var start = (new Date).getTime()
    doStuff()
    var diff = (new Date).getTime() - start

so this is the scenario I decided to test. The obvious question of course is what to use as a sample load. It’s important for the test load to have deterministic duration that can be easily controlled, and is too complicated for the browser to simply optimize away. A nice way to do this is to have a `O(n^2)` math function that does some of the slowest operations, such as the modulus operation. I used the following code:

    function sample(size) {
      var result = 0;
      for (var i = 0; i < size; i++) {
        innerSample(i, result);
      }
    }

    function innerSample(i, result) {
      result = i * i + i + (0x09F91102 % i) / 2;
      for (var j = 0; j < i; j++)
        result = (result * result) % (0x09F91102);
      return result;
    }
 
The reason it’s split in two is because I had a pre calibration step first. Since we are not interested in comparing relative browser speeds we do not need to use the same number of iterations of the sample function on all browsers. What would be much better is to have the same *duration* on all browsers. This is why, before testing, I run a pre calibration step that determines the number of iterations I should use so that the average duration of one sample is a bit under 75ms. Since we are not measuring accuracy a rough estimate will do just fine, as long as the duration is long enough so as to allow for anomalous shorter run times.

This completes the setup.

The experiment
--------------

The experiment is performed by looping 500 times over the sample code with the pre calibrated number of steps. After that the standard deviation is calculated. This is repeated a few times if possible to see if the results are stable.

The results
-----------

I tested Firefox 3.6 and 4.0 and Chrome 9 and 10 on Linux (Arch Linux 2.6.37 kernel), Windows XP fully patched and Windows 7 fully patched. I did run the Linux test on four machines: an Intel i3 desktop, two different Core2Duo laptops and Atom netbook and the results did not differ significantly. This shows that the hardware itself does not influence the tests. As for the Windows tests, I don’t even own a Windows box so I used volunteer help for those tests (if you were one of these unfortunate “volunteers” I am so so sorry, I promise not to spam you all again). They were run on a wide variety of machines. There were **significant** variations on Windows machines, these are analysed below.

Mac OS X is omitted because I do not have access to a Mac OS X machine at the moment. In future the results will be appended. I also plan to include Opera and Safari. What will never be included is Internet Explorer, for two reasons: the script runtime limit in Firefox and Chrome is based on actual *time* whereas IE limits the number of operations you can execute between events (MSDN site sets the limit as ~5.000.000 operations) and, more importantly, you can switch off the runtime limit in Firefox and Chrome.

The results were pretty much consistent with the previous results from 2008. Here is a summary table of standard deviations:

|Browser    |Linux|Windows XP|Windows 7      |
|:---------:|:---:|:--------:|:-------------:|
|Firefox 3.6|0.5ms|6.8ms     |[1.2ms, 7.3ms] |
|Firefox 4.0|0.4ms|37.4ms    |[3.6ms, 7.9ms] |
|Chrome 9   |1.2ms|12.7ms    |[4.7ms, 17.3ms]|
|Chrome 10  |1.7ms|33.8ms    |[4.9ms, 19.7ms]|

As you can see from the results, Firefox on Linux is the most precise with only 0.4 ms of deviation on 75ms test load. Chrome works OK on Linux too. It’s worse than Firefox but still excellent. The results on Linux were stable across many different machines and are quite good. I did not test it against older kernels, but I don’t think this is a major problem since all major Linux distributions do have up-to-date kernels.

This is a normalized graph of all 4 browsers on Linux. The X-axis values are omitted on purpose since each series is normalized so that the smallest value is 10. Since we are not interested in accuracy this gives a nicer and equally valid image:

![Results for 4 browsers on Linux](http://chart.apis.google.com/chart?cht=bvs&chs=632x474&chxt=x%2Cy&chxl=0%3A%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C&chdlp=r&chdl=Firefox%203.6%7CFirefox%204%7CChrome%209%7CChrome%2010&chco=3399CC%2C80C65A%2CFF0000%2CFFCC33&chxr=1%2C0%2C326&chbh=a&chd=e%3AAAAAAAAAAAAAAAAAAAAAAM2kDuAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAA%2CAAAAAAAAAAAAAAAAAAAAen..CWAlAZAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2CAAAAAAAAAAAAAAAAAAAAw3J0AMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2CAAAAAAAAAAAAAAAAAAAA9odoDiA-AMBkAAAMAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM)

As you can see the results are neatly packed with more than 95% of results packed in a 2ms range.

The results on Windows were much more inconclusive. You will notice that the results for Windows 7 are given as intervals. This is because the results varied wildly between different machines. The results were quite stable on any given machine, so it’s not an artifact of the experiment itself. If you look at the best results, they are larger than on Linux, but still usable: 4.9 ms is not that bad. It’s an order of magnitude bigger than 0.5, but still usable. In my personal opinion (since extensive tests should be done for a stronger result) good results on Windows were rare. Only 2 out of 10 Windows 7 machines produced good results. A typical distribution for a Windows machine is displayed below:

![Results for Chrome 10 on Windows 7](http://chart.apis.google.com/chart?cht=bvs&chs=632x474&chxt=x%2Cy&chxl=0%3A%7C70%7C71%7C72%7C73%7C74%7C75%7C76%7C77%7C78%7C79%7C80%7C81%7C82%7C83%7C84%7C85%7C86%7C87%7C88%7C89%7C90%7C91%7C92%7C93%7C94%7C95%7C96%7C97%7C98%7C99%7C100%7C101%7C102%7C103%7C104%7C105%7C106%7C107%7C108%7C109%7C110%7C111%7C112%7C113%7C114%7C115%7C116%7C117%7C118%7C119%7C120%7C121%7C122%7C123%7C124%7C125%7C126%7C127%7C128%7C129%7C130%7C131%7C132%7C133%7C134%7C135%7C136%7C137%7C138%7C139%7C140%7C141%7C142%7C143%7C144%7C145%7C146%7C147%7C148%7C149%7C150%7C151%7C152%7C153%7C154%7C155%7C156%7C157%7C158%7C159%7C160%7C161%7C162%7C163%7C164%7C165%7C166%7C167%7C168%7C169%7C170&chdlp=r&chdl=Frequency&chco=3399CC&chxr=1%2C0%2C51&chbh=a&chd=e%3ACgBQDwBQBQBQAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKCIyPDZF0s8O-uyL..zcr6tKoJc2X1IyMiDwAABQAABQAABQBQAABQAAAAAAAABQ)

This chart was produced on Chrome 10 tested on Windows 7. Interesting observation is that the first few measurements were on the 75ms mark, but the execution slowed down afterwards moving the median value up to 125ms. This slow down was not accounted for or explained. It’s left as an open question.

The conclusion
--------------

Using `getTime()` on Linux in the manner described here is *valid* on both browsers. Using `getTime()` on Windows will give some results, but you can never be sure that another user will be able to repeat them on his machine.

One possible reason for Windows is that the precision of the `GetSystemTime` system call is in the 10ms - 16ms range. This however does not explain why sometimes the results of Windows were good. Or help us to deal with benchmarks on Windows.

The future
----------

These results are a good start but there is much room for expansion. If time permits I plan to answer some of these questions in the future: How does the standard deviation behave on longer loads, say 1000ms? What are the possible factors affecting precision on Windows? How do other browser place? Do Windows results follow a pattern? Can some results be discarded and attributed to “start up” problems? Test on more machines

Code
----

The code used can be found on [GitHub](https://github.com/ivankovic/cccm-benchmark). There is also a [GitHub Page that can be used immediately](https://github.com/ivankovic/cccm-benchmark).
