import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { min } from 'rxjs';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  gameName:string = ''

  @ViewChild('form') form: ElementRef<HTMLFormElement>|null = null;
  @ViewChild('gameUrl') gameUrl:ElementRef<HTMLInputElement>|null = null
  @ViewChild('gameImg') gameImg:ElementRef<HTMLInputElement>|null = null

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  createGame (currentForm:HTMLFormElement) {
    this.form!.nativeElement.action = `http://localhost:4000/?api/games/create/?name=${this.gameName}&url=${`https://digitaldistributtionservice.herokuapp.com/api/games/distributive?name=${this.gameName}`}&url=${`https://digitaldistributtionservice.herokuapp.com/api/games/thumbnail?name=${this.gameName}`}`;
    this.form!.nativeElement.submit()
  }

}
