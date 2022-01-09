FROM amd64/alpine as builder
RUN apk update && apk add ca-certificates

FROM scratch

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY medieval-dynasty-app /medieval-dynasty-app
COPY frontend /local/spa
ENV SPA_DIR=/local/spa

EXPOSE 8080

CMD ["/medieval-dynasty-app", "start"]
