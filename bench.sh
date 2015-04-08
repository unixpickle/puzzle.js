#!/bin/bash

for f in */bench/*.js
do
  echo \*\*\* $f \*\*\*
  node $f
done
