import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { DATE_PIPE_DEFAULT_OPTIONS, CommonModule } from "@angular/common";


@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,
    ],
    providers: [
      {
        provide: DATE_PIPE_DEFAULT_OPTIONS,
        useValue: { dateFormat: "longDate" }
      }
    ],
    bootstrap: [AppComponent],
    imports: [
        HttpClientModule,
        BrowserModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent },
            { path: 'favoritos', component: FavoritosComponent },
            { path: '**', component: PageNotFoundComponent }
        ]),
        BrowserAnimationsModule,
        CommonModule,
    ],
    exports: [RouterModule]
})
export class AppModule { }
