// src/app/services/rendezvous.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

export interface RendezVous {
  id: number;
  availability: number; // ID du créneau réservé
  userId: number; // ID de l'utilisateur qui a réservé
  dateCreation: string; // Date de création du RDV (ISO 8601)
  status: string; // Statut du RDV (par exemple, "CONFIRMED", "CANCELED")
  modificationdate: string; // Date de dernière modification du RDV (ISO 8601)
}

@Injectable({ providedIn: 'root' })
export class RendezVousService {
  private readonly url = `${environment.apiUrl}/rendezvous`;

  constructor(
  private readonly http: HttpClient,
  private readonly storage: StorageService
) {}
create(rdvDto: {user: { id: number }; availability: string; status: string; }) {
  return this.http.post<RendezVous>(`${this.url}`, rdvDto);
}

getMine(): Observable<RendezVous[]> {
  const userId = this.storage.get('userId');
  return this.http.get<RendezVous[]>(`${this.url}/user/${userId}`);
}
}