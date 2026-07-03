export class PortalError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class UnauthorizedError extends PortalError {
  constructor(message = "You must be signed in to continue.") {
    super(message, 401);
  }
}

export class ForbiddenError extends PortalError {
  constructor(message = "You do not have permission to perform this action.") {
    super(message, 403);
  }
}

export class NotFoundError extends PortalError {
  constructor(message = "The requested resource was not found.") {
    super(message, 404);
  }
}

export class ValidationError extends PortalError {
  readonly fields?: Record<string, string>;

  constructor(message: string, fields?: Record<string, string>) {
    super(message, 422);
    this.fields = fields;
  }
}

export class PaymentRequiredError extends PortalError {
  constructor(message = "A valid payment method is required to continue.") {
    super(message, 402);
  }
}

export class ConflictError extends PortalError {
  constructor(message = "This action conflicts with an existing record.") {
    super(message, 409);
  }
}

export class ExternalProviderError extends PortalError {
  readonly provider: string;

  constructor(provider: string, message = "An external service request failed. Please try again.") {
    super(message, 502);
    this.provider = provider;
  }
}

export function isPortalError(error: unknown): error is PortalError {
  return error instanceof PortalError;
}

export function toClientMessage(error: unknown): string {
  if (error instanceof PortalError) return error.message;
  return "An unexpected error occurred. Please try again.";
}
