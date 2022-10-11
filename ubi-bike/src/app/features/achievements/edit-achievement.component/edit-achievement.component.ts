
import { Component, Input } from '@angular/core';
import { AchievementsService } from '../achievements.service';


@Component({
  selector: 'app-edit-achievement',
  templateUrl: './edit-achievement.component.html',
  styleUrls: ['./edit-achievement.component.scss'],
})
export class EditAchievementComponent {

  @Input() name: string;
  @Input() description: string;
  @Input() stores: string;

  constructor(private achievementsService: AchievementsService) {}

  save() {
    const stores = (this.stores.indexOf(';')) ? this.stores.split(';') : this.stores.split(',');
    this.achievementsService.save({
      name: this.name,
      description: this.description,
      stores,
    }).then(() => {
      this.name = '';
      this.stores = '';
      this.description = '';
    }).catch(e => alert(e.message));
  }

}
