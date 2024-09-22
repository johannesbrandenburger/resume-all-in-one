# simple Dockerfile to compile a pdf using pdflatex

FROM ubuntu:18.04

# install texlive and pdflatex
RUN apt-get update
RUN apt-get install -y texlive
RUN apt-get install -y texlive-fonts-recommended

# mount the volume
VOLUME /data

# set the working directory
WORKDIR /data

# run the compile-in-container.sh script
CMD [ "/bin/bash", "/data/out/pdf-professional/compile-in-container.sh" ]

# build the image from root directory
# docker build -t pdf-professional ./out/pdf-professional

# run the container
# docker run -v $(pwd):/data pdf-professional