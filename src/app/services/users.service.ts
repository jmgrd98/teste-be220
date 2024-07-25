import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { User } from '../models/User';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UsersService {
        firestore = inject(Firestore);
        usersCollection = collection(this.firestore, 'users');

        getUsers(): Observable<User[]> {
            return collectionData(this.usersCollection, {
                idField: 'id'
        }) as Observable<User[]>;
    }   
}

