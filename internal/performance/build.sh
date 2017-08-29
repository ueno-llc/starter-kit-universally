command="yarn run dev"
search="done in server"
n=5

while getopts ":n:" opts; do
   case "${opts}" in
      n)
        n=${OPTARG}
        ;;
      *)
        ;;
   esac
done

runs=()

trap ctrl_c INT

function stats() {
  sums=$(printf "+%s" "${runs[@]}")
  sums=${sums:1}
  echo $(tput bold)
  echo "scale=3; ($sums) / ${#runs[@]}" | bc -l
  echo $(tput sgr0)
}

function ctrl_c() {
  if [ ${#runs[@]} -ge 1 ]
  then
    stats
  fi
}

echo "Running \"$command\" $n times"
for (( c=0; c<$n; c++ ))
do
  # runs a subshell and echos to stdout which we capture in var
  timing=$($command |
    while IFS= read -r line
    do
      # print total time since start to stdout and kill
      if test "${line#*$search}" != "$line"
      then
        echo $line | sed 's/.*(\([0-9].*\))/\1/'
        pid=`ps -A | grep -m1 "_babel-node" | awk '{print $1}'`
        kill -2 $pid
      fi
    done
  )
  echo $timing
  runs+=($timing)
done
stats
