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

      // If live Supabase auth is available
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return res.status(401).json({
            status: 'error',
            message: error.message || 'Invalid credentials or account not registered in system',
          });
        }

        const profile = await EnergyStore.getProfile();
        return res.status(200).json({
          status: 'success',
          message: 'Operator authenticated successfully',
          data: {
            session: data.session,
            user: data.user,
            profile,
          },
        });
      }

      // Local / Offline Node Auth Validation: Must be a signed-up operator
      const validation = await EnergyStore.validateUserCredentials(email, password);
      if (!validation.valid || !validation.user) {
        return res.status(401).json({
          status: 'error',
          message: validation.reason || 'Account not found. You must sign up before logging in.',
        });
      }

      const profile = await EnergyStore.getProfile();
      return res.status(200).json({
        status: 'success',
        message: 'Operator session established',
        data: {
          token: 'demo-jwt-wattwise-telemetry-token',
          user: {
            id: validation.user.id,
            email: validation.user.email,
            fullName: validation.user.fullName,
            nodeId: validation.user.nodeId,
          },
          profile,
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
      const { email, password, fullName } = req.body;

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

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || 'New Operator',
            },
          },
        });

        if (error) {
          return res.status(400).json({
            status: 'error',
            message: error.message,
          });
        }

        return res.status(201).json({
          status: 'success',
          message: 'Operator node registered successfully',
          data: data,
        });
      }

      // Register user in store
      try {
        const newUser = await EnergyStore.registerUser({
          email,
          password,
          fullName,
        });

        return res.status(201).json({
          status: 'success',
          message: 'Operator registered successfully',
          data: {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
            nodeId: newUser.nodeId,
          },
        });
      } catch (regErr: any) {
        return res.status(409).json({
          status: 'error',
          message: regErr.message || 'User already exists',
        });
      }
    } catch (err: any) {
      return res.status(500).json({
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
