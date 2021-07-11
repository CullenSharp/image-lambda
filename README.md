# Lab 17: Introduction to Lambda and S3

Revised: July 10th, 2021

## 👀 Overview 

A basic introduction to AWS [Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) and [S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html), this lab is will create a Lambda that listens to all S3 create events. Whenever an image is uploaded, request a manifest called "images.json" and update it with metadata from the upload. After the operation is complete, the same Lambda reinserts the manifest into the bucket. 

Link to my Images.json
[https://cts-images-for-all.s3.us-west-2.amazonaws.com/images.json](https://cts-images-for-all.s3.us-west-2.amazonaws.com/images.json)

## ⚠️ Warning

Be careful when implementing a system like this of your own. If you go in without configuring events properly or decoupling I/O, there is a high chance of creating a [recursive loop](https://docs.aws.amazon.com/lambda/latest/operatorguide/recursive-runaway.html). Generally, this is just a headache and a commit, but because AWS Lambdas are elastic this can become an expensive problem quickly. As the workload on the cloud increases, your application will scale its compute power to match the demand. This will eat your budget very quickly, and several of my classmates got hit with $300+ bills for this exact reason.

The solution is decouple input and output locations or configure your event notifications. This [guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html) will help you navigate this problem.

## ‼️ Notes

July 10th, 2021: 🎉 I DID IT! By configuring the event to only fire when objects with the prefix "images/" are seen I prevented a recursive loop.
July 6th, 2021: I wasn't able to complete the lab. I got to the point of creating the JSON file and adding to it, but wasn't able to implement it properly.
