import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './UI/main/main.component';
import { UserComponent } from './UI/user/user.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'test/:username/:testCase',
    component: UserComponent
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
