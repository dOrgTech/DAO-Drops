/**
 * ====================================
 * CONFIGURATION FILE
 * ====================================
 *
 * This file contains all configurable settings for the application.
 * Before deploying your own fork, review and modify these settings
 * to match your requirements.
 *
 * IMPORTANT: Sensitive credentials should still be stored in environment
 * variables (.env file). This config file is for non-sensitive settings
 * and default values.
 */

// ====================================
// SERVER CONFIGURATION
// ====================================

/**
 * Server port configuration
 * The server will listen on this port unless overridden by PORT environment variable
 */
export const SERVER_CONFIG = {
  /** Default port if PORT env variable is not set */
  DEFAULT_PORT: 5000,

  /** Request body size limits for JSON and URL-encoded data */
  REQUEST_BODY_LIMIT: '30mb',
}

// ====================================
// CORS (Cross-Origin Resource Sharing)
// ====================================

/**
 * CORS configuration for controlling which domains can access your API
 *
 * Options:
 * - "*" : Allow all origins (good for development)
 * - "https://yourdomain.com" : Allow specific domain (recommended for production)
 * - false : Use the conditional logic based on NODE_ENV
 */
export const CORS_CONFIG = {
  /**
   * Set to "*" to allow all origins, or specify your frontend domain
   * Example: "https://www.daodrops.io" or "http://localhost:3000"
   */
  ORIGIN: '*',

  /**
   * Production domain (used if you want conditional CORS based on environment)
   * Uncomment the conditional logic in index.ts to use this
   */
  PRODUCTION_ORIGIN: 'https://www.daodrops.io',
}

// ====================================
// RATE LIMITING
// ====================================

/**
 * Rate limiting prevents abuse by limiting the number of requests
 * a single IP address can make within a time window
 *
 * DEVELOPMENT: Increased limits for testing
 * PRODUCTION: Reduce MAX_REQUESTS to 50 for security
 */
export const RATE_LIMIT_CONFIG = {
  /** Time window in milliseconds (default: 15 minutes) */
  WINDOW_MS: 15 * 60 * 1000,

  /** Maximum number of requests per IP within the time window */
  MAX_REQUESTS: process.env.NODE_ENV === 'development' ? 500 : 50,

  /** Return rate limit info in RateLimit-* headers */
  STANDARD_HEADERS: true,

  /** Disable legacy X-RateLimit-* headers */
  LEGACY_HEADERS: false,
}

// ====================================
// GOOGLE reCAPTCHA
// ====================================

/**
 * reCAPTCHA configuration for spam protection
 * Get your keys from: https://www.google.com/recaptcha/admin
 *
 * NOTE: The secret key should be stored in .env as CAPTHCA_SECRET_KEY
 */
export const CAPTCHA_CONFIG = {
  /** Google reCAPTCHA verification endpoint */
  VERIFY_URL: 'https://www.google.com/recaptcha/api/siteverify',

  /**
   * Secret key is loaded from environment variable CAPTHCA_SECRET_KEY
   * Add to your .env file: CAPTHCA_SECRET_KEY=your_secret_key_here
   */
}

// ====================================
// WEB3 AUTHENTICATION
// ====================================

/**
 * Web3 token authentication settings
 * Used for verifying signed messages from wallet addresses
 */
export const WEB3_AUTH_CONFIG = {
  /**
   * Expected statement in signed messages for authentication
   * This should match what users sign in their wallet
   */
  EXPECTED_STATEMENT: 'This is a signed message',
}

// ====================================
// API ROUTES
// ====================================

/**
 * Base paths for API endpoints
 * Change these if you want different route structures
 */
export const API_ROUTES = {
  /** Base route for posts endpoints */
  POSTS_BASE: '/posts',

  /** Sub-route for score operations */
  SCORE_ROUTE: '/score/:id',

  /** Sub-route for picks operations */
  PICKS_ROUTE: '/picks/',

  /** Sub-route for creating posts */
  CREATE_POST_ROUTE: '/',

  /** Sub-route for updating scores */
  UPDATE_SCORE_ROUTE: '/score/:id',
}

// ====================================
// VALIDATION RULES
// ====================================

/**
 * Field validation requirements for API endpoints
 * Adjust these based on your business requirements
 */
export const VALIDATION_RULES = {
  POST_MESSAGE: {
    /** Name field validation */
    NAME: {
      MIN_LENGTH: 5,
      ERROR_MESSAGE: 'Name must have more than 5 characters',
    },
    /** Message field validation */
    MESSAGE: {
      ERROR_MESSAGE: 'Message should be a string',
    },
  },

  SCORE_UPDATE: {
    /** Account address validation */
    ACCOUNT: {
      ERROR_MESSAGE: 'Name must have more than 5 characters',
    },
    /** Score field validation */
    SCORE: {
      ERROR_MESSAGE: 'address left blank',
    },
    /** Picks array validation */
    PICKS: {
      ERROR_MESSAGE: 'picks cannot be left blank',
    },
    /** Message/token validation */
    MESSAGE: {
      ERROR_MESSAGE: 'Message should be a signed token',
    },
  },
}

// ====================================
// HTTP STATUS CODES
// ====================================

/**
 * Standardized HTTP status codes used throughout the application
 * Modify if you want different status code conventions
 */
export const HTTP_STATUS = {
  /** Successful responses */
  OK: 200,
  CREATED: 201,

  /** Client error responses */
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,

  /** Server error responses */
  INTERNAL_SERVER_ERROR: 500,
  GATEWAY_TIMEOUT: 504,
}

// ====================================
// ERROR MESSAGES
// ====================================

/**
 * Standardized error messages
 * Customize these to match your application's tone
 */
export const ERROR_MESSAGES = {
  /** Authentication errors */
  UNAUTHORIZED_USER: 'Anauthorized User',

  /** Score validation errors */
  SCORE_MISMATCH: 'Submitted score doesnt match DB score for user',

  /** Generic error message */
  GENERIC_ERROR: 'An error occurred',
}

// ====================================
// DATABASE CONFIGURATION
// ====================================

/**
 * MongoDB collection names
 * Change these if you want different collection names in your database
 *
 * NOTE: If you change these, you'll need to update the mongoose models
 * or use the collection() method to override default naming
 */
export const DATABASE_CONFIG = {
  COLLECTIONS: {
    /** Posts/project submissions collection */
    POST_MESSAGES: 'postmessages',

    /** User scores collection */
    SCORES: 'getscores',

    /** Curated picks/projects collection */
    PICKS: 'picks',
  },
}

// ====================================
// DATA SEEDING CONFIGURATION
// ====================================

/**
 * File paths and settings for database seeding operations
 * Used by pickSeeder.ts and scoreSeeder.ts
 */
export const SEEDER_CONFIG = {
  /** Picks data file configuration */
  PICKS: {
    /** Directory containing picks data */
    DATA_DIRECTORY: '/pickData',

    /** JSON file name for picks import */
    INPUT_FILE: 'Picks.json',

    /** CSV file name for picks export */
    EXPORT_FILE: 'exportedPicks.csv',

    /** Fields to include in CSV export */
    EXPORT_FIELDS: ['projectName', 'projectDescription', 'website', 'address', 'contact', 'contactMethod'],
  },

  /** Scores data file configuration */
  SCORES: {
    /** Directory containing score data */
    DATA_DIRECTORY: '/scoreData',

    /** JSON file name for scores import */
    INPUT_FILE: 'ScoreSheet.json',

    /** CSV file name for participant export */
    PARTICIPANTS_EXPORT_FILE: 'exportedAccounts.csv',

    /** CSV file name for point data export */
    POINT_DATA_EXPORT_FILE: 'exportedPointData.csv',

    /** Fields to include in participant CSV export */
    PARTICIPANTS_EXPORT_FIELDS: ['address'],

    /** Fields to include in point data CSV export */
    POINT_DATA_EXPORT_FIELDS: ['address', 'picks', 'message'],
  },
}

// ====================================
// CONSOLE MESSAGES
// ====================================

/**
 * Console log messages for better debugging and monitoring
 * Customize these messages to your preference
 */
export const CONSOLE_MESSAGES = {
  SERVER: {
    RUNNING: (port: number | string) => `Server running on port: ${port}`,
  },

  SEEDER: {
    PICKS_IMPORTED: 'Picks Imported to Mongo DB',
    PICKS_DELETED: 'Picks deleted from Mongo DB',
    PICKS_EXPORTED: 'Picks exported from Mongo DB',
    SCORES_IMPORTED: 'ScoreSheet Imported to Mongo DB',
    SCORES_DELETED: 'ScoreSheet deleted from Mongo DB',
    SCORES_EXPORTED: 'Scores exported from Mongo DB',
    POSTS_DELETED: 'ScoreSheet deleted from Mongo DB',
    ENTRY_ADDED: 'entry added to mongoDB',
  },
}

// ====================================
// ENVIRONMENT VARIABLES REFERENCE
// ====================================

/**
 * Documentation of required environment variables
 * Create a .env file in the root directory with these variables:
 *
 * ATLAS_URL=your_mongodb_connection_string
 * PORT=5000 (optional, defaults to 5000)
 * CAPTHCA_SECRET_KEY=your_recaptcha_secret_key
 * NODE_ENV=development (or production)
 *
 * Example .env file:
 * ```
 * ATLAS_URL=mongodb+srv://username:password@cluster.mongodb.net/database
 * PORT=5000
 * CAPTHCA_SECRET_KEY=your_secret_key_here
 * NODE_ENV=development
 * ```
 */
