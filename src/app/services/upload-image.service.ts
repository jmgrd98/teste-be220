import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { UsersService } from 'src/app/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  selectedFile: File | null = null;
  storage = inject(Storage);

  constructor(private usersService: UsersService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage(file: File, userId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(this.storage, `images/${userId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed', 
        (snapshot) => {
          // Handle progress, if needed
        }, 
        (error) => {
          // Handle error
          reject(error);
        }, 
        () => {
          // Handle successful upload
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          }).catch(reject);
        }
      );
    });
  }

  getImageURL(userId: string, fileName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(this.storage, `images/${userId}/${fileName}`);
      getDownloadURL(storageRef)
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
