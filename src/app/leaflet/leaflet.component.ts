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
  features = [];
  map = null;

  ngOnInit() {
    this.map = L.map("map", {
      zoomControl: false,
      center: L.latLng(35.29, -112),
      zoom: 5
    });

    esri.basemapLayer("Streets").addTo(this.map);

    this.getData();
  }

  getData = () => {
    this.mapService
      .getData(
        "http://sspcodingexercise.s3-website-us-west-2.amazonaws.com/Sample.json"
      )
      .subscribe(response => {
        this.title = response["Description"];
        this.features = response["FeatureData"];

        this.setMarkers();
      });
  };

  setMarkers() {
    // HACK - have to use require to load icon URL due to webpack rewiring URLs
    // https://stackoverflow.com/questions/56411497/leaflet-marker-not-found-production-env-angular-7
    let markerArray = [];

    var icon = L.icon({
      iconUrl: require("../../assets/marker-icon-2x.png"),
      iconSize: [27, 37]
    });

    this.features.forEach(element => {
      let x = element["geometry"]["coordinates"][0];
      let y = element["geometry"]["coordinates"][1];
      L.marker([y, x], { icon: icon }).addTo(this.map);

      markerArray.push([y, x]);
    });

    this.map.fitBounds(markerArray);
  }
}