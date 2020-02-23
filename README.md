This is Azimuth theme implemented on top of [Next.js](https://nextjs.org/). The site is built statically,
therefore can be hosted in serverless environment. The content of the site is powered by [Sanity.io](https://www.sanity.io/)
and provided at the built time.

[Site demo](https://azimuth-nextjs-sanity.netlify.com/)

## Getting Started

First, sign up to [Sanity.io](https://www.sanity.io/) and create new project. Then [import](https://www.sanity.io/docs/importing-data) 
the `sanity-project-export/export.ndjson` into your project:

```
sanity dataset import ./sanity-project-export/export.ndjson production
```

Then, define environment variables to allow sanity client to fetch the data. You will need to create "read-write" token
from your Sanity project settings (https://manage.sanity.io/projects/__PROJECT_ID__/settings/api)

```
export SANITY_PROJECT_ID=<your sanity project id>
export SANITY_DATASET=production
export SANITY_TOKEN=<your sanity read write token>
```

Lastly, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the code in `src` folder. The site auto-updates as you edit the code.

## Building for production

To build a static site for production, run the following command

```
npm run export
```

The exported site will be written to `out` folder. The contents of this folder can be uploaded and served from CDN.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

To learn more about Sanity, take a look at the following resources:

- [Sanity Docs](https://www.sanity.io/docs)
- [Sanity Reference](https://www.sanity.io/docs/reference)
