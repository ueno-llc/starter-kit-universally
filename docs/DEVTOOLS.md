# Dev Tools

All dev tools are hidden by default. To show them use <kbd>ctrl + K</kbd>.

## Grid

There is both a vertical and horizontal grids available. Horizontal grid can be toggled via <kbd>ctrl + L</kbd>.

## GsapTools

A simple tool to debug GSAP animations.

- [Documentation](https://github.com/ueno-llc/gsap-tools)

## MobX devtools

Tools to perform runtime analyses of React applications powered by MobX and React.

- [Documentation](https://github.com/mobxjs/mobx-react-devtools)

## Measuring Performance

At some point during your projects lifetime, it will suddenly become _slow_. It might be some silly dependencies, missed configuration or the alignment of the stars. There is some scripts included to help you, located in `./internal/performance`. Before starting, set `PERFORMANCE=true` in the env so the build spits out timings.

Measuring initial build times, runs the dev build, kills it, runs it again N times. When finished it writes the average of all the runs to stdout.

```bash
chmod +x ./internal/performance/build.sh # allow execution
./internal/performance/build.sh

-> Running "yarn dev" 5 times
-> 2627.793
-> 2697.435
-> 4140.478
-> 2911.944
-> 2846.027
-> 2175.239
```

Measuring hot reload rebuilds, runs the dev task and waits for changes that trigger rebuilds. When the script is interrupted (e.g. by <kbd>ctrl + C</kbd>) it writes the average of all runs to stdout.

```bash
chmod +x ./internal/performance/hot.sh # allow execution
./internal/performance/hot.sh

-> Running "yarn dev" watching for hot reloads
-> Build complete
-> 794.079
-> 518.700
-> 500.460
-> 492.716
-> 576.488
```
