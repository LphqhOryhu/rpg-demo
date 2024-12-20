import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  standalone: true,
})
export class HistoryComponent implements OnInit {
  history: string[] = [];

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.playerService.getPlayerState().subscribe((data) => {
      this.history = data.historique;
    });
  }
}
