### Getting Started

### DEPLOYED APLICATION

You can acess the current project runnig at link: [https://wrld-xpl.netlify.app](https://wrld-xpl.netlify.app)

# BRANCH AND VERSION

- Make sure you are at branch >> `master` <<

# RUN LOCAL

Make sure you have all dependencies necessary installed. 
BUILD: `npm i` or `npm install`

Copy `.env.example` to `.env.local` and set `REST_COUNTRIES_API_KEY` with a key from https://restcountries.com/sign-up. The app calls Countries API v5 at `https://api.restcountries.com/countries/v5`.

RUN: `npm run dev`
The application will run on port `3001` or `3000` by default


## RUN DOCKER

To build the Docker image, run the following command in the project root:
BUILD: `docker:build`

To run the Docker container, use the following command
RUN: `docker:run`
The application will run on port `3000` or `3001` by default


### About the project

This is a lightweight web application built with Next.js, React, and TypeScript, designed to allow users to search and filter countries. The app fetches data from a public countries API. 

The entire project is Dockerized to ensure easy setup, consistent development environments, and streamlined deployment