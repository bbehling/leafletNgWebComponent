import { Component, OnInit } from "@angular/core";
import { MapService } from "../map.service";
import * as esri from "esri-leaflet";
import * as L from "leaflet";

@Component({
  selector: "leaflet-component",
  templateUrl: "./leaflet.component.html",
  styleUrls: ["./leaflet.component.css"],
  providers: [MapService]
})
export class LeafletComponent implements OnInit {
  constructor(private mapService: MapService) {}

  title = "";
  features;
  map = null;

  ngOnInit() {
    this.map = L.map("map", {
      zoomControl: false,
      center: L.latLng(35.29, -112),
      zoom: 5
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.getData();
  }

  getData = () => {
    this.mapService
      .getData(
        "https://cdn.jsdelivr.net/gh/bbehling/leafletNgWebComponent@1.0.4/elements/14ners.json"
      )
      .subscribe(response => {
        this.title = response["properties"].mapTitle;
        this.features = response["features"];

        this.setMarkers();
      });
  };

  setMarkers() {
    // HACK - have to use require to load icon URL due to webpack rewiring URLs
    // https://stackoverflow.com/questions/56411497/leaflet-marker-not-found-production-env-angular-7
    let markerArray = [];

    const icon: any = L.icon({
      iconUrl:
        "https://cdn.jsdelivr.net/gh/bbehling/leafletNgWebComponent/elements/marker-icon-2x.png",
      iconSize: [27, 37]
    });

    L.geoJSON(this.features, {
      pointToLayer: (feature, latlng) => {
        markerArray.push([latlng.lat, latlng.lng]);
        //debugger;
        return L.marker(latlng, { icon: icon })
          .addTo(this.map)
          .bindPopup(
            `<b>${feature.properties.name}</b><br>Elevation: ${(
              feature.properties.elevation * 3.28084
            ).toFixed(2)}`
          );
      }
    }).addTo(this.map);
    /*
    this.features.forEach(element => {
      debugger;
      let x = element["coords"]["lon"];
      let y = element["coords"]["lat"];
      L.marker([y, x], { icon: icon })
        .addTo(this.map)
        .bindPopup(
          `<b>${element["name"]}</b><br>Elevation: ${(
            element["elevation"] * 3.28084
          ).toFixed(2)}`
        );

      markerArray.push([y, x]);
    });
 */
    this.map.fitBounds(markerArray);
  }
}
