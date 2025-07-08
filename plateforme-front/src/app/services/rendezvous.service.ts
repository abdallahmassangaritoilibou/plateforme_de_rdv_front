// src/app/services/rendezvous.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';


export interface RendezVousDTO {
  id: number;
  availabilityId: number 
  startTime: string;
  endTime: string; 
  status: string;
}

@Injectable({ providedIn: 'root' })
export class RendezVousService {
  private readonly url = `${environment.apiUrl}/rendezvous`;

  constructor(
  private readonly http: HttpClient,
  private readonly storage: StorageService
) {}
create(rdvDto: {userId: number; availabilityId: number; status: string; }) {
  return this.http.post<RendezVousDTO>(`${this.url}`, rdvDto);
}

getMine(): Observable<RendezVousDTO[]> {
  const userId = this.storage.get('userId');
  console.log('userId récupéré du storage:', userId); 
  return this.http.get<RendezVousDTO[]>(`${this.url}/user/${userId}`);
}

cancelRdv(rdv: RendezVousDTO) {
  const updated = {
    ...rdv,
    status: 'ANNULE'
  };
  return this.http.put(`${this.url}/${rdv.id}`, updated);
}

}