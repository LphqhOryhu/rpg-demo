import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class ChatComponent {
  messages: Array<{ sender: string, content: string }> = [];
  userInput: string = '';
  isLoading: boolean = false;

  constructor(private chatService: ChatService) { }

  sendMessage() {
    const trimmedMessage = this.userInput.trim();
    if (trimmedMessage) {
      this.messages.push({ sender: 'Vous', content: trimmedMessage });
      this.userInput = '';
      this.isLoading = true;

      this.chatService.sendMessage(trimmedMessage).subscribe(
        (res: any) => {
          this.messages.push({ sender: 'ChatGPT', content: res.reply });
          this.isLoading = false;
        },
        (err: any) => {
          console.error(err);
          this.messages.push({ sender: 'Erreur', content: 'Une erreur est survenue.' });
          this.isLoading = false;
        }
      );
    }
  }
}
