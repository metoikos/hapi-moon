FROM node:lts

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .

# uncomment for pm2 installation
# RUN npm install pm2 -g

CMD [ "npm", "start" ]

# uncomment to use with pm2
# CMD ["pm2-runtime", "start", "pm2-startup.json"]
