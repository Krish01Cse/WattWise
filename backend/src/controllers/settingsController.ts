import { Request, Response } from 'express';
import { EnergyStore } from '../services/store.js';
import { isSupabaseConfigured } from '../config/supabase.js';

export class SettingsController {
  static async getSettings(req: Request, res: Response) {
    try {
      const email = (req.query.email as string) || (req.headers['x-user-email'] as string);
      const settings = await EnergyStore.getSettings(email);

      return res.status(200).json({
        status: 'success',
        data: {
          ...settings,
          isCloudSynced: isSupabaseConfigured,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to fetch settings configuration',
      });
    }
  }

  static async updateSettings(req: Request, res: Response) {
    try {
      const payload = req.body;
      const updated = await EnergyStore.updateSettings(payload);

      return res.status(200).json({
        status: 'success',
        message: 'Settings updated successfully and synchronized with cloud database',
        data: {
          ...updated,
          isCloudSynced: isSupabaseConfigured,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to update settings',
      });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword, email } = req.body;

      if (!newPassword || newPassword.length < 10) {
        return res.status(400).json({
          status: 'error',
          message: 'New password cipher must contain at least 10 characters.',
        });
      }

      const result = await EnergyStore.changePassword({
        email,
        currentPassword,
        newPassword,
      });

      if (!result.success) {
        return res.status(400).json({
          status: 'error',
          message: result.message,
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Access key password cipher updated successfully',
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to change password cipher',
      });
    }
  }

  static async resetSettings(req: Request, res: Response) {
    try {
      const reset = await EnergyStore.resetSettings();
      return res.status(200).json({
        status: 'success',
        message: 'Telemetry preferences restored to factory baseline defaults',
        data: reset,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to reset settings',
      });
    }
  }
}
