/// <reference path="./.sst/platform/config.d.ts" />


export default $config({
  app(input) {
    return {

      name: "aws-nextjs",
      providers: {
        aws: {
          profile: "sandbox",
        }
      },
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("MyBucket", {
      access: "private"
    });
    new sst.aws.Nextjs("MyWeb", {
      environment: {
        AWS_LAMBDA_EXEC_WRAPPER: "/opt/otel-instrument",
        OPENTELEMETRY_COLLECTOR_CONFIG_FILE: $interpolate`s3://${bucket.name}.s3.eu-west-1.amazonaws.com/collector.yaml`,
          OPENTELEMETRY_COLLECTOR_CONFIG_URI: $interpolate`s3://${bucket.name}.s3.eu-west-1.amazonaws.com/collector.yaml`,
          OPENTELEMETRY_EXTENSION_LOG_LEVEL: "debug",
          NEXT_OTEL_VERBOSE: 1
      },
      link: [bucket],
      permissions: [
        {
          actions: [
            "xray:PutTraceSegments",
            "xray:PutTelemetryRecords"
          ],
          resources: ["*"]
        }
      ],
      server: {
        layers: ["arn:aws:lambda:eu-west-1:615299751070:layer:AWSOpenTelemetryDistroJs:6"]
      },
      // This didn't work and I had to set it manually
      // transform: {
      //   server: (args, opts) => {
      //     console.dir(args);
      //     args.tracingConfig = {
      //       mode: "Active"
      //     };
      //   },
      // },
      warm: false
    });
  },
});
