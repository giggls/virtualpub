#!/bin/sh

docker build -t roomcount .
docker create --name roomcount --restart unless-stopped -p 127.0.0.1:55555:55555 roomcount
# im Vordergrund laufen lassen:
# docker start -a roomcount
