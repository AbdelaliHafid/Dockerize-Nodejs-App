#FROM node:12.2.0-alpine AS NO.1
FROM node:18-alpine3.14 AS NO.1

COPY . .

RUN npm install     
RUN npm install mysql
RUN npm install --location=global pkg
#RUN npm i nexe -g
RUN pkg login.js -t node12-linux-x64
#RUN nexe login.js -t linux-x86-12.2.0 -o myapp 


FROM ubuntu:latest AS NO.2

#COPY login.html ./
#COPY /static/* ./
#COPY register.html ./
#COPY package*.json ./

COPY --from=NO.1 login ./



EXPOSE 3000



 ENTRYPOINT ["./login"]
