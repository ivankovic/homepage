---
draft: false
title: "LLMs are not human"
description: "Software Engineering was built by humans for humans. What happens when non-humans get involved?"
date: "2025-04-20"
keywords: [ "software engineering", "llms", "large language models", "failure analysis", "how LLMs fail", "how humans fail", "difference between LLMs and humans"]
layout: "blogpost"
---
## Short, easy to read summary

{{< quote >}} TODO {{< /quote >}}

## LLMs are not human

Ever since ChatGPT took the world by surprise in November 2022, people have been debating if it is
intelligent, sentient, alive, etc. While these are interesting topics to debate, I think one thing
people miss is a related question for which we know the definitive answer: Are LLMs human? And I
understand why it is missed, with its clear answer: "No, LLMs are not human".

My question is:

{{< quote >}} If LLMs are not human, and we are using LLMs to automate Software Engineering, which
principles of Software Engineering are no longer valid? {{< /quote >}}

To answer that question, we need to understand where the limits of human abilities and the LLMs
differ, and the best way to examine that is to look at how humans and LLMs fail.

## How do humans fail?

The engineering field that studies human errors is called [human factor
engineering](https://en.wikipedia.org/wiki/Ergonomics). The limits of humans that are broadly
accepted in the field are:

*  **Cognitive limits** - The short term working memory of a human is about 5 chunks, if it is
   overloaded the human is likely to forget code branches, dependencies that need updating, etc.
   ([Ding et al.](https://journals.sagepub.com/doi/pdf/10.1177/21582440241305082?utm_source=chatgpt.com)).
   We can focus on only one thing. Each time the focus changes, humans pay a context switch cost of
   at least 15-20 minutes of lower performance ([Trebugov et al.](https://dl.acm.org/doi/abs/10.1145/3084100.3084116)).
*  **Sensory limits** - Human eyes get tired after 8 hours of staring into a glorified light bulb.
   ([Beeson et al](https://www.sciencedirect.com/science/article/pii/S2451958824001222?utm_source=chatgpt.com)).
   And although this doesn't necessarily increase the number of errors introduced by the human, it
   does measurably increase the number of errors that slip by the human in processes like code
   review.
*  **Biases** - The long list of logical fallacies and cognitive biases: [anchoring effect](https://en.wikipedia.org/wiki/Anchoring_effect),
   [confirmation bias](https://en.wikipedia.org/wiki/Confirmation_bias), [apophenia](https://en.wikipedia.org/wiki/Apophenia), etc.

## How do LLMs fail?

This is arguably still an open research question and the answer is changing almost daily. But there
are a few well known and commonly observed ways in which LLMs fail:

*  **[Hallucinations](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence))** are
   LLM outputs that are plausible, but are not grounded in reality. Note that hallucinations are not
   necessarily false, and not all false LLM outputs are hallucinations. If the LLM is trained on
   wrong data and it returns this wrong data faithfully, it would not be considered as
   hallucinating, it would just be wrong. The hallucinations are particularly impactful when they
   occur in the reasoning chain.
*  **Degeneration**, commonly experienced as the LLM "repeating itself forever", is the failure mode
   where the LLM falls into a low-diversity space of tokens, repeatedly generating the same tokens
   that then proceed to further push the internal state of the LLM to that same low-diversity space.

## The difference

It is immediately obvious that the human failure modes and LLM failure modes are very different. Of
course humans can also hallucinate, but it's not typically something that occurs in a professional
engineering setting.

And LLMs do not share human cognitive and sensory limits at all. The LLM can keep tens of thousands
of hunks in working memory and can easily focus on multiple things. Indeed, structurally, multiple
attention heads are a basic element of LLMs, and agentic systems that use LLMs can easily spawn
multiple entire LLMs to focus on multiple things.

LLMs do have biases, that is the only limit that is shared. And while they are not exactly the same
they are similar enough. Many LLM degradations are caused by the LLM equivalent of anchoring bias.

## Software Engineering - The science of humans writing good Software

Software Engineering is the science of creating high quality Software while limited by time, money
and human abilities. The last bit is something that was mostly taken for granted in the last 50
years, although in some cases, people did take the time to consider it explicitly. DeMillo, Lipton
and Sayward introduced the "competent programmer hypothesis" back in 1978 in their paper "Hints on
Test Data Selection: Help for the Practicing Programmer". They explicitly consider the human behind
the code. Before them, DeRemer and Kron in their 1975 paper "Programming-in-the-large versus
programming-in-the-small" also consider how the modeling of a computer system should explicitly
follow not just individual human limits, but the limits of humans working in groups. But the vast
majority of research papers are not so explicit, and as papers build on top of other papers the
underlying assumptions can be long forgotten in the subsequent decades.

Let's look at how some of the fundamental principles of Software Engineering only really exist
because of some human limits:

*  **"Don't repeat yourself" or DRY principle** - Repeating information and code in the system
   causes long term costs because it is simply more code to maintain and bugs can slip through when
   the code is being updated. However, this depends on the underlying assumption that humans have a
   cognitive load limit and that going over this limit is likely to cause human errors.
*  **"Separation of concerns"** - Coined by Dijkstra in the 1974 paper "On the role of scientific
   thought", it even explicitly discusses "focusing one's attention upon some aspect", which is a
   very human concern.

Indeed, it is hard to come up with an example of a principle or best practice in Software
Engineering that isn't because of a human limit.[^1]

## What does this mean for software engineering?

Us engineers should answer the following research questions:

1.  **If the AI can produce any code on demand, is it necessary to have modules and dependencies
    anymore?** - Why bother with package management, versioning, supply chain management, API
    incompatibilities and other problems caused by the dependency hell if you can just ask the AI to
    implement exactly the functionality you need in your codebase? In other words, to the basic
    principles of modularity and separation of concerns need to be reconsidered?
1.  **If the AI context is big enough that entire documentations can be sent to the AI with every
    request, and the AI is able to perfectly recall every interface detail, are abstractions
    necessary anymore?** - Do we need to build more abstract APIs that hide complex interactions of
    more and let the AI do the rest? Is the principle of abstraction still relevant?
1.  **Can the AI just be given data access directly? Do we need encapsulation?** - We don't need to
    protect "internal state" of objects or enforce loose coupling if the AI can just couple with the
    entire dataset at once.
1.  **Is "Keep it simple, stupid" still relevant if only the AI is going to read the code?** - Can
    we ask the AI to build hard to read but more robust code? What would happen if, for example, we
    ask the AI to start every single function with an exhaustive list of validity checks for inputs?
    All of us were taught to do this, and we all generally agree it would be a good idea but nobody
    does it because it takes far to long to write and produces unreadable, unmaintainable code.
1.  **What types of tests do we need if the AI can just generate entire categories of tests
    perfectly every time?** - Developers write a lot of automated tests that AI can just
    replace[^2], do we still need to write those? And if not, do we need to write some other tests
    now?

## Footnotes

[^1]: I find it interesting that in contrast, Computer Science, the more mathematical pursuit of
algorithms and data structures typically doesn't care if the human is present or not and is largely
unaffected by the recent advancements in AI.

[^2]: If you permit me the faux-pas of citing my own paper: [What Types of Automated Tests do
    Developers
    Write](https://conf.researchr.org/details/ast-2025/ast-2025-papers/6/What-Types-of-Automated-Tests-do-Developers-Write-)
