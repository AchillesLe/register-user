FROM golang:1.21-alpine

WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o mail-service .
EXPOSE 5000

CMD ["./mail-service"]