import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'

console.log(process.env.OTEL_EXPORTER_OTLP_ENDPOINT)
console.log(process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT)

const sdk = new NodeSDK({
  // The OTEL_EXPORTER_OTLP_ENDPOINT env var is passed into "new OTLPTraceExporter" automatically.
  // If the OTEL_EXPORTER_OTLP_ENDPOINT env var is not set the "new OTLPTraceExporter" will
  // default to use "http://localhost:4317" for gRPC and "http://localhost:4318" for HTTP.
  // This sample is using gRPC.
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new FetchInstrumentation(),
  ],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'next-app',
  }),
})
sdk.start()
