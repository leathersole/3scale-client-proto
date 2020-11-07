#!/bin/bash
container=$(buildah from registry.redhat.io/rhel8/nodejs-14)
mnt=$(buildah mount $container)
mkdir $mnt/tmp/src
cp -r ../{package.json,package-lock.json,src} $mnt/tmp/src/
chown -R 1001:0 $mnt/tmp/src
buildah run $container /usr/libexec/s2i/assemble
buildah config --cmd "/usr/libexec/s2i/run" $container
buildah commit $container localhost/3scale-client-proto
buildah rm $container