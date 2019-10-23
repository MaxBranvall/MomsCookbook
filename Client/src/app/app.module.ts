import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { OrderModule } from 'ngx-order-pipe';

import { AppComponent } from './app.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { AppRoutingModule } from './app-routing.module';
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { RecipeEntryComponent } from './recipe-entry/recipe-entry.component';
import { RecipeService} from './Services/recipe.service';

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    HomePageComponent,
    RecipeListComponent,
    RecipePageComponent,
    RecipeEntryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    OrderModule,
    HttpClientModule
  ],
  providers: [RecipeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
