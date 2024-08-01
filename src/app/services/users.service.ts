import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth, getAuth, User as FirebaseUser } from 'firebase/auth';
import { User } from '../models/User';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  firestore = inject(Firestore);
  auth: Auth = getAuth();
  usersCollection = collection(this.firestore, 'users');

  getUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, {
      idField: 'id'
    }) as Observable<User[]>;
  }

  getCurrentUser(): Observable<FirebaseUser | null> {
    return from(new Promise<FirebaseUser | null>((resolve) => {
      const unsubscribe = this.auth.onAuthStateChanged((user) => {
        resolve(user);
        unsubscribe();
      });
    }));
  }
}
