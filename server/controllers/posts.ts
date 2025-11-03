/**
 * ====================================
 * POSTS CONTROLLER
 * ====================================
 *
 * This file contains all controller functions for handling API requests.
 * Controllers process incoming requests, interact with the database,
 * and return appropriate responses.
 *
 * MAIN FUNCTIONS:
 * 1. createPost - Submit a new project (with reCAPTCHA verification)
 * 2. getScore - Retrieve user's score (with Web3 authentication)
 * 3. getPicks - Get list of curated projects
 * 4. updateScore - Submit user's point allocations (with Web3 authentication)
 *
 * SECURITY FEATURES:
 * - Google reCAPTCHA verification for spam protection
 * - Web3 token authentication for wallet-based auth
 * - Input validation via express-validator (in routes)
 *
 * CUSTOMIZATION GUIDE:
 * - All error messages and status codes are in config.ts
 * - Modify authentication logic to match your requirements
 * - Add additional controller functions as needed
 */

// ====================================
// DEPENDENCIES
// ====================================

import { Request, Response } from 'express'
import PostMessage from '../models/postMessage.js'
import GetScore from '../models/scores.js'
import Picks from '../models/picks.js'
import Web3Token from 'web3-token'
import fetch from 'node-fetch'
import { IPostMessageBody, IScoreUpdateBody, IPickItem, IWeb3TokenVerification } from '../types/index.js'
import { CAPTCHA_CONFIG, WEB3_AUTH_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '../config.js'

// ====================================
// CONTROLLER FUNCTIONS
// ====================================

// OPTIONAL: Uncomment this function if you need to retrieve all submitted projects
// /**
//  * Retrieve all submitted projects from the database
//  *
//  * USE CASE: Admin panel or public project listing
//  *
//  * @async
//  * @param {Request} req - Express request object
//  * @param {Response} res - Express response object
//  * @return {Promise<void>} Returns the list of submitted projects
//  */
// export const getPosts = async (req, res) => {
//   try {
//     const postMessages = await PostMessage.find();
//     res.status(200).json(postMessages);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

/**
 * Create a new project submission with reCAPTCHA verification
 *
 * WORKFLOW:
 * 1. Receive project submission from user
 * 2. Verify reCAPTCHA token to prevent spam
 * 3. If valid, save project to database
 * 4. Return saved project data
 *
 * AUTHENTICATION:
 * - Requires valid Google reCAPTCHA token in 'captcha-token' header
 * - Get your reCAPTCHA keys: https://www.google.com/recaptcha/admin
 *
 * CUSTOMIZATION:
 * - To disable reCAPTCHA, remove the verification step (not recommended for production)
 * - Configure reCAPTCHA settings in config.ts (CAPTCHA_CONFIG)
 * - Add CAPTHCA_SECRET_KEY to your .env file
 *
 * @async
 * @function createPost
 * @param {Request<{}, {}, IPostMessageBody>} req - Request with project data in body and captcha-token header
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns the created project (201) or error (422/500)
 * @example
 * // POST /posts
 * // Headers: { 'captcha-token': 'reCAPTCHA_token' }
 * // Body: { name: "Project", message: "Description", address: "0x..." }
 */
export const createPost = async (req: Request<{}, {}, IPostMessageBody>, res: Response): Promise<void> => {
  const body = req.body
  try {
    // Create new post message instance from submitted data
    const newPost = new PostMessage(body)

    // Extract reCAPTCHA token from request headers
    const captchaToken = req.headers['captcha-token'] as string

    // Verify reCAPTCHA token with Google's API
    const response = await fetch(
      `${CAPTCHA_CONFIG.VERIFY_URL}?secret=${process.env.CAPTHCA_SECRET_KEY}&response=${captchaToken}`,
      { method: 'post' },
    )
    const captchaResponse = (await response.json()) as { success: boolean }

    // Only save if reCAPTCHA verification succeeds
    if (captchaResponse.success) {
      try {
        await newPost.save()
        res.status(HTTP_STATUS.CREATED).json(newPost)
      } catch (error: any) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message })
      }
    } else {
      // reCAPTCHA verification failed - likely spam or bot
      res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(captchaResponse)
    }
  } catch (error: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

/**
 * Retrieve a user's score using Web3 wallet authentication
 *
 * WORKFLOW:
 * 1. Verify Web3 token from request header
 * 2. Extract wallet address from verified token
 * 3. Fetch user's score from database
 * 4. Verify the requesting address matches the score owner
 * 5. Return score data if authorized
 *
 * AUTHENTICATION:
 * - Requires Web3 token in 'auth' header
 * - Token must be signed by the user's wallet
 * - Token must contain expected statement (configured in config.ts)
 *
 * SECURITY:
 * - Prevents users from viewing other users' scores
 * - Verifies token signature to ensure authenticity
 * - Case-insensitive address comparison for consistency
 *
 * CUSTOMIZATION:
 * - Change EXPECTED_STATEMENT in config.ts (WEB3_AUTH_CONFIG)
 * - Modify to allow public score viewing by removing address check
 *
 * @async
 * @function getScore
 * @param {Request<{ id: string }>} req - Request with account address as URL parameter and auth header
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns the user's score data (200) or error (401/500)
 * @example
 * // GET /posts/score/0x1234...
 * // Headers: { 'auth': 'Web3_signed_token' }
 */
export const getScore = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id: _id } = req.params
  try {
    // Verify Web3 token from header
    const token = req.headers['auth'] as string
    const { address, body } = (await Web3Token.verify(token)) as IWeb3TokenVerification

    // Fetch score from database
    const score = await GetScore.findOne({ account: _id })

    // Verify: score exists, addresses match, and token has correct statement
    if (
      score &&
      address.toLowerCase() == score.account.toLowerCase() &&
      body.statement == WEB3_AUTH_CONFIG.EXPECTED_STATEMENT
    ) {
      try {
        res.status(HTTP_STATUS.OK).json(score)
      } catch (error: any) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message })
      }
    } else {
      // Unauthorized: token invalid or user trying to access another user's score
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED_USER })
    }
  } catch (error: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

/**
 * Retrieve all curated projects (picks) from the database
 *
 * WORKFLOW:
 * 1. Fetch all picks from database
 * 2. Return complete list to client
 *
 * USE CASE:
 * - Display available projects for users to allocate points to
 * - Public endpoint - no authentication required
 *
 * DATA MANAGEMENT:
 * - Picks are managed via pickSeeder.ts script
 * - Import picks from pickData/Picks.json using: npm run seed:picks-import
 * - See pickSeeder.ts for more data management operations
 *
 * CUSTOMIZATION:
 * - Add filtering/sorting by modifying the .find() query
 * - Add pagination for large datasets
 * - Cache results for better performance
 *
 * @async
 * @function getPicks
 * @param {Request} _req - Express request object (unused)
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns array of all curated projects (200) or error (504)
 * @example
 * // GET /posts/picks/
 */
export const getPicks = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Retrieve all picks from database
    const picks = await Picks.find()
    res.status(HTTP_STATUS.OK).json(picks)
  } catch (error: any) {
    res.status(HTTP_STATUS.GATEWAY_TIMEOUT).json({ message: error.message })
  }
}

/**
 * Submit point allocations and update project scores
 *
 * WORKFLOW:
 * 1. Verify Web3 token authenticity
 * 2. Extract wallet address and signed data
 * 3. Validate that submitted points match user's available score
 * 4. Update user's pick selections in database
 * 5. Update each selected project's score
 *
 * AUTHENTICATION:
 * - Requires Web3 token containing user's picks signed by their wallet
 * - Token body.statement must equal JSON.stringify(picks array)
 * - This ensures picks weren't tampered with after signing
 *
 * VALIDATION:
 * - Verifies total submitted points equals user's available score
 * - Prevents users from allocating more points than they have
 * - Prevents manipulation by requiring signed picks data
 *
 * SCORE CALCULATION:
 * - User's total points are distributed across selected projects
 * - Each project's currentScore is incremented by allocated points
 * - User's picks are stored for verification and potential auditing
 *
 * CUSTOMIZATION:
 * - Modify scoring logic in the loop that updates picks
 * - Add additional validation rules as needed
 * - Consider adding transaction rollback on partial failures
 *
 * SECURITY NOTES:
 * - The signed message body must exactly match the picks array
 * - Case-insensitive address comparison for consistency
 * - All point allocations are logged in the database
 *
 * @async
 * @function updateScore
 * @param {Request<{ id: string }, {}, IScoreUpdateBody>} req - Request with score ID, account data and Web3 signed token
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns updated score data (200) or error (401/403/500)
 * @example
 * // PATCH /posts/score/507f1f77bcf86cd799439011
 * // Body: { account: "0x...", score: 100, picks: [{id: "...", points: 50}], message: "Web3Token" }
 */
export const updateScore = async (req: Request<{ id: string }, {}, IScoreUpdateBody>, res: Response): Promise<void> => {
  const { id: _id } = req.params
  const accountData = req.body
  const picksArry: IPickItem[] = accountData.picks
  const numberofPicks = picksArry.length
  let add: string = ''
  let bod: string = ''
  let submittedUscore = 0

  // Verify Web3 token and extract address
  try {
    const token = accountData.message
    const { address, body } = (await Web3Token.verify(token)) as IWeb3TokenVerification
    add = address.toLowerCase()
    bod = body.statement
  } catch (error: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message })
    return
  }

  // Fetch user's current score from database
  const accountInfo = await GetScore.findOne({ account: add })

  // Verify address matches and token contains the picks data (prevents tampering)
  if (add == accountData.account.toLowerCase() && bod == JSON.stringify(picksArry)) {
    // Calculate total points being submitted
    for (let i = 0; i < numberofPicks; i++) {
      submittedUscore = parseInt(picksArry[i].points.toString()) + submittedUscore
    }

    // Validate that submitted points match user's available score
    if (!accountInfo || accountInfo.score != submittedUscore) {
      console.log(accountInfo?.score)
      console.log(submittedUscore)

      res.status(HTTP_STATUS.FORBIDDEN).json({ message: ERROR_MESSAGES.SCORE_MISMATCH })
    } else {
      // Update user's score record with their picks
      const updatedScore = await GetScore.findByIdAndUpdate(_id, accountData, {
        new: true,
      })

      // Update each selected project's score
      for (let i = 0; i < numberofPicks; i++) {
        const pick = await Picks.findOne({ _id: picksArry[i].id })
        if (pick) {
          const oldScore = pick.currentScore
          let newScore = picksArry[i].points + oldScore
          // Update project with new points and cumulative score
          await Picks.findByIdAndUpdate(
            picksArry[i].id,
            { currentPoints: picksArry[i].points, currentScore: newScore },
            {
              new: true,
            },
          )
        }
      }
      res.json(updatedScore)
    }
  } else {
    // Unauthorized: address mismatch or picks were tampered with
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED_USER })
  }
}
