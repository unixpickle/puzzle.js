#!/bin/bash

for f in */test/*.js
do
  echo \*\*\* $f \*\*\*
  node $f
done
