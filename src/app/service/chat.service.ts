import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class Message {
  constructor(public author: string, public content: string) {}
}

@Injectable({
    providedIn: 'root',
  })
  
export class ChatService {
  audioFile = new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3'
  );
  constructor() {}

  conversation = new Subject<Message[]>();

  messageMap:any = {
    'Hi': 'Hello',
    'who are you': 'My name is Agular Bot',
    'What is Angular': 'Angular is the best framework ever',
    default: "I can't understand. Can you please repeat",
  };

  getBotAnswer(msg: string) {
    const userMessage = new Message('user', msg);
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg));

    setTimeout(() => {
      this.playFile(botMessage.content);
      this.conversation.next([botMessage]);
    }, 1500);
  }

  playFile(link='string') {
    const synth = window.speechSynthesis; // Get the speech synthesis object
    const utterance = new SpeechSynthesisUtterance(link); // Create an utterance
    synth.speak(utterance); // Speak the utterance
  }

  getBotMessage(question: string) {
    let answer = this.messageMap[question];
    return answer || this.messageMap['default'];
  }
}
