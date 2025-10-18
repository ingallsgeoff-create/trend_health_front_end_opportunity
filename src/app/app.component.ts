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

  updateValue(bol: boolean) {
    this.shared.verbalErrorLogging = bol;
  }
}
