GEN_PROTO_DIR = gen-proto
PROTOC = protoc
GO_OUT = --go_out=$(GEN_PROTO_DIR)
GO_GRPC_OUT = --go-grpc_out=$(GEN_PROTO_DIR)
PROTO_FILES = user.proto

generate:
	@mkdir -p $(GEN_PROTO_DIR)
	$(PROTOC) $(GO_OUT) --go_opt=paths=source_relative $(GO_GRPC_OUT) --go-grpc_opt=paths=source_relative $(PROTO_FILES)

clean:
	rm -rf $(GEN_PROTO_DIR)/*.go
