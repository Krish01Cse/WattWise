import { Request, Response } from 'express';
import { EnergyStore } from '../services/store.js';

export class ReportController {
  static async exportReport(req: Request, res: Response) {
    try {
      const range = (req.query.range as string) || '7D';
      const format = ((req.query.format as string) || 'csv').toLowerCase();

      if (format === 'csv') {
        const csvContent = await EnergyStore.generateCsvReport(range);
        const filename = `wattwise-telemetry-${range.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.status(200).send(csvContent);
      }

      // JSON format fallback
      const history = await EnergyStore.getHistory(range);
      const household = await EnergyStore.getHousehold();
      return res.status(200).json({
        status: 'success',
        household,
        range,
        generatedAt: new Date().toISOString(),
        records: history,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Report generation failed',
      });
    }
  }
}
