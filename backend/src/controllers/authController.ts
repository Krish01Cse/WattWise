import { Request, Response } from 'express';
import { EnergyStore } from '../services/store.js';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Both email and password are required',
        });
      }

      // Validate credentials against Supabase credinals table and HashMap
      const validation = await EnergyStore.validateUserCredentials(email, password);
      if (!validation.valid || !validation.user) {
        return res.status(401).json({
          status: 'error',
          message: validation.reason || 'Account not found. You must sign up before logging in.',
        });
      }

      // If Supabase Auth is configured, attempt non-blocking sync
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.signInWithPassword({ email, password });
        } catch (e) {
          // Non-blocking fallback
        }
      }

      const profile = await EnergyStore.getProfile();
      const token = `wtw_${Date.now()}_jwt`;
      const user = {
        id: validation.user.id,
        email: validation.user.email,
        fullName: validation.user.fullName,
        nodeId: validation.user.nodeId,
      };

      return res.status(200).json({
        status: 'success',
        message: 'Operator authenticated successfully',
        token,
        user,
        data: {
          token,
          user,
          profile: {
            ...profile,
            email: validation.user.email,
            fullName: validation.user.fullName,
          },
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Authentication failed',
      });
    }
  }

  static async signup(req: Request, res: Response) {
    try {
      const { email, password, fullName, ...otherDetails } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Email and password are required',
        });
      }

      if (password.length < 10) {
        return res.status(400).json({
          status: 'error',
          message: 'Your password must contain at least 10 characters.',
        });
      }

      // Register user in store (HashMap and Supabase credinals & credentials table)
      const newUser = await EnergyStore.registerUser({
        email,
        password,
        fullName: fullName || 'Operator',
        signupDetails: {
          ...otherDetails,
          signupTimestamp: new Date().toISOString(),
          registeredSource: 'web_portal',
        },
      });

      // Synchronize with Supabase Auth if configured (non-blocking)
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName || 'Operator',
              },
            },
          });
        } catch (authErr) {
          console.warn('[SUPABASE AUTH] signUp notice:', authErr);
        }
      }

      const token = `wtw_${Date.now()}_jwt`;
      const user = {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        nodeId: newUser.nodeId,
      };

      return res.status(201).json({
        status: 'success',
        message: 'Operator registered successfully in Supabase credinals table',
        token,
        user,
        data: {
          token,
          user,
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          nodeId: newUser.nodeId,
        },
      });
    } catch (err: any) {
      return res.status(409).json({
        status: 'error',
        message: err.message || 'Registration failed',
      });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const profile = await EnergyStore.getProfile();
      const household = await EnergyStore.getHousehold();
      return res.status(200).json({
        status: 'success',
        data: {
          profile,
          activeHousehold: household,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to fetch current operator',
      });
    }
  }
}
