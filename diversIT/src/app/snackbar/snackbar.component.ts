import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * @description snackbar component can be used to alert the user of some circumstance
 * @class SnackbarComponent
 */
@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})


/**
 * class Snackbarcomponent
 */
export class SnackbarComponent {


  /**
   * variable for timeout - not supposed to be changed
   */
  timeOut = 5000;



  /**
   * Creates an instance of SnackbarComponent.
   * @param {MatSnackBar} snackBar
   * @memberof SnackbarComponent
   */
  constructor(
    public snackBar: MatSnackBar
  ) { }


  /**
   * @description takes parameters and opens a small snackbar at the bottom right of the screen
   *
   * @param {string} message text of message
   * @param {string} [className=null] color of Snackbar e.g. "red-snackbar" "green-snackbar"
   * @param {string} [action=" "] Buttontext of Snackbar
   * @return {*}  In either case, a MatSnackBarRef is returned. This can be used to dismiss the snackbar or to receive notification of when the snackbar is dismissed
   * @memberof SnackbarComponent
   * 
   * @example:
   * let snackbarRef = openSnackBar("Hello World", "Accept", "green-snackbar")
   */
  openSnackBar(message: string, className: string = null, action: string = " ") {
    return this.snackBar.open(message, action, {
      duration: this.timeOut,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [className],
    });
  }
}
