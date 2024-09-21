FROM ghcr.io/typst/typst:latest

VOLUME /home
WORKDIR /home

ENTRYPOINT [ "typst", "compile", "./out/pdf-professional/main.typ", "--root", "/home" ]