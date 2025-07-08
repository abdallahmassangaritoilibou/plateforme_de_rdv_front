// src/app/booking.component.ts

import { Component, OnInit }                 from '@angular/core';
import { CommonModule}                      from '@angular/common';
import { RouterModule, Router }              from '@angular/router';
import { MatCardModule }                     from '@angular/material/card';
import { MatListModule }                     from '@angular/material/list';
import { MatButtonModule }                   from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule }    from '@angular/material/snack-bar';

import { AvailabilityService } from '../services/availability.service';
import { RendezVousService } from '../services/rendezvous.service';
import { StorageService } from '../services/storage.service';



interface Availability {
  id: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}
interface CreateRdvRequest {
  userId: number;
  availabilityId: number;
  status: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  slots: Availability[] = [];
  Loading = false;


  constructor(
    private readonly availService: AvailabilityService,
    private readonly rdvService: RendezVousService,
    private readonly snack: MatSnackBar,
    private readonly router: Router,
    private readonly storage: StorageService
  ) {}

  ngOnInit(): void {

    const userId = this.storage.get('userId');
  if (!userId) {
    // pas connecté → on redirige et on notifie
    this.snack.open("Vous devez être connecté pour réserver.", 'Fermer', { duration: 4000 });
    this.router.navigate(['/login']);
    return;
  }
  this.availService.getAvailableSlots().subscribe(slots => {
    this.slots = slots;
  });
}

 reserve(slot: Availability): void {
  console.log('Réservation pour le slot:', slot);
  this.Loading = true;

   // Convertir le userId stocké (string|null) en number
    const userIdStr = this.storage.get('userId');
    const userId = userIdStr ? Number(userIdStr) : NaN;

    if (isNaN(userId)) {
      this.snack.open("ID utilisateur invalide.", 'Fermer', { duration: 4000 });
      this.router.navigate(['/login']);
      return;
  }
  const rdvRequest : CreateRdvRequest = {
    userId: userId,
    availabilityId: slot.id,
    status: 'CONFIRME',

  };
  console.log('Demande de RDV:', rdvRequest);
  this.rdvService.create(rdvRequest).subscribe({
    next: () => {
      console.log('RDV créé avec succès');

      this.snack.open('RDV confirmé !', '', { duration: 1000 });
      this.router.navigate(['/my-appointments']);
      console.log('RDV créé avec succès');
    },
    error: err => {
      console.error('Erreur lors de la création du RDV:', err);
      this.snack.open('Erreur lors de la réservation', '', { duration: 4000 });
      this.Loading = false;
      } 
}); 
    
console.log('Réservation terminée pour le slot:', slot);
  }
  logout(): void {
    this.storage.remove('userId');
    this.snack.open('Déconnexion réussie', '', { duration: 2000 });
    this.router.navigate(['/login']);
  }

  goToMyAppointments(): void {
  this.router.navigate(['/my-appointments']);
}
 }

