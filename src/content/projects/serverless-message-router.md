---
title: "Serverless sentiment message router"
category: "cloud"
featured: false
order: 5
year: "2025"
role: "Freelance project"
summary: "An event-driven AWS pipeline that reads incoming messages, scores their sentiment and routes urgent ones first."
stack: ["AWS Lambda", "Amazon Comprehend", "S3", "IAM", "CloudWatch"]
outcomes: ["Fully serverless, so there are no servers to patch", "Least-privilege IAM policy for each function", "CloudWatch dashboards for every stage"]
live: ""
liveLabel: "Open the live site"
code: ""
cover: ""
gallery: []
concept: false
---

## How it works
Messages land in S3, which triggers a Lambda function. Amazon Comprehend scores the sentiment, and the message is routed to a priority queue based on the result.

## Why serverless
The client's volume was unpredictable. Lambda meant paying only when messages arrived, with nothing to keep running overnight.
