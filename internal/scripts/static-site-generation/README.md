# Static site generation

This directory has scripts that create a version of the site that can be served from
a static webserver (e.g. Apache, Nginx, etc).

You can simply run `yarn build:static` and then copy the `build/static` directory
as-is to a static webserver where it must be served at the root. 

## How does the static site get built

* Client JS and CSS bundling happens via the normal build process with a different
target directory of `build/static/client'
* The `public` directory is copied directly to `build/static`
* A temporary production server bundle is created in `build/static/temp`
* Another node bundle is created for the reactApp as a standalone. 
* NOT YET IMPLEMENTED: A node script instantiates the reactApp and exports the
non-dynamic routes to a `build/static/temp/routeConfig.json` (today we just
specify the routes in values.js). 
* finally the temporary server bundle is launched and we issue http requests
to the specified routes and write the files to the file system.

## Why it's a two-part build

The current structure of `server/index.js` has it launching the server, so importing
it into a script cannot be done until it's built. Rather than refactoring `server/index.js`, a less invasive
approach was taken. The first script: `1-prepare.js` produces the client and server bundles and
generates the routeConfig.json file.  The second script,  `2-renderHtml.js` launches the server
and executes the http requests & writes the html files. 
