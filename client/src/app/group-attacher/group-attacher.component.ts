import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-attacher',
  templateUrl: './group-attacher.component.html',
  styleUrls: ['./group-attacher.component.css']
})
export class GroupAttacherComponent implements OnInit {

  email: string = ''
  password: string = ''
  isErrors: boolean = false

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  checkUser () {
    this.http.get(
      `http://localhost:4000/api/users/check/?login=${this.email}&password=${this.password}`
    ).subscribe(
      (value: any) => {
        const status = value['status']
        let isOk = status === "OK"
        const queryParams = this.route.queryParams
        let talkId: string = ''
        if (isOk) {
          queryParams.subscribe(
            (innerValue: any) => {
              const currentUserId = value['id']
              talkId = innerValue['talk']
              this.http.get(
                `http://localhost:4000/api/talks/relations/add/?id=${talkId}&user=${currentUserId}&msg=${'mockMsgId'}`
              ).subscribe(
                (nestedValue: any) => {
                }
              )
              alert('Вы были добавлены в группу')
              this.email = ''
              this.password = ''
              this.isErrors = false
            }
          )
        } else {
          this.isErrors = true
        }
      }
    );
  }

}
