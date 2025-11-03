/**
 * ====================================
 * POSTS ROUTES
 * ====================================
 *
 * This file defines all API routes related to posts, scores, and picks.
 * Routes are mounted at the base path defined in config.ts (default: /posts)
 *
 * AVAILABLE ENDPOINTS:
 * - GET  /posts/score/:id - Retrieve user's score by account address
 * - GET  /posts/picks/    - Retrieve all curated projects
 * - POST /posts/          - Submit a new project
 * - PATCH /posts/score/:id - Update user's point allocations
 *
 * CUSTOMIZATION:
 * - All route paths are configurable in config.ts (API_ROUTES)
 * - Validation rules are configurable in config.ts (VALIDATION_RULES)
 * - Add new routes here and corresponding controllers in controllers/posts.ts
 *
 * VALIDATION:
 * - Uses express-validator for request body validation
 * - Validation rules are applied before controller functions execute
 * - Failed validations return appropriate error responses
 */

// ====================================
// DEPENDENCIES
// ====================================

import express from 'express'
import { body } from 'express-validator'
import {
  // getPosts,
  createPost,
  getScore,
  updateScore,
  getPicks,
} from '../controllers/posts.js'
import { VALIDATION_RULES, API_ROUTES } from '../config.js'

// ====================================
// ROUTER INITIALIZATION
// ====================================

const router = express.Router()

// All routes in this file are prefixed with the base path from config.ts
// Default base path: /posts
// Example: router.get('/score/:id') becomes GET /posts/score/:id

// ====================================
// ROUTE DEFINITIONS
// ====================================

/**
 * OPTIONAL: Uncomment to enable retrieval of all submitted projects
 * Endpoint: GET /posts
 * Use case: Admin panel or public project listing
 */
// router.get("/", getPosts);

/**
 * GET /posts/score/:id
 *
 * Retrieve a user's score data
 *
 * PARAMETERS:
 * - :id - User's wallet address
 *
 * HEADERS:
 * - auth: Web3 token signed by the user's wallet
 *
 * RESPONSE:
 * - 200: User score data { account, score, picks, message }
 * - 401: Unauthorized (invalid token or address mismatch)
 * - 500: Server error
 */
router.get(API_ROUTES.SCORE_ROUTE, getScore)

/**
 * GET /posts/picks/
 *
 * Retrieve all curated projects available for point allocation
 *
 * AUTHENTICATION: None required (public endpoint)
 *
 * RESPONSE:
 * - 200: Array of all picks/projects
 * - 504: Gateway timeout error
 */
router.get(API_ROUTES.PICKS_ROUTE, getPicks)

/**
 * POST /posts/
 *
 * Submit a new project for consideration
 *
 * HEADERS:
 * - captcha-token: Google reCAPTCHA token
 *
 * BODY (all fields are validated):
 * - name: string (required, min 5 characters)
 * - message: string (required, project description)
 * - address: string (optional, wallet/contract address)
 * - link: string (optional, project website)
 * - contact: string (optional, contact information)
 * - contactMethod: string (optional, preferred contact method)
 * - image: string (optional, project image URL)
 *
 * RESPONSE:
 * - 201: Created project data
 * - 422: reCAPTCHA validation failed
 * - 500: Server error
 *
 * CUSTOMIZATION:
 * - Modify validation rules in config.ts (VALIDATION_RULES.POST_MESSAGE)
 * - Add/remove fields in the validation array below
 */
router.post(
  API_ROUTES.CREATE_POST_ROUTE,
  [
    body('name').notEmpty().trim().withMessage(VALIDATION_RULES.POST_MESSAGE.NAME.ERROR_MESSAGE),
    body('message').notEmpty().withMessage(VALIDATION_RULES.POST_MESSAGE.MESSAGE.ERROR_MESSAGE),
    body('address').optional().trim(),
    body('link').optional().trim(),
    body('contact').optional(),
    body('contactMethod').optional().trim(),
    body('image').optional().trim(),
  ],
  createPost,
)

/**
 * PATCH /posts/score/:id
 *
 * Update user's score by submitting point allocations to projects
 *
 * PARAMETERS:
 * - :id - MongoDB document ID of the user's score record
 *
 * BODY (all fields are validated):
 * - account: string (required, user's wallet address)
 * - score: number (required, total points available)
 * - picks: array (required, array of { id, points } objects)
 * - message: string (required, Web3 token containing signed picks)
 *
 * AUTHENTICATION:
 * - Web3 token must be signed by the user's wallet
 * - Token body must contain JSON.stringify(picks)
 * - This prevents tampering with point allocations
 *
 * RESPONSE:
 * - 200: Updated score data
 * - 401: Unauthorized (invalid token or address mismatch)
 * - 403: Forbidden (score mismatch - user trying to allocate more points than available)
 * - 500: Server error
 *
 * CUSTOMIZATION:
 * - Modify validation rules in config.ts (VALIDATION_RULES.SCORE_UPDATE)
 * - Add additional validation for picks array items
 */
router.patch(
  API_ROUTES.UPDATE_SCORE_ROUTE,
  [
    body('account').notEmpty().trim().withMessage(VALIDATION_RULES.SCORE_UPDATE.ACCOUNT.ERROR_MESSAGE),
    body('score').isNumeric().notEmpty().trim().withMessage(VALIDATION_RULES.SCORE_UPDATE.SCORE.ERROR_MESSAGE),
    body('picks').isArray().notEmpty().withMessage(VALIDATION_RULES.SCORE_UPDATE.PICKS.ERROR_MESSAGE),
    body('message').notEmpty().withMessage(VALIDATION_RULES.SCORE_UPDATE.MESSAGE.ERROR_MESSAGE),
  ],
  updateScore,
)

export default router
