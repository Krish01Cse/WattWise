import { Request, Response } from 'express';
import { INDIAN_CITIES, IndianCity } from '../data/indianCities.js';
import { NATIONAL_DISCOMS, getDiscomsForCity } from '../data/discoms.js';

export class ReferenceController {
  static async getCities(req: Request, res: Response) {
    try {
      const search = (req.query.search as string)?.toLowerCase();
      let results: IndianCity[] = INDIAN_CITIES;

      if (search) {
        results = INDIAN_CITIES.filter(
          (c: IndianCity) => c.name.toLowerCase().includes(search) || c.state.toLowerCase().includes(search)
        );
      }

      return res.status(200).json({
        status: 'success',
        count: results.length,
        data: results,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to fetch Indian cities',
      });
    }
  }

  static async getDiscoms(req: Request, res: Response) {
    try {
      const city = req.query.city as string;
      const state = (req.query.state as string) || '';

      if (city) {
        const discoms = getDiscomsForCity(city, state);
        return res.status(200).json({
          status: 'success',
          city,
          count: discoms.length,
          data: discoms,
        });
      }

      return res.status(200).json({
        status: 'success',
        city: 'All Regional Utilities',
        count: NATIONAL_DISCOMS.length,
        data: NATIONAL_DISCOMS,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message || 'Failed to fetch DISCOM utilities',
      });
    }
  }
}
