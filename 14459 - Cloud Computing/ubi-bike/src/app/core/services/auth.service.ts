import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  UserCredential
} from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { LoginData } from '../interfaces/login-data.interface';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private readonly router: Router,
    private store: Firestore
  ) {}

  async isAllowed(credential: UserCredential) {
    const users$ = collectionData(collection(this.store, 'users'));
    const users = await firstValueFrom(users$);
    return users.some(user => user['email'] === credential.user.email);
  }

  login({ email, password }: LoginData) {
    return this.authenticate(signInWithEmailAndPassword(this.auth, email, password));
  }

  loginWithGoogle() {
    return this.authenticate(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  register({ email, password }: LoginData) {
    return this.authenticate(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return signOut(this.auth);
  }

  authenticate(login: Promise<UserCredential>)
  {
    return login.then(async (res) => {
      if (await this.isAllowed(res)) {
        this.router.navigate(['/home']);
      } else {
        this.logout();
        alert("You aren't registered. Contact a system admin.");
      }
    })
    .catch((e) => alert(e.message));
  }
}
