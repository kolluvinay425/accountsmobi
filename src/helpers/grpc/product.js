import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";

let client;

const configGrpcProducts = () => {
  if (!client) {
    const PROTO_PATH = path.resolve(
      process.cwd(),
      "src/proto/ProductService.proto"
    );
    console.log(PROTO_PATH);

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
    const {
      product: { ProductService },
    } = protoDescriptor;

    client = new ProductService(
      process.env.PRODUCT_SERVICE_GRPC,
      grpc.credentials.createInsecure(),
      {
        "grpc.keepalive_time_ms": 10000, // Send keepalive pings every 10 seconds
        "grpc.keepalive_timeout_ms": 5000, // Wait 5 seconds for ping ack before considering the connection dead
      }
    );
  }
};

const getProduct = (productId) => {
  console.log("----------_> from grpc testing");
  if (!client) {
    configGrpcProducts();
  }
  return new Promise((resolve, reject) => {
    const data = { product_id: productId };

    // Make the gRPC call to productService
    client.getProduct(data, (err, response) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        // Resolve the Promise with the response in case of success
        resolve(response);
        console.log(response);
      }
    });
  });
};

export { getProduct };
