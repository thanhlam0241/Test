# FROM node:alpine
FROM node:18.18-alpine3.18 as build
WORKDIR /Frontend

COPY . /Frontend

RUN npm install -g @angular/cli

RUN npm install

RUN npm run build

# CMD ["ng", "serve", "--host", "0.0.0.0"]

# FROM node:18.18-alpine3.18 as build

# set the working directory to /app
# WORKDIR /app
# copy the current directory contents into the container at /app
# COPY . .
# install dependencies, matching package-lock.json
# RUN npm ci
# build the app
RUN npm run build

# Use the latest version of the official Nginx image as the base image
FROM nginx:latest
# copy the custom nginx configuration file to the container in the default
# location
COPY nginx.conf /etc/nginx/nginx.conf
# copy the built application from the build stage to the nginx html
# directory
COPY --from=build /Frontend/dist/ui/browser /usr/share/nginx/html
