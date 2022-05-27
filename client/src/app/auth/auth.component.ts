import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  email: string = ''
  password: string = ''
  confirmPassword: string = ''
  isErrors: boolean = false
  isAdminsExists: boolean = false

  @Output() toggleAuthEmit = new EventEmitter()

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.checkUsers()
  }

  checkUser () {
    this.http.get(
      `http://localhost:4000/api/users/check/?login=${this.email}&password=${this.password}`
    ).subscribe(
      (value: any) => {
        const status = value['status']
        let isOk = status === "OK"
        if (isOk) {
        
          const token = value['token']  
          localStorage.setItem('office_ware_game_manager', token)
          
          const userId = value['id']
          this.http.get(
            `http://localhost:4000/api/users/get/?id=${userId}`
          ).subscribe(
            (value: any) => {
              const status = value['status']
              let isOk = status === "OK"
              if (isOk) {
                const user = value['user']
                const userRole: string = user['role']
                const isAdmin = userRole === 'admin'
                this.toggleAuthEmit.emit(isAdmin)
                this.isErrors = !isAdmin
              } else {
                this.isErrors = true
              }
            }
          )

        } else {
          this.isErrors = true
        }
      }
    );
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
          this.checkUsers()
        }
        this.isErrors = !isOk
      }
    );
  }

  checkUsers () {
    this.http.get(
      `http://localhost:4000/api/users/all`
    ).subscribe(
      (value: any) => {
        const status = value['status']
        let isOk = status === "OK"
        if (isOk) {
          const users = value['users']
          const admins = users.filter((user: UserModel) => {
            const role = user['role']
            const isAdmin = role === 'admin'
            return isAdmin
          })
          const adminsCount = admins.length
          this.isAdminsExists = adminsCount >= 1
        }
      }
    );
  }

}

interface UserModel {
  role: string
}
