import { Component } from '@angular/core';
import { Book } from '../../shared/book.model'

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  myBooks: Book[] = [
    new Book(
      'Harry Potter',
      'Fantasy',
      'https://source.unsplash.com/9Rmmgj3wsJU'
    ),
    new Book(
      'Twilight',
      'YA Fantasy',
      'https://source.unsplash.com/CoqJGsFVJtM'
    )
  ]
}
