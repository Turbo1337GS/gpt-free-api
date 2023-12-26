This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
# NOTE:
Open your IDE and search for the phrases "COOKIE VALUE" in the files. You should fill in these values to make it work correctly! If you want, you can use a loop in init.tsx to skip non-working providers. However, you also need to adjust the provider functions to make this work.

```tsx
  let models: any = [
    {
      model: "meta/llama-2-7b-chat",
      details: [
        {
          name: "Llama",
        }
      ]
    },
    {
      model: "meta/llama-2-13b-chat",
      details: [
        {
          name: "Llama",
        }
      ]
    },
    {
      model: "meta/llama-2-70b-chat",
      details: [
        {
          name: "Llama",
        }
      ]
    },
    {
      model: "yorickvp/llava-13b",
      details: [
        {
          name: "Llava",
        }
      ]
    },
    {
      model: "nateraw/salmonn",
      details: [
        {
          name: "Salmonn",
        }
      ]
    },
    {
      model: "OpenChat Aura",
    },
    {
      model: "OpenAI - gpt4",
      details: [
        {
          name: "gpt-4",
        }
      ]
    },
    {
      model: "OpenAI - gpt35turbo",
      details: [
        {
          name: "gpt-3.5-turbo",
        }
      ]
    }
    
  ];

```








Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
