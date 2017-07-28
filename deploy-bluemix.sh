#! /bin/sh

CONTAINER="swagger-editor"
OLD_CONTAINER="swagger-editor-old"
ACCOUNT=$1

bx ic rename $CONTAINER $OLD_CONTAINER
# read -p "Press [Enter] key to continue"

cf ic rmi registry.ng.bluemix.net/$ACCOUNT/$CONTAINER
cf ic rm registry.ng.bluemix.net/$ACCOUNT/$CONTAINER
docker tag swagger-editor registry.ng.bluemix.net/$ACCOUNT/$CONTAINER
docker push registry.ng.bluemix.net/$ACCOUNT/$CONTAINER
cf ic run --name=$CONTAINER --publish=8080 registry.ng.bluemix.net/$ACCOUNT/$CONTAINER

sleep 15
# read -p "Press [Enter] key to continue"

bx ic ip-unbind 169.46.154.251 $OLD_CONTAINER
sleep 15
bx ic ip-bind 169.46.154.251 $CONTAINER

bx ic stop $OLD_CONTAINER
sleep 15
bx ic rm $OLD_CONTAINER

#  docker tag swagger-editor registry.ng.bluemix.net/watsontest/swagger-editor
#  docker push registry.ng.bluemix.net/watsontest/swagger-editor
