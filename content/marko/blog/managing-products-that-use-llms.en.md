---
draft: true
title: "We need to learn how LLMs fail"
description: "Lessons learned from 6 years of managing projects that use LLMs for their core functionality."
date: "2025-02-16"
keywords: [ "software engineering management", "llms", "large language models", "software management", "failure analysis", "how LLMs fail"]
layout: "blogpost"
---
# Short, easy to read summary

LLMs change how software fails. We spent the last 50 years learning how to build software that
doesn't fail. This knowledge is no longer useful. We need to experience, learn and teach others
how software that uses LLMs fails. This will take time.

# Why you should trust me?

I have been working on LLMs for code for the alst 6 years. Back in the days before ChatGPT. The model
that first caught my attention was the [code2vec](https://code2vec.org) model, way back in 2019. It
was a much simpler, tiny model compared to the current generation of models, but it did already provide
a glimps of what the future would bring. Of course, the tiny model that it was, it didn't actually
perform well enough to be used in a product, so we quickly moved to a different model, this time based
on [BERT](https://en.wikipedia.org/wiki/BERT_(language_model)). This model was actually viable, but
it took several years of care and work on the training data, re-training ever better version of the
model and moving to [T5X](https://github.com/google-research/t5x) before we were finally able to
reach quality that could be used in production in a real product. The product in question was
[automated code review](https://dl.acm.org/doi/pdf/10.1145/3664646.3665664).

