FROM node:alpine
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
# Install app dependencies
RUN yarn
RUN yarn build
CMD [ "yarn", "start" ]
