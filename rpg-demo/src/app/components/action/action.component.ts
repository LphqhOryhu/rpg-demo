import { Component } from '@angular/core';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
  standalone: true,
})
export class ActionComponent {
  action: string = ''; // Input utilisateur
  response: string = ''; // Réponse du MJ
  isLoading: boolean = false; // Indique si une requête est en cours
  errorMessage: string = ''; // Message d'erreur éventuel

  constructor(private playerService: PlayerService) {}

  sendAction() {
    const trimmedAction = this.action.trim();

    if (!trimmedAction) {
      this.errorMessage = 'Veuillez entrer une action valide.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.response = '';

    this.playerService.sendActionToChat(trimmedAction).subscribe(
      (res) => {
        this.response = res.reply;
        this.action = ''; // Réinitialiser l'entrée utilisateur
        this.isLoading = false;
      },
      (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors de la communication avec le MJ.';
        this.isLoading = false;
      }
    );
  }
}
