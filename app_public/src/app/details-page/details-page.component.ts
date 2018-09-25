import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Loc8rDataService } from '../loc8r-data.service';
import { Location } from '../location';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css']
})
export class DetailsPageComponent implements OnInit {
  constructor(
    private loc8rDataService: Loc8rDataService,
    private route: ActivatedRoute
  ) {}

  newLocation: Location;

  pageContent = {
    header: {
      title: '',
      strapline: ''
    },
    sidebar: ''
  };

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = params.get('locationId');
          return this.loc8rDataService.getLocationById(id);
        })
      )
      .subscribe((newLocation: any) => {
        const line1 =
          'is on Loc8r because ti has accessible wifi and space to sit down with your laptop and get some work done.\n\n';
        const line2 =
          'If you have been and like it - or if you do not please leave to review to help other people just like you.';
        this.newLocation = newLocation;
        this.pageContent.header.title = newLocation.name;
        this.pageContent.sidebar = `${newLocation.name} ${line1} ${line2}`;
      });
  }
}
