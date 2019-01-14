#!/bin/bash +x

# The output of vault kv list will be like this:
# KEYS
# ---
# KEY_ONE
# KEY_TWO
# Hence the for loop starts from 2.
# We also ignore any key that has '/' in it, which indicate it as a path, not a key
IFS=$'\n' KEYS=($(vault kv list ${VAULT_KUBESECRETS_PATH}))
total=${#KEYS[*]}
parameters=""
for (( i=2; i<=$(( $total -1 )); i++ ))
  do
    if [[ ${KEYS[i]} =~ [^/]$ ]]
    then
      val=$(vault kv get -field ${KEYS[i]} ${VAULT_KUBESECRETS_PATH}/${KEYS[i]})
      parameters="${parameters} --from-literal='${KEYS[i]}=${val}'"
    fi
  done
echo "kubectl create secret generic ${APP_NAME}-secrets $parameters -o yaml --dry-run" | sh -
