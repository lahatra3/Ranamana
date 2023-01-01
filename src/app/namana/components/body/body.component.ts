import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { NamanaService } from 'src/app/core/services/namana.service';

declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  textRequest$!: Observable<string>;
  textRequest!: string;
  textResponse!: string;
  responseError!: boolean;
  recording!: boolean;

  synthesis = window.speechSynthesis;
  voice!: SpeechSynthesisVoice;
  statusVoice!: boolean;

  voiceAnimations!: number[];

  constructor(
    private namanaService: NamanaService,
    private authService: AuthService
    ) {
  }

  initRecognition(): void {
    this.recognition.continuous = true;
    this.recognition.lang = 'fr-FR';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
  }

  recognitionFeatures(): void {
    this.recognition.addEventListener('speechend', () => {
      this.recording = false;
      this.recognition.stop();
    });

    this.recognition.onerror = (event: any) => {
      console.log(event.error);
    }

    this.recognition.addEventListener('nomatch', () => {
      this.recording = false;
      this.recognition.stop();
    });

    this.textRequest$ = new Observable(observer => {
      this.recognition.addEventListener('result', (event: any) => {
        observer.next(event.results[0][0].transcript);
      });
    });
  }

  initSynthesis(): void {
    this.voice = this.synthesis.getVoices()
      .find(value => value.lang.includes('fr-FR')) as SpeechSynthesisVoice;
  }

  speakSynthesis(textToSpeak: string): void {
    const utterThis = new SpeechSynthesisUtterance(textToSpeak);

    utterThis.addEventListener('start', () => this.statusVoice = true);
    utterThis.addEventListener('end', () => this.statusVoice = false);

    utterThis.voice = this.voice;
    utterThis.pitch = 1.3;
    utterThis.rate = 1.3;
    this.synthesis.speak(utterThis);
  }

  makeRequest(): void {
    this.textRequest$.subscribe({
      next: text => {
        this.textRequest = text;
        this.namanaService.requestOpenai(text)
          .subscribe({
            next: response => {
              this.responseError = false;
              this.speakSynthesis(response.body.choices[0].text as string);
              this.textResponse = response.body.choices[0].text as string;
            },
            error: response => {
              this.responseError = true;
              if(response.status === (401 || 402))
                this.authService.logOut();
              else {
                this.speakSynthesis(`${response.error.message}: ${response.status}`);
                this.textResponse = `${response.error.message}: ${response.status}`;
              }
            }
          });
      }
    });
  }

  ngOnInit(): void {
    this.recording = false;
    this.statusVoice = false;
    this.voiceAnimations = [1, 2, 4, 5, 6, 7, 8, 9, 10];
    this.responseError = false;
    this.initRecognition();
    this.initSynthesis();
    this.recognitionFeatures();
    this.makeRequest();
  }

  onListen(): void {
    this.recording = !this.recording;
    if(this.recognition)
      this.recognition.start();
    else
      this.recognition.stop();
  }
}
