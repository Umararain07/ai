import SupportTicket from '../models/SupportTicket.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import asyncHandler from '../middleware/async.js';
import { analyzeWithAI } from '../services/aiService.js';

// @desc    Get all support tickets
// @route   GET /api/v1/support
// @access  Private
export const getSupportTickets = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single support ticket
// @route   GET /api/v1/support/:id
// @access  Private
export const getSupportTicket = asyncHandler(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id).populate({
    path: 'user',
    select: 'name email'
  });

  if (!ticket) {
    return next(
      new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is ticket owner or admin/support
  if (
    ticket.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'support'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this ticket`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc    Create support ticket
// @route   POST /api/v1/support
// @access  Private
export const createSupportTicket = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Analyze with AI for initial response
  const aiResponse = await analyzeWithAI(req.body.message);
  
  const ticket = await SupportTicket.create({
    ...req.body,
    aiResponse: aiResponse.message,
    aiConfidence: aiResponse.confidence
  });

  res.status(201).json({
    success: true,
    data: ticket
  });
});

// @desc    Update support ticket
// @route   PUT /api/v1/support/:id
// @access  Private
export const updateSupportTicket = asyncHandler(async (req, res, next) => {
  let ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is ticket owner or admin/support
  if (
    ticket.user.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'support'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this ticket`,
        401
      )
    );
  }

  ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc    Delete support ticket
// @route   DELETE /api/v1/support/:id
// @access  Private
export const deleteSupportTicket = asyncHandler(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    return next(
      new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is ticket owner or admin/support
  if (
    ticket.user.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'support'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this ticket`,
        401
      )
    );
  }

  await ticket.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});