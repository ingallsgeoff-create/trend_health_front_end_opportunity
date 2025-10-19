import { Component } from "@angular/core";
import { SharedService } from './shared/shared.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

  title = "frontend-candidate";

  constructor(private shared: SharedService) { }

  ngOnInit() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear().toString();
    }
  };

  updateValue(bol: boolean): void {
    this.shared.verboseErrorLogging = bol;
  }
}
