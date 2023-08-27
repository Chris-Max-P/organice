import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CoreComponent} from "./core/core.component";
import {OrganizerComponent} from "./modules/event-organizer/organizer.component";

const routes: Routes = [
  {
    path: '',
    title: 'Orga, nice!',
    component: OrganizerComponent,
    loadChildren: () => import('src/app/modules/event-organizer/organizer.module').then(m => m.OrganizerModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
