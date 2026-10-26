import type { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const createCustomerSchema = Joi.object({
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  phone_number: Joi.string().trim().optional().allow(null),
  gst_number: Joi.string().trim().optional().allow(null),
  is_active: Joi.boolean().optional(),
}).options({ allowUnknown: false });

const updateCustomerSchema = Joi.object({
  first_name: Joi.string().trim().optional(),
  last_name: Joi.string().trim().optional(),
  email: Joi.string().trim().email().optional(),
  phone_number: Joi.string().trim().optional().allow(null),
  gst_number: Joi.string().trim().optional().allow(null),
  is_active: Joi.boolean().optional(),
}).options({ allowUnknown: false });

const listCustomersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().trim().optional(),
  is_active: Joi.boolean().optional(),
}).options({ allowUnknown: false });

const createCustomerValidation = (request: Request, response: Response, next: NextFunction): void => {
  const { error, value } = createCustomerSchema.validate(request.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    response.status(400).json({ success: false, message: 'Validation failed', data: error.details.map((detail) => detail.message) });
    return;
  }
  request.body = value;
  next();
};

const updateCustomerValidation = (request: Request, response: Response, next: NextFunction): void => {
  const { error, value } = updateCustomerSchema.validate(request.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    response.status(400).json({ success: false, message: 'Validation failed', data: error.details.map((detail) => detail.message) });
    return;
  }
  request.body = value;
  next();
};

const listCustomersValidation = (request: Request, response: Response, next: NextFunction): void => {
  const { error, value } = listCustomersQuerySchema.validate(request.query, { abortEarly: false, stripUnknown: true });
  if (error) {
    response.status(400).json({ success: false, message: 'Validation failed', data: error.details.map((detail) => detail.message) });
    return;
  }
  next();
};

export { createCustomerValidation, updateCustomerValidation, listCustomersValidation };
