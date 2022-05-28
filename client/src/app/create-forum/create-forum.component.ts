import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-forum',
  templateUrl: './create-forum.component.html',
  styleUrls: ['./create-forum.component.css']
})
export class CreateForumComponent implements OnInit {

  title = ''

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  addForum () {
    this.http.get(
      `https://loud-reminiscent-jackrabbit.glitch.me/api/forums/create/?title=${this.title}`
    ).subscribe(
      (value: any) => {
        const status = value['status']
        const isOk = status === "OK"
        if (isOk) {
          this.title = ''
          alert('Форум был успешно добавлен')      
        }
      }
    );
  }

}
