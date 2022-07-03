#!/bin/sh

# Script to easily launch the project in dev mode

# Configure proxy with a 80/HTTP only template
cd proxy
mv templates/default.conf.template default.conf.template.old
cp dev.default.conf.template templates/default.conf.template

# Go back to project root
cd ..

# Setup pgadmin volume to work correctly with docker
sudo chown -R 5050:5050 pgadmin/

# Automatically set env values when in a gitpod workspace
if ! [ -z "$GITPOD_WORKSPACE_ID" ];then
    export API_PORT=3000
    export GITPOD_WORKSPACE_HOST="$GITPOD_WORKSPACE_ID.$GITPOD_WORKSPACE_CLUSTER_HOST"
    echo "Running on a gitpod instance: $GITPOD_WORKSPACE_HOST"
    export API_BASE_URL=https://$API_PORT-$GITPOD_WORKSPACE_HOST
    export WSS_BASE_URL=wss://$API_PORT-$GITPOD_WORKSPACE_HOST
fi

# If we're relaunching everything, ensure services aren't already running.
if [ "$#" -eq 0 ];then docker-compose down; fi

# Remove dir created by empty volume
rm -rf api/.env/

# Launch services.
docker-compose up $@
