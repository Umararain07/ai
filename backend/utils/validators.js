import { body, validationResult } from 'express-validator';
import ErrorResponse from './ErrorResponse.js';

// Validation middleware
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => err.msg);
    next(new ErrorResponse(errorMessages, 400));
  };
};

// User validation rules
export const userValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ];
};

// Login validation rules
export const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ];
};

// Digital ID validation rules
export const digitalIdValidationRules = () => {
  return [
    body('idNumber').notEmpty().withMessage('ID number is required'),
    body('expiryDate').isDate().withMessage('Please provide a valid expiry date')
  ];
};

// Support ticket validation rules
export const supportTicketValidationRules = () => {
  return [
    body('subject')
      .notEmpty()
      .withMessage('Subject is required')
      .isLength({ max: 100 })
      .withMessage('Subject must be less than 100 characters'),
    body('message')
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ max: 5000 })
      .withMessage('Message must be less than 5000 characters'),
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn([
        'general',
        'account',
        'digital-id',
        'security',
        'payments',
        'technical'
      ])
      .withMessage('Invalid category')
  ];
};