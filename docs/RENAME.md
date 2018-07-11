# Rename the app

We provide an easy script to rename the app's name. It will change all occurrences of the default name in configurations files for your new app name.

### App Name

Choose your app name, it can only contain alphanumeric characters and spaces.

### Renaming

To rename your app you simply do the following:

```bash
yarn rename "My New App"
```

The script will create a new branch called `feature/rename` and merge it with master once completed. You can skip it by adding `--no-git`.
