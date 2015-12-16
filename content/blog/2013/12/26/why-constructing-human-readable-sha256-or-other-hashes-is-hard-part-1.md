+++
date = 2013-12-26T08:15:55Z
title = "Why constructing human readable SHA256 (or other hashes) is hard - part 1"
aliases = [
  "/blog/2013/12/26/why-constructing-human-readable-sha256-or-other--hashes-is-hard-part-1.html"
]
+++
Why constructing human readable SHA256 (or other) hashes is hard - Part 1
=========================================================================

I have been playing around with the idea of making a human readable version of SHA256 hash. It seems like a nice improvement, in theory.

Instead of the hexadecimal representation of the standard ”The quick brown fox jumps over the lazy dog.” example:

    ef537f25c895bfa782526529a9b63d97aa631564d5d789c2b765448c8635fb6c

I was trying to encode it as a sequence of words, for example:

    battery cow chiropractor black duck random europe fun fact sandy

Using real words means that you can easily compare the hash without copy-pasting it. This can be especially important if one of the hashes is not copy-pasteable at all, for example if it is printed on paper.

Encoding a binary number as a sequence of words
-----------------------------------------------

The idea is quite simple. We take a “good” dictionary of “good” words, for example the [Diceware dictionary](http://world.std.com/~reinhold/diceware.html). Then we use these words to encode the SHA 256 hash (or any other binary number). The encoding algorithm is very simple. We treat the 256 bit number as a number in base N where N is the number of words in the dictionary. Each “digit” in base N is one of the dictionary words. Or in code:

    dictionary = <array of strings>
    hash = <the SHA256 hash, as one 256 bit number> 
    N = len(dictionary)
    result = “”
    while hash >= 0:
      result += dictionary[hash % N]
      hash /= N
    print result

Picking a good dictionary is important. One of the basic things the dictionary influences is the length of the resulting sentence. The Diceware dictionary contains 7776 words. This corresponds to 12.9 bits of information. An encoding that uses all 7776 words could encode the SHA256 hash into a sequence of 20 words.

And this is where the problems begin.

Existing work
-------------

Converting binary numbers into words has been done before.

The [PGP word list](http://en.wikipedia.org/wiki/PGP_word_list) is a set of 2 very carefully chosen word lists, 256 words each.

The [S/KEY](http://en.wikipedia.org/wiki/S/KEY) system encodes 64 bit numbers as 6 words taken from a 2048 word dictionary.

[FIPS 181 standard](http://www.itl.nist.gov/fipspubs/fip181.htm) defines a random word generator that generates random “words”, that may or maynot be actual English words.

The problem with PGP wordlist and the S/KEY encoding is that it produces really long results. The canonical foxy example would be encoded as:

PGP (32 words):

    uncut enterprise lockup caravan spaniel Montana slingshot paragraph miser enrollment fracture certify revenge potato commence mosquito reward Galveston backfield getaway sterling stethoscope nightbird repellent seabird glossary crumpled megaton necklace conformist watchword handiwork

S/KEY (24 words):

    CUNY SEAL UP ADAM OWLY LIAR ARGO SCAR HOOT BEER PAD EDNA ELLA CUNY ANTE CHAR AJAR IDEA SLUG GARB ALTO SLUG EDIT AGO

Length
------

20 words is a bit too long. 32 words and 24 words is definitely too long. Very few people could memorize 20 random words, and more words lead to more potential errors. There is some research in this subject, and it has shown that humans can remember 7 (+/- 2) random words on average. So to compare 20 random words, you would need to compare the word lists 4 times, assuming the lower limit of 5 words + a bit of position information and careful comparison. Unfortunately, 20 words is probably the best we can do.

Calculating the number of items in the dictionary we need to encode a SHA256 hash in W words is straightforward.

SHA256 is 256 bits long. A dictionary with `N` words can be used to encode `log2(N)` bits per word. So we have:

    W = 256 / log<sub>2</sub>(N)

or

    N = 2^(256 / W)

So for various values of W we have:

|Words needed for SHA256 (W)|Dictionary size (N)|
|:-------------------------:|:-----------------:|
|20                         |7132               |
|19                         |11 376             |
|18                         |19 113             |
|17                         |34 132             |
|16                         |65 536             |
|15                         |137 271            |
|14                         |319 558            |
|12                         |2 642 246          |
|10                         |50 859 008         |
|7                          |102 116 749 982    |

It’s unlikely we would ever create a dictionary of 102 billion words, which would be required if we wanted to encode SHA256 into just 7 words.

In fact, it’s unlikely we could ever construct a good dictionary of 319 558 words to encode SHA256 with 14 words.

According to Wikipedia, the Oxford English Dictionary in November 2005 [contained about 301000 main entries](http://en.wikipedia.org/wiki/Oxford_English_Dictionary#Entries_and_relative_size) or 18 bits of information. By using all main entries in the OED, we could encode the SHA256 hash with just 15 words.

[A study by a whole bunch of people] found that there are about 1.000.000 words in the English language. 1.000.000 words is 19.9 bits, or 13 words for SHA256.

The problem is that most of these words are low quality.

Quality metrics
---------------

Making sure that we don’t introduce security pitfalls is important. Because hexadecimal representations of hashes are so difficult to compare manually, the comparison is usually done by the computer. While you can make a human error in this process as well, by copy-pasting the wrong hash, it’s unlikely that this would result in a false match.

But because humans are really good at reading words, we are also really good at seeing the words that are [not there](http://www.marcofolio.net/images/stories/fun/other/word_illusion/paris.gif), or [fixing typos](http://www.marcofolio.net/images/stories/fun/other/word_illusion/first_last.jpg), or a bunch of other tricks our minds play with us. Just look at the examples in this [Google query](https://www.google.com/search?q=word+illusions&tbm=isch).

So we need to make sure that the dictionary contains words which are diverse enough that difference between the strings are easy to spot. We can measure this “distinctivness” by measuring the global minimal and average minimal [Levenshtein distance](http://en.wikipedia.org/wiki/Edit_distance). The larger the two numbers, the more distinct the words in the dictionary are.

The words also have to be memorable, otherwise we lose the usability gain. Memorability and distinctiveness are [tied together](http://psycnet.apa.org/psycinfo/2007-06322-000). There is a [huge body of research](http://scholar.google.ch/scholar?hl=en&as_sdt=0,5&q=memory+distinctiveness) about this. We can roughly summarize it as: the more distinctive a word is *from the surrounding context* the more memorable it is. Distinctiveness of a word is hard to measure because it is dependant on the surrounding context, which requires understanding. For example in the sequence: `red white green dog blue yellow`, the most memorable item is `dog`, simply because it is an animal in between colors. However, if all words are unique: `red linux dog button maths car`, it doesn’t help us at all. This is why, even if we could measure context algorithmically, maximizing such distinctiveness would probably lead to the same issues as minimizing it would. Instead, we should focus on avoiding words that are mutually similar and easily confused for one another, like [angel and angle, or rouge and rogue](http://tvtropes.org/pmwiki/pmwiki.php/Main/RougeAnglesOfSatin)

The [Metaphone algorithm](http://en.wikipedia.org/wiki/Metaphone) produces approximate phonetic representations that we can then compare to identify simmilar sounding words in the word list.

To be able to compare the words quickly, you need to be able to read them quickly. [Readability](http://scholar.google.com/scholar?q=readability) is well researched. There are a number of well understood formulas used to compute readability indexes for large texts. The problem is that all of them require sentences and all are researched for English only. We can extract the underlying metrics to adapt this for our needs. Syllable count is a popular metrics in readability. The smaller the syllable count, the more readable a words is. By measuring the maximal and average syllable count, we can have a good overall metrics for any given word list. We can also generate 1000 random SHA256 hashes and treat those as a single large text and compute the readability metrics on that. This is an indirect metric, but still useful.

How to construct a word list with good metrics
----------------------------------------------

So now we have a few metrics we can use to score a word list. As it turns out, all raw wordlists score abysmally low on these metrics. I have tried parsing the [English Wiktionary](http://dumps.wikimedia.org/enwiktionary/20131117/), I have tried parsing books from [Project Gutenberg](http://www.gutenberg.org/), I have tried traditional spellchecking wordlists, and I have tried traditional hacking wordlists. I even tried just constructing wordlists by combining lists of cities, names, animals, plants and so on.

The obvious problem is getting the desired length. It’s super easy to get to around 50.000 words. With a bit of work, like taking the top 100 Gutenberg books, you can get to about 90.000 words. If you add a few lists of cities and so on, you can push that up to 100.000. But this includes “words” like “ahaaaaaaaa”. On the extreme end of this is the Wiktionary, which has millions of “words”, but they are of horrible quality. Indeed, just removing words which contain numbers, non-letter characters, and words with 4 or more consecutive repeating letters, cuts down the Wiktionary list considerably. And the metrics for all these lists are still really bad.

It might be interesting to take a deeper look into various metrics for various lists, but this would sidetrack us from our goal of creating a good wordlist. So I’ll just summarize the most important observations here.

Almost invariably, the global minimal edit distance in a given set of words is 1. Either because of plural forms like “car”/”cars”, or because of “angel”/”angle” like pairs of words. And the average minimal edit distance is not much better. Especially in the Wiktionary list, where it is so close to 1, it might as well be 1.

The syllable frequency is also interesting. It spikes considerably from 50.000 to 90.000 and from 90.000 to 100.000. This is because you have to reach for words like “hexametaphosphate” to fill in the list.

The [original Diceware list](http://world.std.com/~reinhold/diceware.wordlist.asc) also does pretty bad, even though it is relatively short. Just look at the first 12 entries:

    11111 a
    11112 a&p
    11113 a's
    11114 aa
    11115 aaa
    11116 aaaa
    11121 aaron
    11122 ab
    11123 aba
    11124 ababa
    11125 aback
    11126 abase

It also contains such pairs as `“acid”/”acidic”`, `“deal”/”dealt”`, `“hyman”/”hymen”`, `“kink”/”kinky”` and so on. And while these are great if you have to construct a password, they completely screw up the usability when used to encode binary numbers.

The PGP word list however, is awesome. It was designed specifcally to address these problems, and it shows.

What’s next
-----------

So, constructing a good word list is incredibly hard. I tried to construct a good 137 271 item list and failed miserably.

In the next part, I’ll analyze the PGP wordlist and how it scores on a bunch of different metrics and see if I can construct a 8192 word list (13 bits) with similar metrics.
