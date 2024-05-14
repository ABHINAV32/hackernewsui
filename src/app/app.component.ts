import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { StoryService } from './service/story.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Story } from './Model/Story';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  
  displayedColumns: string[] = ['number', 'title', 'url'];
  dataSource: MatTableDataSource<Story> = new MatTableDataSource<Story>();
  totalItems = 0; // Track total items count
  pageSize = 10; // Set default page size to 10
  currentPage = 0; // Track current page number
  isLoading=false;
  dataFetched = false; // Track if data has been fetched
  pageSizeOptions: number[] = [5, 10, 20];
  private _paginator!: MatPaginator;

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator) {
      this._paginator = paginator;
      this._paginator.pageSize = this.pageSize;
    }
  }

  constructor(private service: StoryService) {}

  ngAfterViewInit(): void {
    this.getAll();
  }

  getAll(): void {
    const offset = this.currentPage * this.pageSize;
    this.isLoading = true;

    this.service.GetStoriesFromServer(offset, this.pageSize).subscribe(result => {
      this.setDataProperties(result);
    });
  }

  getFromCache(): void {
    const offset = this.currentPage * this.pageSize;
    this.isLoading = true;

    this.service.GetStories(offset, this.pageSize).subscribe(result => {
      this.setDataProperties(result);
    });
  }

  setDataProperties(result): void{
    this.dataSource.data = result;
    this.totalItems = result.length;
    this.dataSource.paginator = this._paginator;
    this.dataFetched = true;
    this._paginator.pageSize = this.pageSize;
    this.isLoading = false;
  }
  
  onPageChange(event: PageEvent): void {
    // Update current page number and fetch data for the new page
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAll();
  }

  navigateToUrl(url: string): void {
    window.open(url, '_blank');
  }
}
