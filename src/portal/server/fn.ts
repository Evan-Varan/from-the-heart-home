// Server-only — base patterns for portal server functions.
//
// Flow: route component -> portal hook/action -> server function -> service -> database
//
// Auth middleware is wired in spec 01. Until then, portal server functions
// that need auth should call assertAuthenticated() manually inside the handler.

import { createServerFn } from "@tanstack/react-start";
import { toClientMessage } from "../lib/errors";

export type { ServerFn } from "@tanstack/react-start";

// Wraps a server function handler so PortalErrors surface their message
// while unexpected errors produce a generic safe message for the client.
export function withErrorBoundary<TInput, TOutput>(
  handler: (input: TInput) => Promise<TOutput>,
): (input: TInput) => Promise<TOutput> {
  return async (input) => {
    try {
      return await handler(input);
    } catch (error) {
      throw new Error(toClientMessage(error));
    }
  };
}

// Re-export createServerFn so portal code has one import path.
export { createServerFn };
