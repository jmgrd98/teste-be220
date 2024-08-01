import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonBadge, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, notifications, body, trophy } from 'ionicons/icons';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsersService } from 'src/app/services/users.service';
import { getAuth, user } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    CommonModule,
    IonAvatar,
    IonBadge,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  auth: any = getAuth();
  users: User[] = [];
  currentUser!: any;
  private authStateSubscription: Subscription | null = null;
  private userSubscription: Subscription | null = null;

  constructor(
    private usersService: UsersService
  ) {
    addIcons({ menuOutline, notifications, body, trophy });
  }

  async ngOnInit() {
    this.usersService.getUsers().subscribe((users) => {
      console.log('USERS', users);
      this.users = users;
    });

    this.authStateSubscription = this.usersService.getCurrentUser().subscribe((firebaseUser) => {
      if (firebaseUser) {
        this.currentUser = firebaseUser;
        this.userSubscription = this.usersService.findUserByUid(firebaseUser.uid).subscribe((user) => {
          console.log('FINDED USER', user);
          this.currentUser = user;
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
