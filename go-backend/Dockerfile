FROM docker.io/golang:1-alpine AS builder

RUN apk --no-cache add git

COPY . ./

ENV GOPATH=$PWD

RUN go build -o ./tmp/proxy ./main.go

FROM scratch

COPY --from=builder /go/tmp/* /usr/local/bin/
COPY --from=builder /go/tmp/* /usr/local/bin/