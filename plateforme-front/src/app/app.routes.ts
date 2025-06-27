import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { BookingComponent } from './booking/booking.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'my-appointments', component: MyAppointmentsComponent, canActivate: [AuthGuard] }
];