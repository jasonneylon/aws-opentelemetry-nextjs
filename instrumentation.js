import { registerOTel } from '@vercel/otel'

import {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-base";

export function register() {
  console.log("Registering OpenTelemetry")
  const config = {
    serviceName: 'next-app',
    spanProcessors: [
      new SimpleSpanProcessor(new ConsoleSpanExporter())
    ]
  }
  registerOTel(config)
}
