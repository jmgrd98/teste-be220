import { Component, inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonBadge,
  IonAvatar,
  IonPopover,
  IonModal,
  IonButtons,
  IonButton,
  IonItem,
  IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, notifications, body, trophy } from 'ionicons/icons';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UsersService } from 'src/app/services/users.service';
import { getAuth } from '@angular/fire/auth';
import { UploadImageService } from 'src/app/services/upload-image.service';
import { MenuModalComponent } from "../menu-modal/menu-modal.component";
import { ModalObjectivesComponent } from "../modal-objectives/modal-objectives.component";

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
    IonContent,
    IonPopover,
    IonModal,
    IonButtons,
    IonButton,
    IonItem,
    IonInput,
    MenuModalComponent,
    ModalObjectivesComponent
],
})
export class HeaderComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  auth: any = getAuth();
  users: User[] = [];
  currentUser!: any;
  selectedFile: any;
  private authStateSubscription: Subscription | null = null;
  private userSubscription: Subscription | null = null;
  avatarUrl: string | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private usersService: UsersService,
    private uploadImageService: UploadImageService
  ) {
    addIcons({ menuOutline, notifications, body, trophy });
  }

  async ngOnInit() {
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
    });

    this.authStateSubscription = this.usersService.getCurrentUser().subscribe((firebaseUser) => {
      if (firebaseUser) {
        this.currentUser = firebaseUser;
        this.userSubscription = this.usersService.findUserByUid(firebaseUser.uid).subscribe((user) => {
          this.currentUser = user;
          console.log(this.currentUser);
          if (this.currentUser.avatarUrl) {
            this.avatarUrl = this.currentUser.avatarUrl;
          }
        });
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadFile();
  }

  uploadFile() {
    if (this.selectedFile) {
      const userId = this.currentUser.id;
      this.uploadImageService.uploadImage(this.selectedFile, userId)
        .then((downloadURL: string) => {
          console.log('File uploaded successfully. URL:', downloadURL);
          this.avatarUrl = downloadURL;
          this.currentUser.avatarUrl = downloadURL;
          this.updateUserProfile();
        })
        .catch((error: any) => {
          console.error('Error uploading file:', error);
        });
    } else {
      console.error('No file selected');
    }
  }

  updateUserProfile() {
    if (this.currentUser && this.currentUser.id && this.avatarUrl !== null) {
      this.usersService.updateUser(this.currentUser.id, { photoUrl: this.avatarUrl })
        .then(() => console.log('User profile updated'))
        .catch((error: any) => console.error('Error updating profile', error));
    }
  }

  onAvatarClick() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onProfileClick() {
    window.location.href = '/profile'
  }

  ngOnDestroy() {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onObjectivesClick() {

  }

  goToHome(){
    window.location.href = '/home'
  }
}
