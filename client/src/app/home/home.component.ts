import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (value: any) => {
        const talkParam = value['talk']
        const isTalkParamExists = talkParam !== undefined
        if (isTalkParamExists) {
          this.router.navigate(['groups/attach'], { queryParams: { talk: talkParam } })
        }
      }
    )
  }

}
