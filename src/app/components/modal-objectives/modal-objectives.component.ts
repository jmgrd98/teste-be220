import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { 
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem, 
  IonInput,
  IonTitle,
  IonAccordion,
  IonAccordionGroup,
  IonLabel
} from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';
import { Objective } from 'src/app/models/Objective';

@Component({
  selector: 'app-modal-objectives',
  templateUrl: './modal-objectives.component.html',
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
    IonTitle,
    IonAccordion,
    IonAccordionGroup,
    IonLabel
  ]
})
export class ModalObjectivesComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  objectives: Objective[] = [
    {
      id: '1',
      name: 'teste',
      description: 'teste',
      status: false
    }
  ];

  constructor() { }

  ngOnInit() {}

  addObjective() {
    
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.close.emit();
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
    this.close.emit();
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
    this.close.emit();
  }
}
