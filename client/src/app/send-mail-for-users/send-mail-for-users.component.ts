import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-send-mail-for-users',
  templateUrl: './send-mail-for-users.component.html',
  styleUrls: ['./send-mail-for-users.component.css']
})
export class SendMailForUsersComponent implements OnInit {

  startDate: Date = new Date()
  endDate: Date = new Date()

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  sendMail () {
    this.http.get(
      `http://localhost:4000/api/users/notify/?start=${this.startDate}&end=${this.endDate}`
    ).subscribe(
      (value: any) => {
        const status = value['status']
        const isOk = status === "OK"
        if (isOk) {
          this.startDate = new Date()
          this.endDate = new Date()
          alert('Пользователи были уведомлены')      
        }
      }
    );
  }

}
