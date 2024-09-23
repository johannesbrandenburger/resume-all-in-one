#!/bin/bash

# check if typst-builder is already built
if [ "$(docker images -q typst-builder 2> /dev/null)" == "" ]; then
  docker build -t typst-builder .
fi

# build the project
docker run -v $(pwd)/../..:/home --rm typst-builder

# copy the pdf to the web folder (for the download link)
npx ts-node ./copy-to-web.ts