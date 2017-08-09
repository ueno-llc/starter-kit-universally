# Script that runs the dev task and looks for hot reload events
# written to stdout. When killed, spits out the average of all runs, if any

command="yarn run dev"
search="done in server"

echo "Running \"$command\" watching for hot reloads"

$command |
{
  # trap INT in here since this is a subshell
  runs=()
  built=false

  trap ctrl_c INT

  function ctrl_c() {
    if [ ${#runs[@]} -ge 1 ] && $built
    then
      sums=$(printf "+%s" "${runs[@]}")
      sums=${sums:1}
      echo $(tput bold)
      echo "scale=3; ($sums) / ${#runs[@]}" | bc -l
      echo $(tput sgr0)
    fi
  }

  while IFS= read -r line
  do
    if [ "$line" == "Server listening on port 3000" ] && ! $built
    then
      echo "Build complete"
      built=true
    fi

    # print total time hot reloading took
    if test "${line#*$search}" != "$line" && $built
    then
      timing=$(echo $line | sed 's/.*(\([0-9].*\))/\1/')
      runs+=($timing)
      echo $timing
    fi
  done
}
