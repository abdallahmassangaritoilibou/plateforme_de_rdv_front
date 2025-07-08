
// src/app/my-appointments.component.ts
import { Component, OnInit } from '@angular/core';
import { RendezVousService, RendezVousDTO } from '../services/rendezvous.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StorageService } from '../services/storage.service';
import { switchMap } from 'rxjs';
import { AvailabilityService } from '../services/availability.service';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
  ],
    
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css'],
})
export class MyAppointmentsComponent implements OnInit {
  appointments: RendezVousDTO[] = [];

  constructor(
    private readonly rdvService: RendezVousService,
    private readonly snack: MatSnackBar,
    private readonly router: Router,
    private readonly storage: StorageService,
    private readonly availService: AvailabilityService
  ) {}

  ngOnInit(): void {
    this.rdvService.getMine().subscribe({
      next: list => {
       this.appointments = list.filter(rdv => rdv.status !== 'ANNULE')},
      error: err => console.error(err)
    });
  }

  
  cancel(rdv: RendezVousDTO) {
  console.log('RDV à annuler:', rdv);

  if (!rdv.availabilityId) {
    this.snack.open('Ce rendez-vous n’a pas de créneau associé.', '', { duration: 3000 });
    return;
  }
 

  this.rdvService.cancelRdv(rdv).pipe(
    switchMap(() => this.availService.updateIsBooked(rdv.availabilityId, false))
  ).subscribe({
    next: () => {
      this.snack.open('RDV annulé, créneau remis dispo.', '', { duration: 2000 });
      this.rdvService.getMine().subscribe(list => {
      this.appointments = list.filter(rdv => rdv.status !== 'ANNULE');
      
});

    },
    error: (err: any)=> {
      console.error('Erreur lors de l’annulation :', err);
      this.snack.open('Erreur pendant l’annulation.', '', { duration: 3000 });
    }
  });
}



  logout(): void {
    this.storage.remove('userId');
    this.snack.open('Déconnexion réussie', '', { duration: 2000 });
    this.router.navigate(['/login']);
  }

  goToReservation(): void {
  this.router.navigate(['/booking']);
}

  }
