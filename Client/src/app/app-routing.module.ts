import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { RecipeEntryComponent } from './recipe-entry/recipe-entry.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path:'newentry', component: RecipeEntryComponent},
  { path: ':categoryTitle', component: RecipeListComponent },
  { path: ':categoryTitle/:recipeName', component: RecipePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
