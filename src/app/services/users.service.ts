import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Auth, getAuth, User as FirebaseUser } from 'firebase/auth';
import { User } from '../models/User';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

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

  findUserByUid(uid: string): Observable<User | undefined> {
    return this.getUsers().pipe(
      map(users => users.find((user: any) => user.id === uid))
    );
  }

  async getUserByUid(uid: string): Promise<User | null> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      return userSnapshot.data() as User;
    } else {
      return null;
    }
  }
}
