import { Injectable, OnModuleInit, HttpException } from '@nestjs/common';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { NominatimReverseDto, NominatioumFilterDto } from 'types/nominatim';

dotenv.config();

@Injectable()
export class NominatimService {
  private searchUrl =
    process.env.NOMINATIM_SEARCH ||
    'https://nominatim.openstreetmap.org/search';
  private reverseUrl =
    process.env.NOMINATIM_REVERSE ||
    'https://nominatim.openstreetmap.org/reverse';
  private userAgent =
    process.env.GEOCODER_USER_AGENT || 'MyNestApp/1.0 (default@example.com)';

  async search(query: NominatioumFilterDto) {
    if (!query) throw new HttpException('Missing query parameter', 400);

    const url = `${this.searchUrl}?format=json&q=${encodeURIComponent(query.q)}&addressdetails=1&limit=5`;

    const response = await fetch(url, {
      headers: { 'User-Agent': this.userAgent },
    });

    if (!response.ok) {
      throw new HttpException(
        `Nominatim error: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  }

  async reverse(query: NominatimReverseDto) {
    let lat = Number(query.lat);
    let lon = Number(query.lon);
    if (!lat || !lon) throw new HttpException('Missing coordinates', 400);

    const url = `${this.reverseUrl}?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

    const response = await fetch(url, {
      headers: { 'User-Agent': this.userAgent },
    });

    if (!response.ok) {
      throw new HttpException(
        `Nominatim error: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();

    return data;
  }
}
