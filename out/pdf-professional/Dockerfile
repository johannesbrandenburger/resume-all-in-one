FROM ghcr.io/typst/typst:latest

VOLUME /home
WORKDIR /home

# compile a demo document to download the needed packages
# import "@preview/oxifmt:0.2.1": strfmt
RUN mkdir /ttemp
WORKDIR /ttemp
RUN echo "#import \"@preview/oxifmt:0.2.1\": strfmt" > /ttemp/main.typ
RUN typst compile /ttemp/main.typ
RUN rm -rf /ttemp

# compile the document
WORKDIR /home
ENTRYPOINT [ "typst", "compile", "./out/pdf-professional/main.typ", "--root", "/home" ]
