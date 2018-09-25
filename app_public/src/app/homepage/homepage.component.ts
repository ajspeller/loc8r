import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  constructor() {}

  line1 =
    'Looking for wifi and a seat? Loc8r helps you find places to work when out and about.';
  line2 =
    'Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you are looking for.';

  pageContent = {
    header: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: `${this.line1} ${this.line2}`
  };

  ngOnInit() {}
}
