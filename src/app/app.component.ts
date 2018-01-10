import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
declare var alertify:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  chartData:any;
  isUploded:boolean = false;
  borderColors = ["red", "green", "blue", "orange"];
  colorCounter:number = 0;  
  fileReaded;
  
  constructor(private _http: Http) { 
    this.chartData = {
      labels:[],
      datasets:[]
    }
  }
  convertFile(csv: any) {
    this.fileReaded = csv.target.files[0];
    let reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);
    reader.onload = (e) => {
      let csv: string = reader.result;
      let allTextLines = csv.split(/\n/);
      let headers = allTextLines[0].split(',');
      let lines = [];
      let finalJSON = {};

      for (let i = 0; i < allTextLines.length; i++) {
        let data = allTextLines[i].split(',');
        if (data.length === headers.length) {          
          let serires = {};
          let scores = [];
          for (let j = 1; j < headers.length; j++) {
            let scoreYear = data[j].split("|");            
            serires[scoreYear[0]] = scoreYear[1];          
            scores.push(scoreYear[1]);
            if (this.chartData.labels.indexOf(scoreYear[0]) == -1) {
              this.chartData.labels.push(scoreYear[0]);
              this.chartData.labels.sort();
            }
          }
          finalJSON[data[0]] = serires;
          this.chartData.datasets.push({
            label: data[0],
            data: scores,
            fill: true,
            borderColor: this.borderColors[this.colorCounter++]
          });
        }
      }
      console.log(finalJSON);
      this.isUploded = true;
      this._http.post("/charts", finalJSON)
        .map(response => response.json())
        .subscribe(results => {          
          alertify.log(results["msg"], "success", 8000);
        }, err => {
          alertify.log("Could not post the data...[please see the console]", "error", 8000);
        });
    }
  }  
}
