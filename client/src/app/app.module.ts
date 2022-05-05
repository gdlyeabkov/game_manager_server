import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { CreateNewsComponent } from './create-news/create-news.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { CreateForumComponent } from './create-forum/create-forum.component';
import { CreateExperimentComponent } from './create-experiment/create-experiment.component';
import { CreateIconComponent } from './create-icon/create-icon.component';
import { CreatePointsStoreItemComponent } from './create-points-store-item/create-points-store-item.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateGameComponent,
    CreateNewsComponent,
    HomeComponent,
    HeaderComponent,
    CreateForumComponent,
    CreateExperimentComponent,
    CreateIconComponent,
    CreatePointsStoreItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
