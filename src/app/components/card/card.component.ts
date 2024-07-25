import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [IonIcon, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle],
})
export class CardComponent implements OnInit {
  @Input() imgUrl!: string;
  @Input() content!: string;
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() icon!: string;

  constructor() { }

  ngOnInit() {}

  @HostBinding('style.backgroundImage')
  get backgroundImage() {
    return `url(${this.imgUrl})`;
  }
}
