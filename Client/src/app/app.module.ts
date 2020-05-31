import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { RecipeEntryComponent } from './recipe-entry/recipe-entry.component';

import { RecipeService} from './Services/recipe.service';
import { HttpErrorInterceptor } from './_interceptors/http-error.interceptor';

import { OrderModule } from 'ngx-order-pipe';
import { GlobalErrorHandlerService } from './Services/global-error-handler.service';


@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    HomePageComponent,
    RecipeListComponent,
    RecipePageComponent,
    RecipeEntryComponent,
    LoadingScreenComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    OrderModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    RecipeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
