This is an implementation of Stackbit's Azimuth theme on top of [Next.js](https://nextjs.org/). The site is built statically,
and it can be hosted in serverless environment, such as [Netlify](https://www.netlify.com). The content of the site
is powered by [Sanity.io](https://www.sanity.io/) and provided to the built script at the build time.

[Site demo](https://azimuth-nextjs-sanity.netlify.com/)

## Getting Started

First, sign up to [Sanity.io](https://www.sanity.io/) and create a new project.
Then [import](https://www.sanity.io/docs/importing-data) `sanity-export/export.ndjson` into the created project:

```
sanity dataset import ./sanity-export/export.ndjson production
```

After importing the project, define following environment variables to allow Sanity client to fetch the roject content
when developing or building the site. You will need to create "read-write" token in your Sanity project settings page 
(https://manage.sanity.io/projects/__PROJECT_ID__/settings/api)

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
