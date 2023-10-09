import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BookshelfComponent } from './bookshelf/bookshelf.component';

@NgModule({
  declarations: [
    AppComponent,
    BookshelfComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
