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

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  checkUser () {
    this.http.request
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
              alert(`talkId: ${talkId}; currentUserId: ${currentUserId}`)  
              this.http.get(
                `http://localhost:4000/api/talks/relations/add/?id=${talkId}&user=${currentUserId}&msg=${'mockMsgId'}`
              ).subscribe(
                (nestedValue: any) => {
                  const status = nestedValue['status']
                  isOk = status === "OK"
                  if (isOk) {
                    alert('Вы были добавлены в группу')
                  } else {
                    alert('Не удается добавить вас в группу') 
                  }
                }
              )
            }
          )
        }
        alert(status)
      }
    );
  }

}
