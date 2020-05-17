import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { RecipeEntryComponent } from './recipe-entry/recipe-entry.component';
import { LoginComponent } from './login/login.component';
import { EntryMode } from './_helpers/entry-mode.enum';
import { AuthGuard } from './_guards/auth.guard';
import { Role } from './_helpers/role.enum';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'newentry',
    component: RecipeEntryComponent,
    canActivate: [AuthGuard],
    data :
    {
      mode : EntryMode.NewEntry,
      roles: [Role.Admin]
    }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'editrecipe',
    component: RecipeEntryComponent,
    data : {mode : EntryMode.EditEntry}
  },
  {
    path: ':categoryTitle',
    component: RecipeListComponent
  },
  {
    path: ':categoryTitle/:recipeName',
    component: RecipePageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
