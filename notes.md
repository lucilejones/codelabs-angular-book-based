in the navbar component we need to add two properties:
collapsed: boolean = true;
show: boolean = false;

then the button we'll do a (click) and set it equal to the opposite of collapsed

on the div we have to add [class.collapsed]="collapsed"


on the anchor tag for the dropdown we need to add
(click)="show = !show"


ng g c shared/book

# Directives
Good for event handling. Directives are more like components. However, we can import the same logic into multiple components. 
Also good for binding data.

Often put directives in their own folder in the shared folder.
dropdown.directive.ts
We use @Directive({}). And we use a selector to be able to use it in the DOM.
selector: '[appDropdown]'

export class DropdownDirective {
    constructore(private elRef: ElementRef, private rendered: Render2) {}
}

Then we want to bind it to a class using HostBinding (from '@angular/core').
Then we need something to toggle open. We'll bind to a user event, here a click.
HostListener will listen for events; we can potentially have this in multiple places.
Then we can use querySelector to get ahold of an element. 


renderer will make sure we have access to the DOM befor trying to maninpulate it.

Then we can add the directive onto an html element with the attribute. And that is our host. Then we add or remove a class based on whether a variable is true or false. 

We also have to make sure we add the directive to the declarations array in the app.module.ts

# Services
Instead of having to do chains of @Output, @Input, we can use services to inject data to all different parts of our code.

ng g s bookshelf-page/bookshelf --skip-tests

First we want to create a centralized location that holds the array of books.
A service file should deal with data, and a component file should deal with displaying that data. 

In the service.ts file we create the variable, right now, an array of books.
private myBooks: Book[] = [
    new Book(...)
]
We make it private to only be modified by methods from the class.

We'll use this.myBooks.slice(); in order to return a copy of the array and not the actual array itself.

getBooks() {
    return this.myBooks.slice();
}

saveBook(book: Book) {
    this.myBooks.push(book);
}

removeBook(index: number) {
    if(index !== -1) {
        this.myBooks.splice(index, 1)
    }
}
[this deletes one at that input index]

Then we'll need to use 2 different event emitters, one for the book selected and one for the book list change.
In the directive we don't need to use @Output for the event emitter.

bookSelected = new EventEmitter<Book>();
bookListChanged = new EventEmitter<Book[]>();

Then we add to the saveBook method (and to the removeBook method):
this.bookListChanged.emit(this.myBook.slice());

In the booklist component, in the TS file, we need a constructor.
Dependency injection comes in inside the constructor.

constructor(private bookshelfService: BookshelfService) {}

We need to make sure to import the service from its folder.

Then we use OnInit:
ngOnInit() {
    this.mySavedBooks = this.bookshelfService.getBooks();

    this.bookshelfService.booklistChanged.subscribe((books: Book[]) => {
        this.mySavedBooks = books;
    });
}

We use .subscribe() to get notified with each change. 

onRemoveBook(index: number) {

}

In the saved book list component, in the template, we add to the ngFor, we add access to the index:
let i = index

Then we add a click event to the button for the onRemoveBook method.


We can have services talk to each other. This example uses the library service.

In the api-results-list TS file, we can inject both the library service and the bookshelf service.
With ngOnint() {} we use the getBooks from the library service, and then we use the saveBook method from the bookshelf service. 

In ther services.ts file:
Services have an ngInjectable({}) object.
It'll be providedIn: 'root',
We don't need to add them to the app.module.