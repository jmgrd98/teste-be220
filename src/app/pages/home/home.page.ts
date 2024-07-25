import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { addIcons } from 'ionicons';
import { menuOutline, notifications, addCircleOutline} from 'ionicons/icons';
import { HeaderComponent } from '../../components/header/header.component';
import { IonIcon, IonBadge, IonContent } from "@ionic/angular/standalone";
import { CardComponent } from "../../components/card/card.component";
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';

register();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
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
export class HomePage {
  public swiper!: Swiper;

  constructor() {
    addIcons({ menuOutline, notifications, addCircleOutline});
  }
}
