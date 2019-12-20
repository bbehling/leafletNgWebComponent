import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { Injector } from "@angular/core";
import { LeafletComponent } from "./leaflet/leaflet.component";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { environment } from "./../environments/environment";

@NgModule({
  declarations: [LeafletComponent, AppComponent],
  imports: [BrowserModule, HttpClientModule],
  entryComponents: [AppComponent, LeafletComponent]
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    // don't bootstrap AppComponent if in production
    // development will bootstrap AppComponent, which references the component
    // production will bootstrap custom element
    if (environment.production) {
      const el = createCustomElement(LeafletComponent, {
        injector: this.injector
      });
      customElements.define("leaflet-component", el);
    } else if (environment.development) {
      const appRootEl = createCustomElement(AppComponent, {
        injector: this.injector
      });
      customElements.define("app-root", appRootEl);
    }
  }
}
