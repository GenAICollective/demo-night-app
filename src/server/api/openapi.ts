import { generateOpenApiDocument } from "trpc-to-openapi";

import { appRouter } from "./root";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Demo Night App API",
  description: "API documentation for Demo Night App",
  version: "1.0.0",
  baseUrl: "http://localhost:3000/api",
});
