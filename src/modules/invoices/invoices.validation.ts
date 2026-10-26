import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const invoiceIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
}).options({ allowUnknown: true });

const createInvoiceSchema = Joi.object({
  customer_id: Joi.number().integer().positive().required(),
  invoice_date: Joi.string().isoDate().optional(),
  due_date: Joi.string().isoDate().required(),
  line_items: Joi.array().items(
    Joi.object({
      description: Joi.string().trim().min(1).required(),
      quantity: Joi.number().positive().precision(3).required(),
      unit_price: Joi.number().min(0).precision(2).required(),
      tax_rate: Joi.number().min(0).max(100).precision(2).required(),
    }).options({ allowUnknown: false }),
  ).min(1).required(),
}).options({ allowUnknown: false });

const listInvoicesSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  status: Joi.string().valid('DRAFT', 'ISSUED', 'PAID').optional(),
  customer_id: Joi.number().integer().positive().optional(),
}).options({ allowUnknown: false });

const createPaymentSchema = Joi.object({
  invoice_id: Joi.number().integer().positive().required(),
  customer_id: Joi.number().integer().positive().required(),
  payment_date: Joi.string().isoDate().optional(),
  amount: Joi.number().positive().precision(2).required(),
  payment_method: Joi.string().valid('CASH', 'BANK_TRANSFER', 'UPI').required(),
  reference_number: Joi.string().trim().max(255).optional().allow(null, ''),
}).options({ allowUnknown: false });

const validate = (schema: Joi.ObjectSchema) =>
  (request: Request, response: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(
      request.method === 'GET' ? request.query : request.body,
      { abortEarly: false, convert: true },
    );

    if (error) {
      response.status(400).json({
        success: false,
        message: 'Validation failed',
        data: error.details.map((detail) => detail.message),
      });
      return;
    }

    if (request.method !== 'GET') {
      request.body = value;
    }
    next();
  };

const validateInvoiceId = (request: Request, response: Response, next: NextFunction): void => {
  const { error } = invoiceIdSchema.validate(request.params, { abortEarly: false, convert: true });
  if (error) {
    response.status(400).json({
      success: false,
      message: 'Validation failed',
      data: error.details.map((detail) => detail.message),
    });
    return;
  }
  next();
};

const createInvoiceValidation = validate(createInvoiceSchema);
const listInvoicesValidation = validate(listInvoicesSchema);
const createPaymentValidation = validate(createPaymentSchema);

export { createInvoiceValidation, listInvoicesValidation, createPaymentValidation, validateInvoiceId };
