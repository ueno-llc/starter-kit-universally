# Environment Variables

Keep all your environment variables in `.env` file in the root of your project. If you don't have any, just create one by copying the `.env_example`.

### Using env

Before being able to use the variable you defined in your `.env` you will have to let know the app, if it's a server-only, client-only or both variables value.

- Let's take an example, you created first a variable named `IS_PUBLIC=true`
- Open the `config/values.js` file
- In the value object, declare your variable `ìsPublic: EnvVars.bool('IS_PUBLIC')`
- If you want to use this variable on the client side, you will need to add it to the clientConfigFilter object. In this case it's simple, just add `ìsPublic: true`
- When you're done with these steps, you can go to your code and do

```js
import config from 'utils/config';

if (config('ìsPublic')) {
  // whatever you want to do with it...
}
```

### Paths

Paths, must be absolute URLs because of `axios` and the server not knowing its hostname

`BASE_URL` is used for compiling canonical urls and local api url (for internal requests)

`publicPath` is set in development by the following environment variables:
  - `REMOTE_URL` only set when running `yarn dev-remote`
  - `HOST` and `CLIENT_DEV_PORT` generates a url pointing to the dev server
  - Otherwise it’s set to `/client/`

`localApiUrl` is set by the following environment rules:
  - `HEROKU_APP_NAME` injected into an Heroku app url string
  - `BASE_URL` - `/api` is appended
  - `HOST` and `PORT` used to compile a local api url

This allows for the build to work in dev, on Heroku PR apps and Heroku prod. See `./config/values.js` for details.

### Password protecting

By setting a `PASSWORD_PROTECT` env variable, the server will ask the client to authenticate with basic auth. If the string contains a `:` it will be split and set the username as the first part and the password as the second part, e.g. `Aladdin:OpenSesame`. If no `:` is in the string (or it starts with a `:`), the username will be empty and the password the given string.

### Vendors DLLs

In dev vendors DLLs are created (see `devVendorDLL` in `config/values.js`) to speed up builds, for large projects you can add your own dependencies there.
