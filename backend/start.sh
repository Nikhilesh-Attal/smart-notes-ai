#!/bin/bash

# 1. Start the Python AI service in the background
python3 ai_service.py &

# 2. Start the Node.js server
npm start