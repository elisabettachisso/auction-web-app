FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./app/package.json /usr/src/app
COPY ./app/package-lock.json /usr/src/app
RUN npm install --build-from-source
RUN npm install -g nodemon
COPY ./app /usr/src/app
EXPOSE 3000
