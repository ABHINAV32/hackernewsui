import { Component, OnInit, ViewChild  } from '@angular/core';
import { StoryService } from './service/story.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Story } from './Model/Story';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  displayedColumns: string[] = ['number', 'title', 'url'];
  dataSource: MatTableDataSource<Story> = new MatTableDataSource<Story>();
  totalItems = 0; 
  pageSize = 10; 
  currentPage = 0; 
  isLoading=false;
  dataFetched = false;
  pageSizeOptions: number[] = [5, 10, 20];
  private _paginator!: MatPaginator;
  titleFilter: string = '';
  urlFilter: string = '';   
  filteredData : Story[];
  originalData : Story[];

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
      this._paginator = paginator;
  }

  constructor(private service: StoryService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    const offset = this.currentPage * this.pageSize;
    this.isLoading = true;

    this.service.GetStoriesFromServer(offset, this.pageSize).subscribe(result => {
      this.setDataProperties(result);
      this.originalData = JSON.parse(JSON.stringify(result)); 
    });
  }

  getFromCache(): void {
    const offset = this.currentPage * this.pageSize;
    this.isLoading = true;

    this.service.GetStories(offset, this.pageSize).subscribe(result => {
      this.setDataProperties(result);
      this.originalData = JSON.parse(JSON.stringify(result)); 
    });
  }

  setDataProperties(result): void{
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
    }
    this.dataSource.data = result;
    this.totalItems = result.length;
    this.dataSource.paginator = this._paginator;
    this.dataFetched = true;
    this._paginator.pageSize = this.pageSize;
    this.isLoading = false;
  }
  
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  navigateToUrl(url: string): void {
    window.open(url, '_blank');
  }
  applyFilter(): void {
    this.currentPage = 0;
    const offset = this.currentPage * this.pageSize;
    this.isLoading = true;

    if (!this.titleFilter || this.titleFilter.trim() === '') {
      this.setDataProperties(this.originalData);
      this.isLoading = false;
      return;
    }
    this.filteredData = JSON.parse(JSON.stringify(this.originalData));
    const lowerCaseSearchTerm = this.titleFilter.toLowerCase();
    let result = this.filteredData.filter(item => 
      item.title.toLowerCase().includes(lowerCaseSearchTerm) || 
      item.url.toLowerCase().includes(lowerCaseSearchTerm)
    );

    this.setDataProperties(result);
}

filterData() {
  const lowerCaseSearchTerm = this.titleFilter.toLowerCase();
  return this.dataSource.data.filter(item => 
    item.title.toLowerCase().includes(lowerCaseSearchTerm) || 
    item.url.toLowerCase().includes(lowerCaseSearchTerm)
  );
}

}