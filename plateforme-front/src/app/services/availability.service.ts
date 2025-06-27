// src/app/services/availability.service.ts
import { Injectable }             from '@angular/core';
import { HttpClient }             from '@angular/common/http';
import { Observable }             from 'rxjs';
import { environment }            from '../../environments/environment';

export interface Availability {
  id: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private readonly url = `${environment.apiUrl}/availabilities`;

  constructor(private readonly http: HttpClient) {}

  /** Récupère tous les créneaux disponibles */
  getAvailableSlots(): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.url}/available`);
  }

}
       