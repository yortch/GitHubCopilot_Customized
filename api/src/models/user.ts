/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - userId
 *         - email
 *         - passwordHash
 *       properties:
 *         userId:
 *           type: integer
 *           description: The unique identifier for the user
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address (used for login)
 *         passwordHash:
 *           type: string
 *           description: Hashed password
 *         isAdmin:
 *           type: boolean
 *           description: Whether the user has admin privileges
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *         resetToken:
 *           type: string
 *           description: Password reset token (if active)
 *         resetTokenExpiry:
 *           type: string
 *           format: date-time
 *           description: Expiry time for reset token
 */
export interface User {
    userId: number;
    email: string;
    passwordHash: string;
    isAdmin: boolean;
    createdAt: Date;
    resetToken?: string;
    resetTokenExpiry?: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegistration:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (minimum 8 characters)
 */
export interface UserRegistration {
    email: string;
    password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 */
export interface UserLogin {
    email: string;
    password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PasswordResetRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address to send reset link
 */
export interface PasswordResetRequest {
    email: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PasswordReset:
 *       type: object
 *       required:
 *         - resetToken
 *         - newPassword
 *       properties:
 *         resetToken:
 *           type: string
 *           description: Password reset token received via email
 *         newPassword:
 *           type: string
 *           format: password
 *           description: New password (minimum 8 characters)
 */
export interface PasswordReset {
    resetToken: string;
    newPassword: string;
}
