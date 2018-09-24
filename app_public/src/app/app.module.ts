import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HomeListComponent } from './home-list/home-list.component';
import { DistancePipe } from './distance.pipe';
import { Loc8rDataService } from './loc8r-data.service';

@NgModule({
  declarations: [HomeListComponent, DistancePipe],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [Loc8rDataService],
  bootstrap: [HomeListComponent]
})
export class AppModule {}
