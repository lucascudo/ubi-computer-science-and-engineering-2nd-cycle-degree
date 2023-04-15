import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { BaseModule } from 'src/app/core/base.component/base.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    BaseModule,
    DashboardRoutingModule,
    MatIconModule,
  ]
})
export class DashboardModule { }
