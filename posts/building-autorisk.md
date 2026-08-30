Buying your first used car on a tight budget is mostly a leap of faith. You are a student, you have five to ten thousand dollars, and you are staring at a listing with no real way to tell whether the car is a quiet workhorse or a money pit waiting to happen. AutoRisk is my attempt to answer that question with data instead of a gut feeling.

![A row of used cars for sale on a dealership lot with bright price stickers](assets/autorisk-lot.jpg)
*Image generated with ChatGPT, for illustration.*

This is the first build log for it. The project is still in progress, so think of this as notes from the middle of the work rather than a tidy postmortem.

## Why this matters right now

Affordable used cars are quietly disappearing. According to [Edmunds' Q2 2026 used car report](https://www.edmunds.com/car-news/insights-q2-2026-used-car-report.html), the average 3-year-old used vehicle hit a record **$32,461**, and cars priced under $20,000 have fallen from **55% of used sales in 2019 to under 32%** today. The under-$15,000 segment was nearly cut in half.

> The kicker for budget buyers: a $10,000 to $15,000 budget now buys a car that is about four years older and has roughly 40,000 more miles than it did in 2019.

So the buyers with the least room for a costly mistake are being pushed toward older, higher-mileage cars, which is exactly where reliability gets hard to judge from a listing. That is the gap AutoRisk is built for.

## The question I actually want to answer

The core question is simple to say and hard to answer: **for a given make, model, and year in my budget, how reliable is this car likely to be?**

There is a surprising amount of public data that touches this, but none of it hands you a clean answer. So the plan is to pull the raw signals together and turn them into one score a person can actually read.

## Where the data comes from

Everything starts with the **NHTSA** (National Highway Traffic Safety Administration) open data:

- **Complaints:** owners reporting real problems, in their own words.
- **Recalls:** manufacturer and regulator-issued safety recalls.
- **Investigations:** open and closed safety investigations.

The complaints are the interesting part, because they are free text. Someone typing "the transmission started slipping around 90k miles" is a goldmine, but only if you can read thousands of those at once.

## Turning free text into patterns

This is where the NLP comes in. Rather than trying to read every complaint, I clean the text and use **TF-IDF** to turn each one into a vector, then run **KMeans** clustering to group them into recurring failure patterns.

The goal is not to label every complaint perfectly. It is to surface the *shape* of a car's problems: is this a model where complaints cluster around the engine and transmission, or around trim and electronics? A cluster of expensive drivetrain failures should weigh very differently from a cluster of squeaky-door complaints.

> The insight I keep coming back to: not all problems are equal. A reliability score that treats a broken infotainment screen the same as a failing transmission is worse than useless.

## Adding cost to the picture

Reliability is only half the story. A car can be mechanically solid and still be a bad buy if it bleeds value. So alongside the failure clustering, I model **depreciation** with **XGBoost**, so the score reflects not just "will it break" but "will it hold its value."

## Bringing it together

The pieces combine into a single **composite reliability score**, served through a **Streamlit** app so anyone can type in a car and get a readable answer with the reasons behind it. Under the hood it stays modular and Docker-ready, so I can swap or retrain any piece without rewiring the whole thing.

## What's next

A few things I am still working through:

1. Weighting the failure clusters by severity and repair cost, not just frequency.
2. Validating the score against something external so it is not just internally consistent.
3. Making the Streamlit output explain itself clearly, since a score no one trusts is a score no one uses.

I will post updates here as each piece lands. If you want to follow the code, it lives on [GitHub](https://github.com/Bharath-Naveen/AutoRisk).
