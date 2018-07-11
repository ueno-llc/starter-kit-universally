# Remote development

There are two ways of doing remote development:

1. Providing IP address via `HOST` to run on local network
2. Using ngrok to expose localhost to the internet

```bash
HOST=192.168.1.1 yarn dev # run from IP address
HOST=$(ipconfig getifaddr en0) yarn dev # one-liner on mac
...
Server listening on http://192.168.1.1:3000
```

```bash
# run ngrok via script
yarn dev-remote
...
Server listening on https://xyz.ngrok.io
```
