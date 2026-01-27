/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid input or email already exists
 * 
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     isAdmin:
 *                       type: boolean
 *       401:
 *         description: Invalid credentials
 * 
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 * 
 * /api/auth/request-reset:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetRequest'
 *     responses:
 *       200:
 *         description: Reset token generated (if email exists)
 *       400:
 *         description: Invalid email format
 * 
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordReset'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token or weak password
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRegistration, UserLogin, PasswordResetRequest, PasswordReset } from '../models/user';
import { users as seedUsers } from '../seedData';
import crypto from 'crypto';

const router = express.Router();

// JWT secret (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory user storage
let users: User[] = [...seedUsers];

// Reset function for testing
export const resetUsers = () => {
    users = [...seedUsers];
};

// Email validation helper
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation helper
const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
};

// Generate JWT token
const generateToken = (userId: number, email: string, isAdmin: boolean): string => {
    return jwt.sign({ userId, email, isAdmin }, JWT_SECRET, { expiresIn: '24h' });
};

// POST /auth/register - Register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, password }: UserRegistration = req.body;

        // Validate email
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password
        if (!isValidPassword(password)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user
        const newUser: User = {
            userId: users.length > 0 ? Math.max(...users.map(u => u.userId)) + 1 : 1,
            email,
            passwordHash,
            isAdmin: false,
            createdAt: new Date()
        };

        users.push(newUser);

        // Generate token
        const token = generateToken(newUser.userId, newUser.email, newUser.isAdmin);

        // Return user without password
        res.status(201).json({
            userId: newUser.userId,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /auth/login - Login with email and password
router.post('/login', async (req, res) => {
    try {
        const { email, password }: UserLogin = req.body;

        // Find user by email
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user.userId, user.email, user.isAdmin);

        // Return user and token without password
        res.status(200).json({
            token,
            user: {
                userId: user.userId,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /auth/logout - Logout (client-side token removal)
router.post('/logout', (req, res) => {
    // In a JWT-based system, logout is handled client-side by removing the token
    // This endpoint exists for consistency and potential future server-side token blacklisting
    res.status(200).json({ message: 'Logout successful' });
});

// POST /auth/request-reset - Request password reset
router.post('/request-reset', (req, res) => {
    try {
        const { email }: PasswordResetRequest = req.body;

        // Validate email
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Find user by email
        const user = users.find(u => u.email === email);
        
        // Always return success to prevent email enumeration (security best practice)
        // But only generate token if user exists
        if (user) {
            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

            // Update user with reset token
            user.resetToken = resetToken;
            user.resetTokenExpiry = resetTokenExpiry;

            // In production, send reset token via email
            // For demo/testing, return it in the response
            return res.status(200).json({ 
                message: 'If the email exists, a reset link has been sent',
                resetToken // Only for testing - remove in production
            });
        }

        res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /auth/reset-password - Reset password with token
router.post('/reset-password', async (req, res) => {
    try {
        const { resetToken, newPassword }: PasswordReset = req.body;

        // Validate new password
        if (!isValidPassword(newPassword)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        // Find user with matching reset token
        const user = users.find(u => u.resetToken === resetToken);
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Check if token is expired
        if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update user password and clear reset token
        user.passwordHash = passwordHash;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
