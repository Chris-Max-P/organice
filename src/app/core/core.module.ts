import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreComponent} from './core.component';
import {OrganizerModule} from "../modules/event-organizer/organizer.module";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    CoreComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    OrganizerModule
  ]
})
export class CoreModule {
}
