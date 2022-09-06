# Kilogram
Kilogram is a social media platform where users can write posts, like posts, edit posts and delete posts.

Uses MongoDB, Mongoose, Express, React, Node.js, TypeScript

## Setup the Environment
  - Create a .env file in the main folder
  Fill it up with:
    - A MonogDB Connection URI (ex: http://localhost:27017/kilogram)

## How to run for production:  
  - `npm run production`  (this will install all packages, compile ts, build react, and serve frontend)
  - Now served on `http://localhost:8000`, but binded to all IP addresses (notice only dev mode runs with the 3000 ip)

## How to run for dev:  

First time: 
  - Either put `http://localhost:3000` in frontend/package.json proxy or `http://{myiponmynetwork}:8000` 
  - Run: `npm run setup-dev`
  - Now served on `http://localhost:3000`, but binded to all IP addresses

Any other time: 
  - `npm run dev`
  - Now served on `http://localhost:3000`, but binded to all IP addresses
