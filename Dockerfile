FROM node

# update packages for package manager
RUN apt-get update


ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 4.3.1

# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH


RUN npm install -g node-inspector


# Create app directory
RUN mkdir -p /usr/src/app

COPY . /usr/src/app

CMD ["npm" "install"]

WORKDIR /usr/src/app

EXPOSE 8008 8000 8080 5858 443

CMD [ "node", "src/app.js" ]