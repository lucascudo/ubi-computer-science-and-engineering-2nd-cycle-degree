
import { NgModule } from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {PanelModule} from 'primeng/panel';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {MessageModule} from 'primeng/message';


@NgModule({
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    PanelModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  exports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    PanelModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
})
export class AppPrimeNgModule { }
