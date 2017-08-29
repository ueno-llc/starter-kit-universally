# Cleans & builds the project
# Prints out the size of css and js bundles in bytes

yarn run clean &> /dev/null
yarn run build &> /dev/null

client='./build/client'

css=$client`cat $client/assets.json | jq -r '.index.css'`
js=$client`cat $client/assets.json | jq -r '.index.js'`

css_size=`stat -f%z "$css"`
js_size=`stat -f%z "$js"`

echo "css\tjs"
echo $css_size"\t"$js_size
