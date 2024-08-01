import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonBadge, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, notifications, body, trophy} from 'ionicons/icons';
import { User } from 'src/app/models/User';
import { UsersService } from 'src/app/services/users.service';
import { getAuth, Auth, User as FirebaseUser } from 'firebase/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [IonAvatar, IonBadge, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HeaderComponent implements OnInit {
  usersService = inject(UsersService);
  users: User[] = [];
  auth: Auth = getAuth();
  user = this.auth.currentUser;

  constructor() {
    addIcons({ menuOutline, notifications, body, trophy });
  }

  ngOnInit() {
    this.usersService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      console.log(this.users)
      console.log(this.user);
    });

    this.usersService.getCurrentUser().subscribe((user: FirebaseUser | null) => {
      console.log(user);
    });
    
  }
}
