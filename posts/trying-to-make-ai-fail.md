For the last few weeks I've been doing contract AI evaluation work with Handshake AI. When I explain it to people it sounds kind of fun. Try to find where a strong AI model goes wrong. That's the job.

It was not that simple. It ended up being one of the most humbling stretches of work I've done, and a lot of what I learned has more to do with data science than with AI.

![A person at a desk at night working through a series of prompts on a laptop, with an AI chat window on a large screen beside them](assets/ai-eval-prompts.jpg)
*Image generated with ChatGPT, for illustration.*

Quick note before I get into it: I'm keeping the details of the actual work vague on purpose. What I want to share is the way of thinking and the testing habits I picked up, because those apply way beyond this one job.

## The short version of the job

Build challenges that push a model to its limits, where the model has to reason its way to a correct answer. The catch is that a challenge only counts if it's completely fair. A real expert should be able to solve it with what's in front of them, there should be one clear right answer, and nothing can be rigged or hidden to trick the model.

That last part is the whole game. Anyone can confuse a model with a trick question. Making it fail on a fair one is a different problem.

## Why it was so hard

Here's the thing that took me way too long to accept. The fairer and clearer you make a challenge, the easier it gets for a careful model to solve. Being fair means everything that matters is right there in front of it. And good models pay attention.

Some other things that made it rough:

- The one time I got a model to slip early on, it didn't count. I had leaned on something that crossed the line from "hard" into "unfair," and the review caught it. Fair enough. A model failing means nothing if the test itself isn't legit.
- I fooled myself more than once. I thought some designs worked, and then realized I'd been checking them against an outdated version of my own answer. Not my proudest moment.
- The near misses kept coming. Round after round felt close, and none of them crossed the bar.

I'll be honest about the personal side too. I went all in for about twelve days straight and my sleep and time outside took a real hit. Getting accepted, paid work was also a lot harder than I expected, which made the grind feel heavier. At some point I decided to cap my hours and put more of that energy back into job applications and my own projects. I think that was the right call.

## The techniques that actually helped

I never got the win, but my process got a lot better. These are the habits I'd take into any job that involves testing a model, a pipeline, or honestly any system where you think you know the answer.

### 1. Test blind before you ship

The person (or process) checking the work should never see the answer key. If I could see my own expected answer while checking, I'd unconsciously read it into the results. So every check ran with only the materials a real solver would get. If it still landed on my answer, the challenge wasn't hard enough. If it didn't, I had to figure out why before doing anything else.

### 2. Before blaming the model, blame the question

When results disagreed with my answer, my first instinct was "the model got it wrong." Most of the time the real problem was that my wording allowed more than one reasonable reading. Ambiguous questions produce messy answers, and that tells you about the question, not the reasoning. I started treating every disagreement as a possible spec bug first.

### 3. Change one thing at a time

This sounds obvious and I still didn't do it at first. I'd tweak three things, see a different result, and have no idea which change mattered. Once I started keeping everything fixed and changing a single rule or detail per round, the picture got clear fast. It's basically an A/B test on your own work.

### 4. Pull pieces out and see what breaks

For every part of a challenge, I'd ask: if I remove this, does the answer change? If it doesn't, that part is decoration. It might look important, but it isn't doing any work. This is the same idea as an ablation study in ML, and it's the quickest way to find out what actually drives an outcome.

### 5. Read before you guess

Instead of inventing trick after trick, I started reading published research on where models tend to reason poorly. A couple of patterns kept showing up. Models can miss it when two rules interact but neither one mentions the other. They can also trust an obvious surface pattern in the data over the more careful reading. Starting from known weak spots beat guessing every time.

### 6. Keep a failure log

Every attempt went in a running log: what I tried, what happened, and why I thought it happened. It's boring, and it saved me from repeating dead ends more than once. It also made it easy to see patterns across attempts that I'd never have noticed round by round.

### 7. Watch for leaks in your own setup

Partway through I found a gap where my own checks could accidentally see information they shouldn't have. That made some results look better than they really were. Once I isolated everything properly, a few "wins" disappeared. Same lesson as data leakage in a model: if your test can peek at the answer, your score is lying to you.

### 8. Use a checklist before every submission

- Can someone else reproduce my answer from the materials alone?
- Do independent checks agree with each other?
- Does a lazy, surface-level approach get a different answer than a careful one?
- Is every fact that decides the answer actually available?
- If someone gets the main call wrong, does it clearly show in the rest of the result?

### 9. Keep the instructions plain

I stopped writing step-by-step instructions and kept each prompt short, neutral, and focused on the real-world decision. If a challenge was hard, it had to be because something was easy to overlook, never because I hid information or phrased it to mislead.

## How it ended

Over time my own testing got pretty reliable. It started lining up with the official results, which is honestly what I'm proudest of.

But across dozens of attempts, no fair and honest design beat the strongest models. My last one combined every weak spot I'd found, and it still got solved, with the model explaining how it avoided each trap. Kind of impressive, even if it wasn't what I wanted.

So the goal changed. Instead of "beat the model," it became "explain why this might not be possible here, and leave behind a method someone else can reuse." My takeaway is that when a test is truly fair, everything needed is in front of the model, and a careful model reads it and uses it. I'd call that a well-supported pattern, not a proof.

> A negative result is still a result, as long as you document it carefully and are upfront about its limits.

## What I'm taking into data science work

This is the part I actually care about, because none of it is really about AI evaluation:

- Your result is only as good as your validation. Stale reference answers and leaky test setups give you false confidence, the same way data leakage makes a model look better than it is.
- When things disagree, check the question first. A lot of "model errors" are really spec errors.
- Change one thing at a time. Controlled comparisons teach you more than rebuilding from scratch.
- Pull pieces out one by one to see what actually matters.
- Failures that repeat are the interesting ones. Random one-off slips don't tell you much.
- When you write up findings, lead with the answer, then the evidence, then the limits.
- Put a time limit on open-ended problems before they start eating your sleep. I learned that one the hard way.

I didn't get the win I was chasing. I did come out of it knowing a lot more about how to test a model honestly, and that's something I want to keep doing in my next role.
