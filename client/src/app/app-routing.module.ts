import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateGameComponent } from './create-game/create-game.component'
import { CreateNewsComponent } from './create-news/create-news.component'
import { CreateForumComponent } from './create-forum/create-forum.component'
import { CreateExperimentComponent } from './create-experiment/create-experiment.component'
import { CreateIconComponent } from './create-icon/create-icon.component'
import { CreatePointsStoreItemComponent } from './create-points-store-item/create-points-store-item.component'
import { GroupAttacherComponent } from './group-attacher/group-attacher.component'
import { FriendRequestAddComponent } from './friend-request-add/friend-request-add.component'
import { CreateGameTagComponent } from './create-game-tag/create-game-tag.component'
import { CreateUserComponent } from './create-user/create-user.component'
import { SendMailForUsersComponent } from './send-mail-for-users/send-mail-for-users.component'
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
    'path': 'points/items/add',
    'component': CreatePointsStoreItemComponent
  },
  {
    'path': 'groups/attach',
    'component': GroupAttacherComponent
  },
  {
    'path': 'friends/requests/add',
    'component': FriendRequestAddComponent
  },
  {
    'path': 'games/tags/add',
    'component': CreateGameTagComponent
  },
  {
    'path': 'users/add',
    'component': CreateUserComponent
  },
  {
    'path': 'users/send',
    'component': SendMailForUsersComponent
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
