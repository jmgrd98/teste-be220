import { Component, OnInit } from '@angular/core';
import { 
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem, 
  IonInput,
  IonTitle
} from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  standalone: true,
  imports: [
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonButtons,
    IonButton,
    IonItem,
    IonInput,
    IonTitle
  ]
})
export class MenuModalComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

}
