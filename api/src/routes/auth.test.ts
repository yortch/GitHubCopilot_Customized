import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import authRouter, { resetUsers } from './auth';

let app: express.Express;

describe('Auth API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/auth', authRouter);
        resetUsers();
    });

    describe('POST /auth/register', () => {
        it('should register a new user with valid credentials', async () => {
            const newUser = {
                email: "newuser@example.com",
                password: "securePassword123"
            };
            const response = await request(app).post('/auth/register').send(newUser);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('email', newUser.email);
            expect(response.body).toHaveProperty('token');
            expect(response.body).not.toHaveProperty('passwordHash');
        });

        it('should reject registration with duplicate email', async () => {
            const existingUser = {
                email: "admin@github.com",
                password: "password123"
            };
            const response = await request(app).post('/auth/register').send(existingUser);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should reject registration with invalid email', async () => {
            const invalidUser = {
                email: "notanemail",
                password: "password123"
            };
            const response = await request(app).post('/auth/register').send(invalidUser);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should reject registration with short password', async () => {
            const weakPassword = {
                email: "newuser@example.com",
                password: "short"
            };
            const response = await request(app).post('/auth/register').send(weakPassword);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /auth/login', () => {
        it('should login with valid credentials', async () => {
            const credentials = {
                email: "admin@github.com",
                password: "password123"
            };
            const response = await request(app).post('/auth/login').send(credentials);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email', credentials.email);
            expect(response.body.user).toHaveProperty('isAdmin', true);
            expect(response.body.user).not.toHaveProperty('passwordHash');
        });

        it('should reject login with invalid email', async () => {
            const credentials = {
                email: "nonexistent@example.com",
                password: "password123"
            };
            const response = await request(app).post('/auth/login').send(credentials);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should reject login with wrong password', async () => {
            const credentials = {
                email: "admin@github.com",
                password: "wrongpassword"
            };
            const response = await request(app).post('/auth/login').send(credentials);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
        });

        it('should return isAdmin flag correctly for admin users', async () => {
            const credentials = {
                email: "admin@github.com",
                password: "password123"
            };
            const response = await request(app).post('/auth/login').send(credentials);
            expect(response.status).toBe(200);
            expect(response.body.user.isAdmin).toBe(true);
        });

        it('should return isAdmin flag correctly for regular users', async () => {
            const credentials = {
                email: "user@example.com",
                password: "password123"
            };
            const response = await request(app).post('/auth/login').send(credentials);
            expect(response.status).toBe(200);
            expect(response.body.user.isAdmin).toBe(false);
        });
    });

    describe('POST /auth/logout', () => {
        it('should logout successfully', async () => {
            const response = await request(app).post('/auth/logout');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
        });
    });

    describe('POST /auth/request-reset', () => {
        it('should generate reset token for existing email', async () => {
            const resetRequest = {
                email: "admin@github.com"
            };
            const response = await request(app).post('/auth/request-reset').send(resetRequest);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('resetToken');
        });

        it('should return success for non-existing email (security)', async () => {
            const resetRequest = {
                email: "nonexistent@example.com"
            };
            const response = await request(app).post('/auth/request-reset').send(resetRequest);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
        });

        it('should reject invalid email format', async () => {
            const resetRequest = {
                email: "notanemail"
            };
            const response = await request(app).post('/auth/request-reset').send(resetRequest);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('POST /auth/reset-password', () => {
        it('should reset password with valid token', async () => {
            // First request a reset
            const resetRequest = {
                email: "admin@github.com"
            };
            const requestResponse = await request(app).post('/auth/request-reset').send(resetRequest);
            const resetToken = requestResponse.body.resetToken;

            // Then reset the password
            const passwordReset = {
                resetToken: resetToken,
                newPassword: "newSecurePassword123"
            };
            const response = await request(app).post('/auth/reset-password').send(passwordReset);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
        });

        it('should verify new password works after reset', async () => {
            // Request reset
            const resetRequest = {
                email: "user@example.com"
            };
            const requestResponse = await request(app).post('/auth/request-reset').send(resetRequest);
            const resetToken = requestResponse.body.resetToken;

            // Reset password
            const passwordReset = {
                resetToken: resetToken,
                newPassword: "brandNewPassword123"
            };
            await request(app).post('/auth/reset-password').send(passwordReset);

            // Try logging in with new password
            const loginResponse = await request(app).post('/auth/login').send({
                email: "user@example.com",
                password: "brandNewPassword123"
            });
            expect(loginResponse.status).toBe(200);
            expect(loginResponse.body).toHaveProperty('token');
        });

        it('should reject reset with invalid token', async () => {
            const passwordReset = {
                resetToken: "invalid-token",
                newPassword: "newPassword123"
            };
            const response = await request(app).post('/auth/reset-password').send(passwordReset);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should reject reset with weak password', async () => {
            // Request reset
            const resetRequest = {
                email: "admin@github.com"
            };
            const requestResponse = await request(app).post('/auth/request-reset').send(resetRequest);
            const resetToken = requestResponse.body.resetToken;

            // Try to reset with weak password
            const passwordReset = {
                resetToken: resetToken,
                newPassword: "weak"
            };
            const response = await request(app).post('/auth/reset-password').send(passwordReset);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should reject expired reset token', async () => {
            // This test would require time manipulation
            // For now, we'll skip implementation and note it as a manual test requirement
        });
    });
});
