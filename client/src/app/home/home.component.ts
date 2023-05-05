import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

import * as jwt from 'jsonwebtoken'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isAuth:boolean = false

  constructor(private route: ActivatedRoute, private router:Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.checkToken();
    this.route.queryParams.subscribe(
      (value: any) => {
        const talkParam = value['talk']
        const isTalkParamExists = talkParam !== undefined
        const friendParam = value['friend']
        const isFriendParamExists = friendParam !== undefined
        if (isTalkParamExists) {
          this.router.navigate(['groups/attach'], { queryParams: { talk: talkParam } })
        } else if (isFriendParamExists) {
          this.router.navigate(['friends/requests/add'], { queryParams: { friend: friendParam } })
        }
      }
    )
  }

  toggleAuthEmitHandler (isAdmin: boolean) {
    this.isAuth = isAdmin
    if (isAdmin) {
    }
  }

  checkToken() {
    const possibleToken = localStorage.getItem('office_ware_game_manager')
    const isTokenExists = possibleToken !== null
    if (isTokenExists) {
      this.http.get(
        `https://loud-reminiscent-jackrabbit.glitch.me/api/users/token/check/?token=${possibleToken}`
      ).subscribe(
        (value: any) => {
          const status = value['status']
          let isOk = status === "OK"
          if (isOk){
            const login = value['login']
            this.isAuth = true;
          }
        }
      )
    }
  }

}
