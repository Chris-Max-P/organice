import {MatDialog} from "@angular/material/dialog";
import {Injectable} from "@angular/core";
import {UtilityService} from "./utility.service";

@Injectable({providedIn: 'root' })
export class DialogService {

  constructor(private dialog: MatDialog,
              private utilityService: UtilityService) {
  }

/*  openConfirmDialog(title: string, confirmAction: Function,  text: string = '', confirmActionArgs: any[] = []) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: title,
        text: text,
        confirmAction: confirmAction,
        args: confirmActionArgs
      },
      panelClass: 'confirm-dialog'
    });
  }*/



  openDialog(dialogToOpen: any, data: any): void {
    this.dialog.open(dialogToOpen, {
      data: data,
      panelClass: 'dialog-styles',
    });
  }

  openEditDialogWithConfirmOnClose(dialogToOpen: any, data: any) {
    let openedDialogRef = this.dialog.open(dialogToOpen, {
      panelClass: 'dialog-styles',
      disableClose: true,
      data: this.utilityService.deepCopy(data)
    });
    openedDialogRef.backdropClick().subscribe(() => {
      this.openConfirmOmitData();
    });
  }

  openConfirmOmitData() {
    // this.openConfirmDialog('confirm-dialog.title.omit-data', this.closeAll.bind(this));
  }

  closeAll() {
    this.dialog.closeAll();
  }
}
