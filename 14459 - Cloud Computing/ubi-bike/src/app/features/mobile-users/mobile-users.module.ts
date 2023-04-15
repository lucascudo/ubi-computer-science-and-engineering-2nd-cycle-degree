import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { BaseModule } from 'src/app/core/base.component/base.module';
import { MobileUsersService } from './mobile-users.service';
import { MobileUsersRoutingModule } from './mobile-users-routing.module';
import { MobileUsersComponent } from './mobile-users.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    MobileUsersComponent,
  ],
  imports: [
    CommonModule,
    MobileUsersRoutingModule,
    BaseModule,
    DataViewModule,
    MatIconModule,
  ],
  providers: [
    MobileUsersService,
  ]
})
export class MobileUsersModule { }
