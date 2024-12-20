import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
//  private apiUrl = 'http://localhost:3000/api/chat';

  //constructor(private http: HttpClient) { }

  //sendMessage(message: string): Observable<any> {
    //return this.http.post<any>(this.apiUrl, { message }).pipe(
     // catchError(this.handleError)
    //);
 // }

  //private handleError(error: HttpErrorResponse): Observable<never> {
    //console.error('Erreur ChatService:', error);
    //return throwError(() => new Error('Erreur lors de la communication avec le serveur.'));
 // }
 private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Récupérer l'état du joueur
  getPlayerState(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/player`);
  }

  // Mettre à jour l'état du joueur
  updatePlayerState(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/player`, data);
  }

  // Récupérer les événements d'un chapitre
  getChapterEvents(chapterId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/chapters/${chapterId}`);
  }

  // Ajouter un événement dans un chapitre
  addEventToChapter(chapterId: number, event: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/chapters/${chapterId}`, { event });
  }

  // Envoyer un message au MJ via OpenAI
  sendActionToChat(message: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/chat`, { message });
  }


}
