import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Message, ChatService } from '../service/chat.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialogComponent } from '../custom-dialog/custom-dialog.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('send') myClickRef!: ElementRef;

  messages: Message[] = [];
  value = '';
  private speechRecognition: any;
  isListening = false;
  transcript = '';
  constructor(public chatService: ChatService, public dialog: MatDialog) {}

  ngOnInit() {
    this.chatService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val);
    });
    this.initializeSpeechRecognition();
  }

  sendMessage() {
    if (this.value.length !== 0) this.chatService.getBotAnswer(this.value);
    this.value = '';
  }

  ngOnDestroy(): void {
    this.stopListening();
  }

  initializeSpeechRecognition(): void {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.lang = 'en-US';
      this.speechRecognition.interimResults = false;
      this.speechRecognition.maxAlternatives = 1;

      this.speechRecognition.onresult = (event: any) => {
        this.transcript = event.results[0][0].transcript;
        setTimeout(() => {
          this.value = this.transcript;
          this.myClickRef.nativeElement.click();
          this.stopListening();
        }, 500);
      };

      this.speechRecognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
      };
    } else {
      console.error('Speech Recognition API not supported in this browser.');
    }
  }

  startListening(): void {
    if (this.isListening || !this.speechRecognition) return;
    this.isListening = true;
    this.speechRecognition.start();
  }

  stopListening(): void {
    if (!this.isListening || !this.speechRecognition) return;
    this.isListening = false;
    this.speechRecognition.stop();
  }

  openDialog(): void {
    // this.dialog.open(CustomDialogComponent, {
    //   width: '600px',
    //   position: { top: '0', left: 'calc(50% - 300px)' } // Assuming the dialog width is 600px
    // });
  }
}
