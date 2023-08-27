import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizerComponent } from './organizer.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {ParticipantsComponent} from "./components/participants/participants.component";
import { EventSidebarComponent } from './components/event-sidebar/event-sidebar.component';
import {EventViewComponent} from "./components/event-view/event-view.component";
import {SharedModule} from "@shared/shared/shared.module";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    OrganizerComponent,
    EventViewComponent,
    ParticipantsComponent,
    EventSidebarComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    SharedModule,
    MatCheckboxModule,
    MatFormFieldModule,
    FormsModule
  ]
})
export class OrganizerModule { }
