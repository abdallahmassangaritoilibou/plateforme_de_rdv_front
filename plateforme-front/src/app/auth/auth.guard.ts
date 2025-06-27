// src/app/auth/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly storage: StorageService,
    private readonly router: Router
  ) {}

  canActivate(): boolean {
    if (this.storage.get('userId')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
