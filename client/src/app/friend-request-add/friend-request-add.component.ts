import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-friend-request-add',
  templateUrl: './friend-request-add.component.html',
  styleUrls: ['./friend-request-add.component.css']
})
export class FriendRequestAddComponent implements OnInit {

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
        let friendId: string = ''
        if (isOk) {
          queryParams.subscribe(
            (innerValue: any) => {
              const currentUserId = value['id']
              friendId = innerValue['friend']
              this.http.get(
                `http://localhost:4000/api/friends/requests/add/?id=${currentUserId}&friend=${friendId}`
              ).subscribe(
                (nestedValue: any) => {
                }
              )
              alert('запрос в друзья был отправлен')
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
