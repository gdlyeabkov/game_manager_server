import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-game-tag',
  templateUrl: './create-game-tag.component.html',
  styleUrls: ['./create-game-tag.component.css']
})
export class CreateGameTagComponent implements OnInit {

  title = ''

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  addTag () {
    this.http.get(
      `http://localhost:4000/api/games/tags/create/?title=${this.title}`
    ).subscribe(
      (value: any) => {
        const status = value['status']
        const isOk = status === "OK"
        if (isOk) {
          this.title = ''
          alert('Тег был успешно добавлен')      
        }
      }
    );
  }

}
