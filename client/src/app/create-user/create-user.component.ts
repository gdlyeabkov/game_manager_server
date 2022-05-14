import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  email: string = ''
  password: string = ''
  confirmPassword: string = ''
  isErrors: boolean = false

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  createUser () {
    this.http.get(
      `http://localhost:4000/api/users/create/?login=${this.email}&password=${this.password}&confirmPassword=${this.confirmPassword}&role=admin`
    ).subscribe(
      (value: any) => {
        const status = value['status']
        let isOk = status === "OK"
        if (isOk) {
          alert('Пользователь был успешно создан')
          this.email = ''
          this.password = ''
          this.confirmPassword = ''
          this.isErrors = false
        } else {
          this.isErrors = true
        }
      }
    );
  }

}
