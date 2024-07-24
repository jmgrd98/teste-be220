import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonBadge, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, notifications, body, trophy} from 'ionicons/icons';


@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonAvatar, IonBadge, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HeaderComponent  implements OnInit {

  constructor() {
    addIcons({ menuOutline, notifications, body, trophy});
  }

  ngOnInit() {}

}
