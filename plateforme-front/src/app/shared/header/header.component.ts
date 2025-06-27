// src/app/shared/header/header.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StorageService } from '../../services/storage.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    MatSnackBarModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']

})
export class HeaderComponent {
 appName = "MyRdvLib";
  isLoadingIn: boolean = false;
  constructor(
    private readonly snack: MatSnackBar,
    private readonly storage: StorageService,
    private readonly router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.storage.isBrowser() && !!this.storage.get('userId');
  }
  logout(): void {
    this.storage.remove('userId');
    this.snack.open('Déconnexion réussie', '', { duration: 2000 });
    this.router.navigate(['/login']);
  }
  

}
