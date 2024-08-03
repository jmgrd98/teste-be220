import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthPage implements OnInit {
  authForm: FormGroup;
  isLogin = true;
  authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private toastController: ToastController,
    private usersService: UsersService
  ) {
    this.authForm = this.fb.group({
      name: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    this.updateValidators();
  }

  ngOnInit() {
    const googleProvider = new GoogleAuthProvider();
    const facebookProvider = new FacebookAuthProvider();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  toggleAuthMode() {
    this.isLogin = !this.isLogin;
    this.updateValidators();
  }

  private updateValidators() {
    const nameControl = this.authForm.get('name');
    if (this.isLogin) {
      nameControl?.clearValidators();
    } else {
      nameControl?.setValidators([Validators.required]);
    }
    nameControl?.updateValueAndValidity();
  }

  onFormFieldChange(event: any, field: string) {
    const control = this.authForm.get(field);
    if (control) {
      control.setValue(event.target.value, { emitEvent: false });
    }
  }

  async onSubmit() {
    if (this.authForm.invalid) {
      this.presentToast('Please enter valid credentials.');
      return;
    }
  
    const { name, email, password } = this.authForm.value;
  
    if (this.isLogin) {
      try {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        console.log('Login successful', userCredential);
        window.location.href = '/home';
      } catch (error: any) {
        console.error('Login error', error);
        this.presentToast(error.message);
      }
    } else {
      try {
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        
        // Set displayName on the Firebase user
        await userCredential.user!.updateProfile({ displayName: name, });
  
        await this.firestore.collection('users').doc(userCredential.user!.uid).set({
          displayName: name,
          email,
          photoUrl: '',
          role: 'white',
          phoneNumber: '',
          objectives: []
        });
  
        console.log('Registration successful', userCredential);
        window.location.href ='/home';
      } catch (error: any) {
        console.error('Registration error', error);
        this.presentToast(error.message);
      }
    }
  }  

  async signInWithGoogle() {
    try {
        const response = await this.authService.signInWithGoogle();
        console.log('Google Sign-In successful', response);
        window.location.href = '/home';
    } catch (error: any) {
        console.error('Google Sign-In error', error);
        this.presentToast(error.message);
    }
  }

  async signInWithFacebook() {
    try {
        const response = await this.authService.signInWithFacebook();
        console.log('Facebook Sign-In successful', response);
        window.location.href = '/home';
    } catch (error: any) {
        console.error('Facebook Sign-In error', error);
        this.presentToast(error.message);
    }
  }
}
