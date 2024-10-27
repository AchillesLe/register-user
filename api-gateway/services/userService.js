
const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./proto/user/user.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const USER_SERVICE_URL = process.env.USER_SERVICE_URL
const UserService = grpc.loadPackageDefinition(packageDefinition).UserService;

const client = new UserService(USER_SERVICE_URL,grpc.credentials.createInsecure());

module.exports = client;