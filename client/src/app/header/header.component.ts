import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit(): void {
  }

  addGame () {
    this.route.navigate(['games/add'])
  }

  addNews () {
    this.route.navigate(['news/add'])
  }

  addForum () {
    this.route.navigate(['forums/add'])
  }

  addExperiment () {
    this.route.navigate(['experiments/add'])
  }

  addIcon () {
    this.route.navigate(['icons/add'])
  }

  addPointsStoreItem () {
    this.route.navigate(['points/items/add'])
  }

}
