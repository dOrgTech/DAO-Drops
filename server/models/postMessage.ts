/**
 * ====================================
 * POST MESSAGE MODEL
 * ====================================
 *
 * This model represents project submissions from users.
 * It stores all projects that have been submitted for consideration.
 *
 * PURPOSE:
 * - Collect project submissions during the initial submission phase
 * - Store all submission details including contact information
 * - Provide a pool of projects for administrators to review
 *
 * WORKFLOW:
 * 1. Users submit projects via POST /posts endpoint (createPost controller)
 * 2. Submissions are validated and protected by reCAPTCHA
 * 3. Projects are stored in this collection
 * 4. Administrators review submissions
 * 5. Selected projects are promoted to the Picks collection
 *
 * DATA MANAGEMENT:
 * - Delete all posts: npm run seed:posts-delete
 * - View posts: Query this collection via MongoDB or add a getPosts endpoint
 *
 * CUSTOMIZATION:
 * - Add additional fields for your specific use case
 * - Modify validation in routes/posts.ts
 * - Update types/index.ts (IPostMessage) when adding/removing fields
 */

// ====================================
// DEPENDENCIES
// ====================================

import mongoose from 'mongoose'
import { IPostMessage } from '../types/index.js'

// ====================================
// SCHEMA DEFINITION
// ====================================

/**
 * PostMessage Schema
 *
 * FIELDS:
 * - name: Project name (required, min 5 characters per validation)
 * - message: Project description/pitch (required)
 * - address: Blockchain wallet or contract address (optional)
 * - link: Project website or relevant URL (optional)
 * - contact: Contact information like email, Discord handle, etc. (optional)
 * - contactMethod: Preferred way to contact (email, Discord, Telegram, etc.) (optional)
 * - image: URL to project logo or screenshot (optional)
 * - createdAt: Timestamp of when the submission was created
 *
 * CUSTOMIZATION:
 * - Add fields like: category, tags, fundingGoal, teamSize, etc.
 * - Add validation: required: true, minlength, maxlength
 * - Add indexes for search functionality
 * - Add enum for contactMethod: { type: String, enum: ['email', 'discord', 'telegram'] }
 */
const postSchema = new mongoose.Schema({
  name: String,
  message: String,
  address: String,
  link: String,
  contact: String,
  contactMethod: String,
  image: String,
  createdAt: {
    type: Date,
    default: new Date(), // Automatically set to submission time
  },
})

// ====================================
// MODEL EXPORT
// ====================================

/**
 * PostMessage Model
 *
 * COLLECTION NAME: 'postmessages' (automatically pluralized and lowercased by Mongoose)
 *
 * USAGE EXAMPLES:
 * - Create submission: await PostMessage.create(submissionData)
 * - Find all: await PostMessage.find()
 * - Find recent: await PostMessage.find().sort({ createdAt: -1 }).limit(10)
 * - Delete all: await PostMessage.deleteMany() (used by scoreSeeder -dp)
 */
const PostMessage = mongoose.model<IPostMessage>('PostMessage', postSchema)

export default PostMessage
