import { Request, Response } from 'express';
import { EnergyStore } from '../services/store.js';

export class AnomalyController {
  static async list(req: Request, res: Response) {
    try {
      const anomalies = await EnergyStore.getAnomalies();
      const active = anomalies.filter((a) => a.status === 'active');
      const totalExcessCost = Number(active.reduce((sum, a) => sum + a.excessCostInr, 0).toFixed(2));
      const totalExcessKwh = Number(active.reduce((sum, a) => sum + a.estimatedExcessKwh, 0).toFixed(2));

      return res.status(200).json({
        status: 'success',
        data: {
          summary: {
            activeCount: active.length,
            totalCount: anomalies.length,
            totalExcessCostInr: totalExcessCost,
            totalExcessKwh: totalExcessKwh,
          },
          anomalies,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to fetch anomaly alerts',
      });
    }
  }

  static async resolve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const anomaly = await EnergyStore.resolveAnomaly(id);

      if (!anomaly) {
        return res.status(404).json({
          status: 'error',
          message: 'Anomaly alert not found',
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Anomaly alert resolved and circuit breaker audit cycle acknowledged',
        data: anomaly,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to resolve anomaly',
      });
    }
  }
}
