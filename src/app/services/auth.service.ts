import { Injectable, inject, signal } from "@angular/core";
import { Auth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { Observable, from, of, switchMap } from "rxjs";
import { User } from "../models/User";
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    firebaseAuth = inject(Auth);
    firestore = inject(Firestore);
    user$: Observable<User | null | undefined>;
    currentUserSig = signal<User | null | undefined>(undefined);

    constructor(
        private afAuth: AngularFireAuth,
        private angularFirestore: AngularFirestore,
        private router: Router
    ) {
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.angularFirestore
                        .doc<User>(`users/${user.uid}`)
                        .valueChanges();
                } else {
                    return of(null);
                }
            })
        );
    }

    async signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const credential: any = await this.afAuth.signInWithPopup(provider);
            await this.updateUserData(credential.user);
            return credential.user;
        } catch (error) {
            console.error("Google Sign-In Error: ", error);
            throw error;
        }
    }

    async signInWithFacebook() {
        const provider = new FacebookAuthProvider()
        try {
            const credential: any = await this.afAuth.signInWithPopup(provider);
            await this.updateUserData(credential.user);
            return credential.user
        } catch (error: any) {
            console.error('Facebook Sign-In Error:', error);
            throw error;
        }
    }
    
    private updateUserData(user: any) {
        const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(`users/${user.uid}`);
        const data: User = {
            id: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            photoUrl: user.photoURL || '',
            role: 'white',
            phoneNumber: user.phoneNumber || '',
            objectives: []
        };
    
        // Remove any undefined properties
        Object.keys(data).forEach(key => {
            if (data[key as keyof User] === undefined) {
                delete data[key as keyof User];
            }
        });
    
        return userRef.set(data, { merge: true });
    }

    createUser(name: string, email: string, password: string): Observable<any> {
        return from(createUserWithEmailAndPassword(
            this.firebaseAuth,
            email,
            password
        ).then(response => {
            return updateProfile(response.user, {
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

    async logout() {
        try {
            await this.afAuth.signOut();
            window.location.href = '/auth';
        } catch (error) {
            console.error("Logout Error: ", error);
        }
    }
}
