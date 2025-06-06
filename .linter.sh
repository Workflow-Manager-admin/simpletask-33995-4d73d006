#!/bin/bash
cd /home/kavia/workspace/code-generation/simpletask-33995-4d73d006/simpletask
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

