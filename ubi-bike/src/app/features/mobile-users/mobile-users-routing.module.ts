import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileUsersComponent } from './mobile-users.component';

const routes: Routes = [{ path: '', component: MobileUsersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileUsersRoutingModule { }
