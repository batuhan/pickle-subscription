FROM node:alpine
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json /usr/src/app/
RUN yarn
COPY . /usr/src/app
RUN yarn build
CMD [ "yarn", "start" ]
