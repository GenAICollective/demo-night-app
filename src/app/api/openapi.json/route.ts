import { NextResponse } from "next/server";

import { openApiDocument } from "~/server/api/openapi";

export const GET = () => {
  return NextResponse.json(openApiDocument);
};
