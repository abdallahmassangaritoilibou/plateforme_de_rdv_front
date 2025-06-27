
// src/app/my-appointments.component.ts
import { Component, OnInit } from '@angular/core';
import { RendezVousService, RendezVous } from '../services/rendezvous.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    RouterModule,
    MatSnackBarModule,
  ],
    
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css'],
})
export class MyAppointmentsComponent implements OnInit {
  appointments: RendezVous[] = [];

  constructor(
    private readonly rdvService: RendezVousService,
    private readonly snack: MatSnackBar,
    private readonly router: Router,
    private readonly storage: StorageService
  ) {}

  ngOnInit(): void {
    this.rdvService.getMine().subscribe({
      next: list => this.appointments = list,
      error: err => console.error(err)
    });
  }

  logout(): void {
    this.storage.remove('userId');
    this.snack.open('Déconnexion réussie', '', { duration: 2000 });
    this.router.navigate(['/login']);
  }
  }
