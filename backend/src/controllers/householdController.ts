import { Request, Response } from 'express';
import { EnergyStore } from '../services/store.js';

export class HouseholdController {
  static async getCurrent(req: Request, res: Response) {
    try {
      const household = await EnergyStore.getHousehold();
      return res.status(200).json({
        status: 'success',
        data: household,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to fetch household configuration',
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updates = req.body;
      const updatedHousehold = await EnergyStore.updateHousehold(updates);
      return res.status(200).json({
        status: 'success',
        message: 'Household configuration updated successfully',
        data: updatedHousehold,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to update household',
      });
    }
  }

  static async completeSetup(req: Request, res: Response) {
    try {
      const {
        residenceName,
        residentsCount,
        city,
        state,
        housingType,
        sanctionedLoadKw,
        phaseType,
        discomName,
        discomCode,
        tariffStructure,
        baseTariffInr,
        monthlyBudgetInr,
        telemetrySource,
        appliances,
      } = req.body;

      // Update household details
      const household = await EnergyStore.updateHousehold({
        residenceName: residenceName || 'Bandra Residence',
        residentsCount: residentsCount ? Number(residentsCount) : 4,
        city: city || 'Mumbai',
        state: state || 'Maharashtra',
        housingType: housingType || 'apartment',
        sanctionedLoadKw: sanctionedLoadKw ? Number(sanctionedLoadKw) : 5.0,
        phaseType: phaseType || 'single_phase',
        discomName: discomName || 'Tata Power Mumbai',
        discomCode: discomCode || 'TPC-M',
        tariffStructure: tariffStructure || 'slab',
        baseTariffInr: baseTariffInr ? Number(baseTariffInr) : 7.5,
        monthlyBudgetInr: monthlyBudgetInr ? Number(monthlyBudgetInr) : 4500,
        telemetrySource: telemetrySource || 'dataset_historical',
      });

      // If appliances array was passed during wizard completion, sync with Supabase
      if (Array.isArray(appliances) && appliances.length > 0) {
        await EnergyStore.syncAppliances(
          household.id,
          appliances.map((app) => ({
            householdId: household.id,
            name: app.name,
            category: app.category || 'general',
            count: Number(app.count) || 1,
            wattage: Number(app.wattage) || 100,
            hoursPerDay: Number(app.hoursPerDay) || 4,
            dailyKwh: Number(app.dailyKwh) || 0.4,
            icon: app.icon || '⚡',
            status: app.status || 'normal',
            isCustom: Boolean(app.isCustom),
          }))
        );
      }

      return res.status(200).json({
        status: 'success',
        message: '4-Stage Household Setup successfully completed and locked in database',
        data: {
          household,
          redirectUrl: '/dashboard',
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Setup submission failed',
      });
    }
  }
}
