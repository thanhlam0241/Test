FROM node:alpine
# FROM node:18.18-alpine3.18 as build
WORKDIR /Frontend

COPY . /Frontend

RUN npm install -g @angular/cli

RUN npm install

# RUN npm run build

CMD ["ng", "serve", "--host", "0.0.0.0"]

##### Dockerfile #####
## build stage ##
# FROM node:18.19-alpine as build
# WORKDIR /Frontend
# COPY . .
# RUN npm install -g @angular/cli
# RUN npm cache clean --force && npm install
# RUN npm install @angular-devkit/build-angular --force

# CMD ["npm", "start"]

# Use the latest version of the official Nginx image as the base image
# FROM nginx:latest
# # copy the custom nginx configuration file to the container in the default
# # location
# COPY nginx.conf /etc/nginx/nginx.conf
# # copy the built application from the build stage to the nginx html
# # directory
# COPY --from=build /Frontend/dist/ui/browser /usr/share/nginx/html

# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d

# EXPOSE 80
