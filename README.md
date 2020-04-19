This is an implementation of Stackbit's Azimuth theme on top of [Next.js](https://nextjs.org/).
The site is intended to be built statically and hosted on a CDN like environment,
such as [Netlify](https://www.netlify.com). The content of the site is hosted by
[Sanity.io](https://www.sanity.io/) Headless CMS and provided to the built script
at the build time. Once site has been built and deployed, it does not call any
API requests, all pages are pre-rendered and hosted by CDN.

In addition, Next.js [SSG support](https://nextjs.org/blog/next-9-3#next-gen-static-site-generation-ssg-support)
has been leveraged to support client side rendering when navigating the internal
links of the site.

[Sourcebit](https://github.com/stackbithq/sourcebit) and its plugins, specifically
[`sourcebit-source-sanity`](https://github.com/stackbithq/sourcebit-source-sanity)
and [sourcebit-target-next](https://github.com/stackbithq/sourcebit-target-next),
are used to fetch and normalize the data from Sanity and provide it to Next.js
pages. It also sets up live updates in development mode allowing to update the
content in CMS and instantly see them in browser.

[Site demo](https://azimuth-nextjs-sanity.netlify.com/)


## Getting Started

1. Install dependencies

   ```
   run npm install
   ```

2. Sign up to [Sanity.io](https://www.sanity.io/)

3. Install Sanity CLI

   ```
   npm install -g @sanity/cli
   ```

4. [Create a Sanity project](https://www.sanity.io/docs/getting-started-with-sanity-cli#bootstrap-a-project-97220f7a595a)

   ```
   sanity init \
     --create-project "Sanity Demo Project" \
     --dataset production \
     --output-path sanity \
     --template clean
   ```

5. Copy site schemas to created sanity project

   ```
   cp -R sanity-export/schemas sanity
   ```

6. [import](https://www.sanity.io/docs/importing-data) demo dataset into the created project:
 
   ```
   cd sanity
   sanity dataset import ../sanity-export/export production
   ```

7. Install sanity markdown plugin (from "sanity" folder)

   ```
   sanity install markdown
   ```

8. Start sanity Studio (from "sanity" folder)

   ```
   sanity start
   ```
   
   Sanity studio will be available at http://localhost:3333

9. After importing the project, define following environment variables to allow
   Sourcebit to fetch the content from Sanity when developing or building the site.
   You will need to create "read-write" token in your Sanity project settings page 
   (https://manage.sanity.io/projects/__PROJECT_ID__/settings/api)

   ```
   export SANITY_PROJECT_ID=<your sanity project id>
   export SANITY_DATASET=production
   export SANITY_TOKEN=<your sanity read write token>
   ```

10. Lastly, run the development server (from project folder):

    ```
    cd ..
    npm run dev
    ```

    Navigate [http://localhost:3000](http://localhost:3000) to see the site.
    You can edit the site contents in Sanity studio and the browser will
    live-update your changes.

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

