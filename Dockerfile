
# TYPST INSTALLATION
FROM ghcr.io/typst/typst:latest

# compile a demo document to download the needed packages
# import "@preview/oxifmt:0.2.1": strfmt
RUN mkdir /ttemp
WORKDIR /ttemp
RUN echo "#import \"@preview/oxifmt:0.2.1\": strfmt" > /ttemp/main.typ
RUN typst compile /ttemp/main.typ
RUN rm -rf /ttemp

# NODE INSTALLATION
RUN apk add --no-cache nodejs npm
RUN npm install -g nodemon
RUN npm install -g ts-node

EXPOSE 3000:3000

# # MOUNT THE WORKING DIRECTORY
VOLUME /home
WORKDIR /home

# execute npm i in out/pdf-professional and out/web
# RUN cd /home/out/web && npm i
# RUN cd /home/out/pdf-professional && npm i

# RUN THE watch.sh SCRIPT
CMD [ "sh", "/home/watch.sh" ]