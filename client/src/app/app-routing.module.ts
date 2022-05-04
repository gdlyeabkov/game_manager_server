import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {  CreateGameComponent } from './create-game/create-game.component'
import {  CreateNewsComponent } from './create-news/create-news.component'
import {  CreateForumComponent } from './create-forum/create-forum.component'
import {  CreateExperimentComponent } from './create-experiment/create-experiment.component'
import {  CreateIconComponent } from './create-icon/create-icon.component'
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
    'path': 'forums/add',
    'component': CreateForumComponent
  },
  {
    'path': 'experiments/add',
    'component': CreateExperimentComponent
  },
  {
    'path': 'icons/add',
    'component': CreateIconComponent
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
