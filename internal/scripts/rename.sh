#!/bin/sh

libs=(git perl sed iconv tr)

for lib in "${libs[@]}"
do
  if [ "$(which $lib)" == "" ]; then
    echo "Could not find $lib"
    echo "You can try: brew install $lib"
    exit
  fi
done

if [ ! -f ./node_modules/.bin/webpack ]; then
  echo ""
  echo "Did you forgot to do install node modules ?"
  echo ""
  echo "yarn install"
  echo ""
  exit
fi

NAME=$(echo $1 | iconv -t ascii//TRANSLIT)
REST=$3
SLUG=$(echo $1 | iconv -t ascii//TRANSLIT | sed -E 's/ /-/g' | sed -E 's/[~\^]+//g' | sed -E 's/[^a-zA-Z0-9-]+//g' | sed -E 's/^-+\|-+$//g' | sed -E 's/\-+/-/g' | tr A-Z a-z)
DIRTY=$(git status --porcelain)

if [[ $REST != *"--no-git"* ]]; then
  if [[ $DIRTY != "" ]]; then
    echo "Git status is dirty. Please stash or commit your changes before proceeding."
    exit
  fi

  branch_name=$(git symbolic-ref -q HEAD)
  branch_name=${branch_name##refs/heads/}
  branch_name=${branch_name:-HEAD}

  git checkout -B feature/rename
fi

echo ""
echo "Renaming the React Starter Kit"
echo ""
echo "NAME: $NAME"
echo "SLUG: $SLUG"
echo ""

FILES=(
  "app.json"
  "package.json"
)

for file in "${FILES[@]}"
do
  if [ -f $file ]; then
    echo "Patching $file"
    perl -pi -e "s/starter-kit-universally/$SLUG/g" $file
  else
    echo "$file does not match any file(s)."
  fi
done

# Package.json
perl -pi -e "s/\"name\": \"starter-kit-universally\",/\"name\"\: \"$NAME\",/" package.json
perl -pi -e "s/\"description\": \"A starter kit from Ueno. Based on react-universally\",/\"description\"\: \"$NAME's description\",/" package.json
perl -pi -e "s/\"version\": \".*\",/\"version\": \"1.0.0\",/" package.json

# App.json
perl -pi -e "s/\"name\": \"React Starter Kit\",/\"name\"\: \"$NAME\",/" app.json
perl -pi -e "s/\"description\": \"A starter kit from Ueno. Based on react-universally\",/\"description\"\: \"$NAME's description\",/" app.json
perl -pi -e "s/\"version\": \".*\",/\"version\": \"1.0.0\",/" app.json

if [[ $REST != *"--no-git"* ]]; then
  git add .
  git commit -m "App renamed to $NAME" --no-verify
  git checkout $branch_name
  git merge feature/rename
  git branch -D feature/rename
fi

echo ""
echo "App successfully renamed to $NAME"
