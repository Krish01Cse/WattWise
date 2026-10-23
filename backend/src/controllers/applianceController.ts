import { Request, Response } from 'express';
import { EnergyStore } from '../services/store.js';

export class ApplianceController {
  static async list(req: Request, res: Response) {
    try {
      const appliances = await EnergyStore.getAppliances();
      const household = await EnergyStore.getHousehold();

      const totalDailyKwh = Number(appliances.reduce((sum, a) => sum + a.dailyKwh, 0).toFixed(2));
      const totalMonthlyKwh = Number((totalDailyKwh * 30).toFixed(1));
      const projectedMonthlyCost = Math.round(totalMonthlyKwh * household.baseTariffInr);

      return res.status(200).json({
        status: 'success',
        data: {
          summary: {
            totalAppliances: appliances.length,
            totalDailyKwh,
            totalMonthlyKwh,
            projectedMonthlyCostInr: projectedMonthlyCost,
            effectiveTariff: household.baseTariffInr,
          },
          appliances,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to fetch appliances',
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, category, count, wattage, hoursPerDay, icon, status } = req.body;

      if (!name || !wattage) {
        return res.status(400).json({
          status: 'error',
          message: 'Appliance name and wattage are required',
        });
      }

      const household = await EnergyStore.getHousehold();
      const appliance = await EnergyStore.addAppliance({
        householdId: household.id,
        name,
        category: category || 'custom',
        count: count ? Number(count) : 1,
        wattage: Number(wattage),
        hoursPerDay: hoursPerDay ? Number(hoursPerDay) : 4.0,
        dailyKwh: 0,
        icon: icon || '⚡',
        status: status || 'normal',
        isCustom: true,
      });

      return res.status(201).json({
        status: 'success',
        message: 'Custom appliance ingested into telemetry stream',
        data: appliance,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to add appliance',
      });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await EnergyStore.deleteAppliance(id);

      if (!success) {
        return res.status(404).json({
          status: 'error',
          message: 'Appliance not found',
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Appliance removed from telemetry load decomposition',
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to delete appliance',
      });
    }
  }
}
