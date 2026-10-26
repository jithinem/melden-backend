class InvoiceError extends Error {
  constructor(message: string, readonly statusCode: number) {
    super(message);
    this.name = 'InvoiceError';
  }
}

export { InvoiceError };
