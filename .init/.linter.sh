#!/bin/bash
cd /home/kavia/workspace/code-generation/weather-view-31118-31127/weather_app_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

