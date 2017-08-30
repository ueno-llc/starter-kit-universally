
# Hi! I’m Ueno’s starter-kit.

## New projects

This repo has all upcoming releases in the `development` base branch. All [releases](https://github.com/ueno-llc/starter-kit-universally/releases) are made from the `master` branch.

Clone this repo and switch to `master`, rename origin to upstream for updates and add your own origin:

```bash
git clone https://github.com/ueno-llc/starter-kit-universally.git my-project
cd my-project
git checkout master
git remote rename origin upstream
git remote set-url --push upstream no_push # disable push to upstream
git remote add origin <my-origin>
```

Change values in `app.json` and `config/values.js`. Delete this part of the readme.

## Development

```
yarn
yarn run dev
```

### Password protecting

By setting a `PASSWORD_PROTECT` env variable, the server will ask the client to authenticate with basic auth. If the string contains a `:` it will be split and set the username as the first part and the password as the second part, e.g. `Aladdin:OpenSesame`. If no `:` is in the string (or it starts with a `:`), the username will be empty and the password the given string.

### Single route development

If you’re working on a single route and don’t want to build the entire app you can do so by using the `--route` argument, for example:

```bash
> yarn run dev -- --route=about
```
`about` being the folder name of the targeted route (inside `shared/routes`). This can be very useful when the app gets bigger and rebuilds and HMR start to get slower.

### Notes

* When adding configuration values and environment specific values, use the [project config](https://github.com/ctrlplusb/react-universally/blob/master/internal/docs/PROJECT_CONFIG.md)
* In development vendor DLLs are created (see `devVendorDLL` in `config/values.js`) to speed up builds, for large projects you can add your own deps there

## Production build

```bash
yarn run build
yarn start
```

## Updating from upstream

Make sure you have the `upstream` remote:

```bash
> git remote -v # should show..
...
upstream git@github.com:ueno-llc/starter-kit-universally.git (fetch)
...
# if not, run...
git remote add upstream https://github.com/ueno-llc/starter-kit-universally.git
git remote set-url --push upstream no_push # disable push to upstream
```

Then, update:

```bash
git fetch upstream
git merge upstream/master

# These are the usual conflicts
git rm -r -f shared/components/DemoApp
git checkout --ours package.json
```

## Remote development

Now supports ngrok and other ways to access your development build.

```bash
# outside wifi
ngrok http 3000
CLIENT_DEV_PROXY=1 PUBLIC_URL=http://xxxxxx.ngrok.io yarn run dev
# or local network
HOST=192.168.123.456 PORT=3000 yarn run dev
```

## Stricter development

For those so inclined, pre-commit linting hooks can be added by changing `lint-stage` in `package.json` to:

```json
"lint-staged": {
  "*.{js,jsx}": "./node_modules/.bin/eslint",
  "*.{css,scss}": "./node_modules/.bin/stylelint"
}
```

Testing can be enabled by adding to `scripts`:

```json
"test": "jest"
```

## Measuring performance

At some point during your projects lifetime, it will suddenly become _slow_. It might be some silly dependency, missed configuration or the alignment of the stars. After suffering through long build times one time to many, you'll start tweaking and tearing stuff apart. While doing that it's nice to know if you're having any effect, so there are some scripts included to help with that, located in `./internal/performance`.

Before starting, set `PERFORMANCE=true` in the env so the build spits out timings.

Measuring initial build times, runs the dev build, kills it, runs it again N times. When finished it writes the average of all the runs to stdout.

```bash
> chmod +x ./internal/performance/build.sh # allow execution
> ./internal/performance/build.sh
Running "yarn run dev" 5 times
2627.793
2697.435
4140.478
2911.944
2846.027

2175.239
```

Measuring hot reload rebuilds, runs the dev task and waits for changes that trigger rebuilds. When the script is interrupted (e.g. by ctrl+c) it writes the average of all runs to stdout.

```bash
> chmod +x ./internal/performance/hot.sh # allow execution
> ./internal/performance/hot.sh
Running "yarn run dev" watching for hot reloads
Build complete
794.079
518.700
500.460
492.716
^C
576.488
```

---

<p align='center'>
  <h1 align='center'>React, Universally</h1>
  <p align='center'><img width='150' src='https://raw.githubusercontent.com/ctrlplusb/assets/master/logos/react-universally.png' /></p>
  <p align='center'>A starter kit for universal react applications.</p>
</p>


[![All Contributors](https://img.shields.io/badge/all_contributors-20-orange.svg?style=flat-square)](#contributors)

## About

This starter kit contains all the build tooling and configuration you need to kick off your next universal React project, whilst containing a minimal "project" set up allowing you to make your own architecture decisions (Redux/MobX etc).

> NOTICE: Please read this important [issue](https://github.com/ctrlplusb/react-universally/issues/409) about the behaviour of this project when using `react-async-component`, which is by default bundled with it.

## Features

  - 👀 `react` as the view.
  - 🔀 `react-router` v4 as the router.
  - 🚄 `express` server.
  - 🎭 `jest` as the test framework.
  - 💄 Combines `prettier` and Airbnb's ESlint configuration - performing code formatting on commit. Stop worrying about code style consistency.
  - 🖌 Very basic CSS support - it's up to you to extend it with CSS Modules etc.
  - ✂️ Code splitting - easily define code split points in your source using `react-async-component`.
  - 🌍 Server Side Rendering.
  - 😎 Progressive Web Application ready, with offline support, via a Service Worker.
  - 🐘 Long term browser caching of assets with automated cache invalidation.
  - 📦 All source is bundled using Webpack v2.
  - 🚀 Full ES2017+ support - use the exact same JS syntax across the entire project. No more folder context switching! We also only use syntax that is stage-3 or later in the TC39 process.
  - 🔧 Centralised application configuration with helpers to avoid boilerplate in your code. Also has support for environment specific configuration files.
  - 🔥 Extreme live development - hot reloading of ALL changes to client/server source, with auto development server restarts when your application configuration changes.  All this with a high level of error tolerance and verbose logging to the console.
  - ⛑ SEO friendly - `react-helmet` provides control of the page title/meta/styles/scripts from within your components.
  - 🤖 Optimised Webpack builds via HappyPack and an auto generated Vendor DLL for smooth development experiences.
  - 🍃 Tree-shaking, courtesy of Webpack.
  - 👮 Security on the `express` server using `helmet` and `hpp`.
  - 🏜 Asset bundling support. e.g. images/fonts.
  - 🎛 Preconfigured to support development and optimised production builds.
  - ❤️ Preconfigured to deploy to `now` with a single command.

Redux/MobX, data persistence, modern styling frameworks and all the other bells and whistles have been explicitly excluded from this starter kit.  It's up to you to decide what technologies you would like to add to your own implementation based upon your own needs.

> However, we now include a set of "feature branches", each implementing a technology on top of the clean master branch.  This provides you with an example on how to integrate said technologies, or use the branches to merge in a configuration that meets your requirements.  See the [`Feature Branches`](/docs/FEATURE_BRANCHES.md) documentation for more.

## Getting started

```bash
git clone https://github.com/ueno-llc/starter-kit-universally my-project
cd my-project
npm install
npm run dev
```

Now go make some changes to the `Home` component to see the tooling in action.

## Docs

 - [Project Overview](/internal/docs/PROJECT_OVERVIEW.md)
 - [Project Configuration](/internal/docs/PROJECT_CONFIG.md)
 - [Package Script Commands](/internal/docs/PKG_SCRIPTS.md)
 - [FAQ](/internal/docs/FAQ.md)
 - [Feature Branches](/internal/docs/FEATURE_BRANCHES.md)
 - [Deploy your very own Server Side Rendering React App in 5 easy steps](/internal/docs/DEPLOY_TO_NOW.md)
 - [Changelog](/CHANGELOG.md)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars3.githubusercontent.com/u/243161?v=3" width="100px;"/><br /><sub>Andrés Calabrese</sub>](https://github.com/aoc)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=aoc) | [<img src="https://avatars3.githubusercontent.com/u/1965897?v=3" width="100px;"/><br /><sub>Andrey Luiz</sub>](https://andreyluiz.github.io/)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=andreyluiz) | [<img src="https://avatars3.githubusercontent.com/u/3148205?v=3" width="100px;"/><br /><sub>Alin Porumb</sub>](https://github.com/alinporumb)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=alinporumb) | [<img src="https://avatars0.githubusercontent.com/u/4349324?v=3" width="100px;"/><br /><sub>Benjamin Kniffler</sub>](https://github.com/bkniffler)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=bkniffler) | [<img src="https://avatars0.githubusercontent.com/u/180773?v=3" width="100px;"/><br /><sub>Birkir Rafn Guðjónsson</sub>](https://medium.com/@birkir.gudjonsson)<br />💬 [🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Abirkir) [💻](https://github.com/ctrlplusb/react-universally/commits?author=birkir) 👀 | [<img src="https://avatars0.githubusercontent.com/u/2063102?v=3" width="100px;"/><br /><sub>Carson Perrotti</sub>](http://carsonperrotti.com)<br />💬 [💻](https://github.com/ctrlplusb/react-universally/commits?author=carsonperrotti) [📖](https://github.com/ctrlplusb/react-universally/commits?author=carsonperrotti) 👀 | [<img src="https://avatars1.githubusercontent.com/u/13365531?v=3" width="100px;"/><br /><sub>Christian Glombek</sub>](https://github.com/LorbusChris)<br />[🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3ALorbusChris) [💻](https://github.com/ctrlplusb/react-universally/commits?author=LorbusChris) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars3.githubusercontent.com/u/603683?v=3" width="100px;"/><br /><sub>Christoph Werner</sub>](https://twitter.com/code_punkt)<br />💬 [🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Acodepunkt) [💻](https://github.com/ctrlplusb/react-universally/commits?author=codepunkt) 👀 | [<img src="https://avatars0.githubusercontent.com/u/1399894?v=3" width="100px;"/><br /><sub>David Edmondson</sub>](https://github.com/threehams)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=threehams) | [<img src="https://avatars0.githubusercontent.com/u/10954870?v=3" width="100px;"/><br /><sub>Dion Dirza</sub>](https://github.com/diondirza)<br />💬 [🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Adiondirza) [💻](https://github.com/ctrlplusb/react-universally/commits?author=diondirza) [📖](https://github.com/ctrlplusb/react-universally/commits?author=diondirza) 👀 | [<img src="https://avatars0.githubusercontent.com/u/254095?v=3" width="100px;"/><br /><sub>Evgeny Boxer</sub>](https://github.com/evgenyboxer)<br />[🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Aevgenyboxer) [💻](https://github.com/ctrlplusb/react-universally/commits?author=evgenyboxer) | [<img src="https://avatars2.githubusercontent.com/u/191304?v=3" width="100px;"/><br /><sub>Joe Kohlmann</sub>](http://kohlmannj.com)<br />[🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Akohlmannj) [💻](https://github.com/ctrlplusb/react-universally/commits?author=kohlmannj) | [<img src="https://avatars2.githubusercontent.com/u/24992?v=3" width="100px;"/><br /><sub>Lucian Lature</sub>](https://www.linkedin.com/in/lucianlature/)<br />[🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Alucianlature) [💻](https://github.com/ctrlplusb/react-universally/commits?author=lucianlature) 👀 | [<img src="https://avatars1.githubusercontent.com/u/1624703?v=3" width="100px;"/><br /><sub>Mark Shlick</sub>](https://github.com/markshlick)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=markshlick) |
| [<img src="https://avatars1.githubusercontent.com/u/7436773?v=3" width="100px;"/><br /><sub>Ryan Lindskog</sub>](https://www.RyanLindskog.com/)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=rlindskog) | [<img src="https://avatars1.githubusercontent.com/u/977713?v=3" width="100px;"/><br /><sub>Steven Enten</sub>](http://enten.fr)<br />💬 [🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Aenten) [💻](https://github.com/ctrlplusb/react-universally/commits?author=enten) 👀 | [<img src="https://avatars1.githubusercontent.com/u/12164768?v=3" width="100px;"/><br /><sub>Sean Matheson</sub>](http://www.ctrlplusb.com)<br />💬 [🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Actrlplusb) [💻](https://github.com/ctrlplusb/react-universally/commits?author=ctrlplusb) [📖](https://github.com/ctrlplusb/react-universally/commits?author=ctrlplusb) 💡 👀 [⚠️](https://github.com/ctrlplusb/react-universally/commits?author=ctrlplusb) 🔧 | [<img src="https://avatars0.githubusercontent.com/u/6218853?v=3" width="100px;"/><br /><sub>Steven Truesdell</sub>](https://steventruesdell.com)<br />💬 [🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Astrues) [💻](https://github.com/ctrlplusb/react-universally/commits?author=strues) [📖](https://github.com/ctrlplusb/react-universally/commits?author=strues) [⚠️](https://github.com/ctrlplusb/react-universally/commits?author=strues) | [<img src="https://avatars0.githubusercontent.com/u/10552487?v=3" width="100px;"/><br /><sub>Thomas Leitgeb</sub>](https://twitter.com/_datoml)<br />[🐛](https://github.com/ctrlplusb/react-universally/issues?q=author%3Adatoml) [💻](https://github.com/ctrlplusb/react-universally/commits?author=datoml) | [<img src="https://avatars0.githubusercontent.com/u/595711?v=3" width="100px;"/><br /><sub>Tyler Nieman</sub>](http://tsnieman.net/)<br />[💻](https://github.com/ctrlplusb/react-universally/commits?author=tsnieman) |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
