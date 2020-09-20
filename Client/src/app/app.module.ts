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

import { OrderModule } from 'ngx-order-pipe';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { HttpErrorInterceptor } from './_interceptors/http-error.interceptor';
import { AccountPageComponent } from './account-page/account-page.component';
import { GlobalErrorHandlerService } from './Services/global-error-handler.service';
import { NewaccountComponent } from './newaccount/newaccount.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';


@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    HomePageComponent,
    RecipeListComponent,
    RecipePageComponent,
    RecipeEntryComponent,
    LoadingScreenComponent,
    AuthPageComponent,
    AccountPageComponent,
    NewaccountComponent,
    VerifyEmailComponent,
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
      useClass: JwtInterceptor,
      multi: true
    },
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
