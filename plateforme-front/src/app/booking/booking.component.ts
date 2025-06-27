// src/app/booking.component.ts

import { Component, OnInit }                 from '@angular/core';
import { CommonModule }                      from '@angular/common';
import { RouterModule, Router }              from '@angular/router';
import { MatCardModule }                     from '@angular/material/card';
import { MatListModule }                     from '@angular/material/list';
import { MatButtonModule }                   from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule }    from '@angular/material/snack-bar';

import { Availability, AvailabilityService } from '../services/availability.service';
import { RendezVousService } from '../services/rendezvous.service';
import { StorageService } from '../services/storage.service';

interface CreateRdvDTO {
  user: { id: number };
  availability: string;
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
  this.Loading = true;

   // Convertir le userId stocké (string|null) en number
    const userIdStr = this.storage.get('userId');
    const userId = userIdStr ? Number(userIdStr) : NaN;

    if (isNaN(userId)) {
      this.snack.open("ID utilisateur invalide.", 'Fermer', { duration: 4000 });
      this.router.navigate(['/login']);
      return;
  }
  const rdvDto: CreateRdvDTO = {
    user: { id: userId },
    availability: slot.startTime,
    status: 'CONFIRME'
  };
  this.rdvService.create(rdvDto).subscribe({
    next: () => {
      this.snack.open('RDV confirmé !', '', { duration: 2000 });
      this.router.navigate(['/my-appointments']);
    },
    error: err => {
      this.snack.open(err, '', { duration: 4000 });
      this.Loading = false;
      } 
}); 
    
  }
  logout(): void {
    this.storage.remove('userId');
    this.snack.open('Déconnexion réussie', '', { duration: 2000 });
    this.router.navigate(['/login']);
  }
 }


