import { Component, OnInit } from '@angular/core';
import { Achievement } from 'src/app/core/interfaces/achievement.interface';
import { AchievementsService } from './achievements.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {

  achievements: any;
  editingAchievement: Achievement = {
    name: '',
    description: '',
    stores: [],
  };

  constructor(private achievementsService: AchievementsService) { }

  ngOnInit(): void {
    this.achievementsService.get().subscribe({
      next: res => this.achievements = res,
      error: e => alert(e.message),
    });
  }

  deleteAchievement(achievementName: string) {
    confirm(`Do you really want to delete ${achievementName}?`) &&
      this.achievementsService.delete(achievementName).catch(e => alert(e.message));
  }

  setEditingAchievement(achievement: Achievement) {
    this.editingAchievement = Object.assign({}, achievement);
  }

  getStores(achievement: Achievement): string {
    return achievement.stores.join(', ');
  }

}
