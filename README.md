# Dynamic Web Interface

[Inspired by this tweet from Jordan Singer](https://twitter.com/jsngr/status/1641108150349873153?s=20)

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Stack

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [OpenAI](https://openai.com)
- [Langchain JS](https://github.com/hwchase17/langchainjs)

## Set up

First, make sure you run `pnpm install`.

Next, run `cp .env.example .env` and then add your `OPENAI_API_KEY` to `.env`.

Finally run `pnpm dev` and the app should be up at localhost:3000!

## How do I use this?

After spinning up the app, try typing in some kind of interface into the input box.

For example, "create Stripe's landing page" or "create a login page in the visual style of Airbnb but with #000000 as the main color instead of their red". Hit enter or press the Create button.

Then you'll have to wait. If you're using gpt-3.5-turbo, you'll usually have to wait up to 1 min. For GPT4 it's even longer. There are ways of speeding this up but I haven't implemented them yet.

## How do I deploy this?

Follow T3's deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
