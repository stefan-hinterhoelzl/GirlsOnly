import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  filterText = "";
  filterTags = [];
  filterTypeNew = true;
  filterTypeDiscussedALot = false;
  filterTypeClickedOften = false;
  currentPage = 1;
  resetPageNumCounter : number;

  constructor() { }

  ngOnInit(): void { }

  setFilterText(event: string) {
    this.filterText = event;
  }

  setFilterTags(event: string[]) {
    this.filterTags = event;
  }

  setFilterType(event: string) {
    this.filterTypeNew = (event === "new") ? true : false;
    this.filterTypeDiscussedALot = (event === "discussedALot") ? true : false;
    this.filterTypeClickedOften = (event === "oftenClicked") ? true : false;
  }
  
  setCurrentPage(event: number) {
    this.currentPage = event;
  }
  
  resetPageNum(event: number) {
    this.resetPageNumCounter = event;
  }
}
