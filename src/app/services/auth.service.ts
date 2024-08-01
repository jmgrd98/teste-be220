import { Injectable, inject, signal } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, updateProfile, user } from '@angular/fire/auth';
import { Observable, from } from "rxjs";
import { UsersService } from "./users.service";
import { User } from "../models/User";
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    firebaseAuth = inject(Auth);
    user$ = user(this.firebaseAuth);
    currentUserSig = signal<User | null | undefined>(undefined);
    firestore = inject(Firestore);

    createUser(name: string, email: string, password: string): Observable<any> {
        return from(createUserWithEmailAndPassword(
            this.firebaseAuth,
            email,
            password
        ).then(response => {
            updateProfile(response.user, {
                displayName: name
            });
        }));
    }

    async getCurrentUserData(): Promise<User | null> {
        const currentUser = this.firebaseAuth.currentUser;
        if (currentUser) {
            const userDoc = doc(this.firestore, `users/${currentUser.uid}`);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                return userSnapshot.data() as User;
            }
        }
        return null;
    }
}
