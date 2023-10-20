import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SpaceNewsFavoritosService } from 'src/app/services/space-news-favoritos.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NewsResults } from 'src/app/news';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    NgIf,
    MatProgressSpinnerModule,
    DatePipe,
    RouterModule,
  ],
})
export class HomeComponent implements AfterViewInit {
  name = 'Jorge Sanders';
  toDay = new Date();
  displayedColumns: string[] = [
    'select',
    'id',
    'news_site',
    'published_at',
    'title',
    'summary',
  ];
  dataSource = new MatTableDataSource<NewsResults>();
  exampleDatabase: ExampleHttpDatabase | null | undefined;
  data: NewsResults[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageSize = 5;
  offset = 0;

  constructor(
    private http: HttpClient,
    private serviceFavoritos: SpaceNewsFavoritosService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.exampleDatabase = new ExampleHttpDatabase(this.http);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getRepoIssues(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.pageSize,
            this.offset
          ).pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.count;
          return data;
        })
      )
      .subscribe(
        (data) => (
          (this.data = data.results),
          (this.dataSource = new MatTableDataSource(data.results))
        )
      );
    console.log('this.data', this.data);
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  selection = new SelectionModel<NewsResults>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  formatStringToDate(date: string): any {
    return new Date(date);
  }

  onSelect(row: any) {
    this.serviceFavoritos.addNewsFavoritos(row).subscribe();
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: NewsResults): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  pageEvents(event: any) {
    this.pageSize = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
  }
}

export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {}

  getRepoIssues(
    sort: string,
    order: SortDirection,
    page: number,
    pageSize: number,
    offset: number
  ): Observable<any> {
    const href = 'https://api.spaceflightnewsapi.net/v4/articles/';
    let requestUrl = `${href}?limit=${pageSize}&offset=${offset}&ordering=${sort}+${order}&page=${page + 1}`;
    console.log('requestUrl', requestUrl);
    return this._httpClient.get<any>(requestUrl);
  }
}
