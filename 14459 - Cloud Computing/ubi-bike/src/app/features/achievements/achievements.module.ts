import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementsComponent } from './achievements.component';
import { AchievementsService } from './achievements.service';
import { AchievementsRoutingModule } from './achievements-routing.module';
import { DataViewModule } from 'primeng/dataview';
import { BaseModule } from 'src/app/core/base.component/base.module';
import { MatIconModule } from '@angular/material/icon';
import { EditAchievementComponent } from './edit-achievement.component/edit-achievement.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    AchievementsComponent,
    EditAchievementComponent
  ],
  imports: [
    CommonModule,
    AchievementsRoutingModule,
    BaseModule,
    FormsModule,
    DataViewModule,
    MatIconModule,
    MatButtonModule,
    InputTextModule,
  ],
  providers: [
    AchievementsService,
  ]
})
export class AchievementsModule { }
