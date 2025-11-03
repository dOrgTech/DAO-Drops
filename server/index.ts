/**
 * ====================================
 * MAIN SERVER FILE
 * ====================================
 *
 * This is the entry point for your application server.
 * It sets up Express, MongoDB connection, middleware, and routes.
 *
 * CUSTOMIZATION GUIDE:
 * - All configuration values are stored in config.ts for easy customization
 * - Environment variables should be set in your .env file
 * - The server uses several security and performance middleware (see below)
 *
 * SECURITY NOTE:
 * This server includes production-ready security measures:
 * - Helmet for HTTP header security
 * - Rate limiting to prevent abuse
 * - CORS configuration for cross-origin requests
 */

// ====================================
// DEPENDENCIES
// ====================================

import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import * as dotenv from 'dotenv'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

// ====================================
// ROUTES AND CONFIGURATION
// ====================================

import postRoutes from './routes/posts.js'
import { SERVER_CONFIG, RATE_LIMIT_CONFIG, API_ROUTES, CONSOLE_MESSAGES } from './config.js'

// ====================================
// APP INITIALIZATION
// ====================================

const app = express()
dotenv.config() // Load environment variables from .env file

// ====================================
// RATE LIMITING CONFIGURATION
// ====================================

/**
 * Rate limiter prevents API abuse by limiting requests per IP address
 * Configuration is pulled from config.ts (RATE_LIMIT_CONFIG)
 *
 * CUSTOMIZATION:
 * - Adjust RATE_LIMIT_CONFIG in config.ts to modify limits
 * - Current default: 50 requests per 15 minutes per IP
 */
const limiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  limit: RATE_LIMIT_CONFIG.MAX_REQUESTS,
  standardHeaders: RATE_LIMIT_CONFIG.STANDARD_HEADERS,
  legacyHeaders: RATE_LIMIT_CONFIG.LEGACY_HEADERS,
})

// ====================================
// MIDDLEWARE SETUP
// ====================================

/**
 * Middleware stack (order matters!):
 *
 * 1. express.json() - Parses incoming JSON request bodies
 * 2. express.urlencoded() - Parses URL-encoded request bodies
 * 3. cors() - Enables Cross-Origin Resource Sharing
 *    CUSTOMIZATION: See config.ts CORS_CONFIG to restrict origins in production
 * 4. helmet() - Adds security HTTP headers
 * 5. compression() - Compresses response bodies for better performance
 * 6. limiter - Applies rate limiting to all routes
 */
app.use(express.json({ limit: SERVER_CONFIG.REQUEST_BODY_LIMIT }))
app.use(express.urlencoded({ limit: SERVER_CONFIG.REQUEST_BODY_LIMIT, extended: true }))
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(limiter)

// ====================================
// ROUTE CONFIGURATION
// ====================================

/**
 * Mount all post-related routes at the base path defined in config.ts
 * Default: /posts
 *
 * CUSTOMIZATION:
 * - Change API_ROUTES.POSTS_BASE in config.ts to modify the base path
 * - Add additional route files here as your application grows
 */
app.use(API_ROUTES.POSTS_BASE, postRoutes)

// ====================================
// DATABASE AND SERVER STARTUP
// ====================================

/**
 * MongoDB connection URL from environment variables
 *
 * REQUIRED: Add ATLAS_URL to your .env file
 * Format: mongodb+srv://username:password@cluster.mongodb.net/database
 */
const CONNECTION_URL = process.env.ATLAS_URL as string

/**
 * Server port - uses environment variable or falls back to default
 * Default port is configured in config.ts (SERVER_CONFIG.DEFAULT_PORT)
 */
const PORT = process.env.PORT || SERVER_CONFIG.DEFAULT_PORT

/**
 * Connect to MongoDB and start the Express server
 *
 * TROUBLESHOOTING:
 * - If connection fails, check your ATLAS_URL in .env
 * - Ensure your MongoDB cluster allows connections from your IP
 * - Check that your database user has proper permissions
 */
mongoose
  .connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(CONSOLE_MESSAGES.SERVER.RUNNING(PORT))))

  .catch((error) => console.log(error.message))
