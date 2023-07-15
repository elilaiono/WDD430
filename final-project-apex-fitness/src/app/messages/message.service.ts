import { Injectable, Output, EventEmitter } from '@angular/core';
import { Message } from './message.model';
// import { MOCKMESSAGES} from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) {
    // this.messages = MOCKMESSAGES;
   }

   getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

   addMessage(message: Message) {
    this.messages.push(message);
    // this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages(this.messages)
   }

   getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
   }

  //  getMessages(): Message[] {
  //   return this.messages.slice();
  //  }

  getMessages() {
    this.http
      .get<Message[]>('https://wdd430-final-default-rtdb.firebaseio.com//messages.json')
      .subscribe({
        next: (messages: Message[]) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          this.messageChangedEvent.next(this.messages.slice());
          console.log(messages)
        },
        error: (error: any) => {
          console.error(error);
        }
      });
      return this.messages.slice();
 }

  storeMessages(messages: Message[]) {
    const data = JSON.stringify(messages);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http
      .put('https://wdd430-final-default-rtdb.firebaseio.com/messages.json', data, { headers })
      .subscribe(() => {
        const messagesListClone = messages.slice();
        this.messageChangedEvent.next(messagesListClone);
      });
  }
}
