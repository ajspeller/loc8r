import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  constructor() {}

  pageContent = {
    header: {
      title: 'About Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    content:
      'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. \n\nlorem \n\nlorem \n\nlorem'
  };

  ngOnInit() {}
}
