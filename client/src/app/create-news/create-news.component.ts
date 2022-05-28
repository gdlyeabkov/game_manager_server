import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css']
})
export class CreateNewsComponent implements OnInit {

  title = ''
  content = ''
  @ViewChild('gameSelector') gameSelector!:ElementRef<HTMLSelectElement>|null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.getGames()
  }

  getGames () {
    this.http.get(
      `https://loud-reminiscent-jackrabbit.glitch.me/api/games/get`
    ).subscribe(
      (value: any) => {
        const status = value['status'];
        const isOkStatus = status === 'OK';
        if (isOkStatus) {
          const games = value['games'];
          for (let gamesItem of games) {
            const gameId = gamesItem['_id'];
            const gameName = gamesItem['name'];
            const game:HTMLOptionElement = new Option();
            game.value = gameId;
            game.label = gameName;
            this.gameSelector!.nativeElement.options.add(game);
          }
        }
      }
    );
  }

  addNews() {
    const selectedIndex = this.gameSelector!.nativeElement.selectedIndex;
    const selectedGame = this.gameSelector!.nativeElement.options[selectedIndex];
    const selectedGameId = selectedGame.value
    this.http.get(
      `https://loud-reminiscent-jackrabbit.glitch.me/api/news/create/?title=${this.title}&content=${this.content}&game=${selectedGameId}`
    ).subscribe(
      (value: any) => {
        const status = value['status']
        const isOk = status === "OK"
        if (isOk) {
          this.title = ''
          this.content = ''
          alert('Новость была успешно добавлена')      
        }
      }
    );
  }

}
