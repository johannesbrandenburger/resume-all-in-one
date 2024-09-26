#!/bin/bash

echo "running update.sh"
typst compile main.typ

# copy the pdf to the web folder (for the download link)
npx ts-node ./copy-to-web.ts