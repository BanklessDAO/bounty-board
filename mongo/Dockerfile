FROM mongo
COPY . /usr/tmp/mongo
RUN chmod +x /usr/tmp/mongo
EXPOSE 27017
CMD usr/tmp/mongo/seed.sh