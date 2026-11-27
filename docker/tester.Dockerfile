# -------------------------------
# Stage 1: Build frunami-tester
# -------------------------------
FROM golang:1.26.2 AS builder
WORKDIR /src/tester

COPY tester/go.mod tester/go.sum ./
RUN go mod download

COPY tester/ .
RUN CGO_ENABLED=0 go build -o /out/frunami-tester .

# -------------------------------
# Stage 2: Runtime
# -------------------------------
FROM debian:bookworm-slim
WORKDIR /frunami-tester

COPY --from=builder /out/frunami-tester ./frunami-tester
