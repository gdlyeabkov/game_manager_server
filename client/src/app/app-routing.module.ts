import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {  CreateGameComponent } from './create-game/create-game.component'
import {  CreateNewsComponent } from './create-news/create-news.component'
import {  HomeComponent } from './home/home.component'

const routes: Routes = [
  {
    'path': 'games/add',
    'component': CreateGameComponent
  },
  {
    'path': 'news/add',
    'component': CreateNewsComponent
  },
  {
    'path': '**',
    'component': HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
