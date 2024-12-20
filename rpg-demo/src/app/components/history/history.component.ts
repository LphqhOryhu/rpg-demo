import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  standalone: true,
})
export class HistoryComponent implements OnInit {
  history: string[] = []; // Liste des événements historiques
  errorMessage: string = ''; // Message d'erreur éventuel

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.playerService.getPlayerState().subscribe(
      (data) => {
        this.history = data.historique || [];
      },
      (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement de l’historique.';
      }
    );
  }
}
