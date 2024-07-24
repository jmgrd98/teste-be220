import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { menuOutline, notifications} from 'ionicons/icons';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent
  ],
})
export class HomePage {
  constructor() {
    addIcons({ menuOutline, notifications});
  }
}
