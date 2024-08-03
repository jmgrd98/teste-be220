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
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';

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
    IonLabel,
    ReactiveFormsModule
  ]
})
export class ModalObjectivesComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @ViewChild(IonModal) modal!: IonModal;
  message!: string;

  objectives: Objective[] = [];

  objectiveForm: FormGroup;

  constructor(private fb: FormBuilder, private usersService: UsersService) { 
    this.objectiveForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {}

  addObjective() {
    if (this.objectiveForm.valid) {
      const newObjective: Objective = {
        id: (this.objectives.length + 1).toString(),
        ...this.objectiveForm.value,
        status: false
      };

      this.objectives.push(newObjective);
      this.usersService.getCurrentUser().subscribe(user => {
        if (user) {
          this.usersService.addObjectiveToUser(user.uid, newObjective).then(() => {
            console.log('Objective added successfully');
          }).catch(error => {
            console.error('Error adding objective: ', error);
          });
        }
      });

      this.objectiveForm.reset();
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.close.emit();
  }

  confirm() {
    this.modal.dismiss(this.objectiveForm.value.name, 'confirm');
    this.close.emit();
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
    this.close.emit();
  }

  trackById(index: number, objective: Objective): string {
    return objective.id;
  }
}
