# Static site generation

This directory has scripts that create a version of the site that can be served from
a static webserver (e.g. Apache, Nginx, etc).

To generate the static site run `yarn build && yarn build:static` and then copy the `build/static` directory
as-is to a static webserver where it must be served at the root. 

You can also run `yarn start:static` to serve the built static site via a simple express static server static

## Configuration and limitations

In values.js modify the staticSiteGeneration section to specify which routes to traverse/pre-generate HTML for and 
what file structure to create them. The static generator is dumb- it doesn't not crawl or inspect the router to determine
what routes to generate.

For dynamic routes with many possible parameters, it's unlikely that you'd want to generate a different static html page
for each. Instead, client-side dynamic behavior can be obtained by changing a path-based route parameter into a query string
parameter (e.g. change `/planets/detail/54` to `/planets/detail?id=54` and configure your app accordingly). 


## How does the static site get built

* Normal client and server production builds are created in `build/client` and `build/server`
* The resulting client directory at `build/client` and the `public` directories are copied to `build/static` destination.
* The pre-built server is launched and the routes specified in values.js are traversed. The resulting html is written to files
in the `build/static` directory.

## Why it's a two-part build

The current structure of `server/index.js` has it launching the server, so importing
it into a script cannot be done until it's built. Rather than refactoring `server/index.js`, a less invasive
approach was taken. The first script: `1-prepare.js` produces the client and server bundles and
generates the routeConfig.json file.  The second script,  `2-renderHtml.js` launches the server
and executes the http requests & writes the html files. 
