FROM node:18-alpine3.14 AS NO.1

COPY . .

RUN npm install     
RUN npm install mysql
RUN npm install --location=global pkg
RUN pkg login.js -t node12-linux-x64


FROM ubuntu:latest AS NO.2



COPY --from=NO.1 login ./



EXPOSE 3000



 ENTRYPOINT ["./login"]
