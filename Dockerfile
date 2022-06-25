FROM node:18-alpine3.14 AS NO.1

COPY package*.json ./

COPY login.js ./
COPY login.html ./
COPY register.html ./
COPY static/style.css ./
COPY static ./
RUN npm install 
RUN npm install mysql
RUN npm install dotenv
RUN npm install -g pkg
RUN pkg login.js -t node12-linux-x64



FROM ubuntu:latest AS NO.2

COPY login.html ./
COPY static/style.css ./
COPY --from=NO.1 login  ./
COPY --from=NO.1 login.js  ./



EXPOSE 3000

ENTRYPOINT [ "./login" ]
 
