import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { addIcons } from 'ionicons';
import { menuOutline, notifications, addCircleOutline} from 'ionicons/icons';
import { HeaderComponent } from '../../components/header/header.component';
import { IonIcon, IonBadge, IonContent } from "@ionic/angular/standalone";
import { CardComponent } from "../../components/card/card.component";

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  standalone: true,
  imports: [
    IonContent,
    IonBadge,
    IonIcon,
    HeaderComponent,
    CardComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfilePage {

  constructor() {
    addIcons({ menuOutline, notifications, addCircleOutline});
  }
}
