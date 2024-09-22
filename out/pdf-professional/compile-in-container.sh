cd /data/out/pdf-professional
pdflatex -interaction=nonstopmode -output-directory=/data/out/pdf-professional /data/out/pdf-professional/generated.tex

# cleanup
rm /data/out/pdf-professional/*.aux
rm /data/out/pdf-professional/*.log
rm /data/out/pdf-professional/*.out