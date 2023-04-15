import { NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from "ngx-cookieconsent";
import { AngularFireAuthModule,
  SETTINGS as AUTH_SETTINGS,
  USE_DEVICE_LANGUAGE
} from "@angular/fire/compat/auth";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ServiceWorkerModule } from '@angular/service-worker';

const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: environment.domain //it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  palette: {
    popup: {
      background: "#000"
    },
    button: {
      background: "#f1d600"
    }
  },
  theme: "edgeless",
  type: "opt-out"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    FontAwesomeModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    { provide: AUTH_SETTINGS, useValue: { appVerificationDisabledForTesting: true } },
    { provide: USE_DEVICE_LANGUAGE, useValue: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
