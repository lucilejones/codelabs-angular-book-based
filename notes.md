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

# routing
add an unique id for each book
When starting a new project and it asks if we want to include routing, we should start saying Yes.
It will automatically add app-routing.module.ts

(make sure to add imports at the top of the file)

const appRoutes: Routes = [
    { path: '', redirectTo: '/bookshelf', pathMatch: 'full' },
    { path: '/bookshelf', component: BookshelfPageComponent },
    { path: 'library', component: LibraryPageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RoterModule]
})

export class AppRoutingModule {}

Then make sure to add to the app.module.ts file

Then in the app.component HTML template we put the <router-outlet></router-outlet> where we want the different routes to be displayed.

In the navigation component we don't need the event emitter and the output anymore. Instead we'll use routerLink on the anchor tags.
routerLink="/bookshelf"
routerLinkActive="active"

Based on what's in the url, Angular looks inside the routing module and then renders the component for that path.

Then in the book component HTML we'll add a router link with the book's id in order to dynamically update the route.
[routerLink]="[book.id]"
And we'll need a child route:
{ path: '/bookshelf',
    component: BookshelfPageComponent,
    children: [{ path: ':id', component: SingleBookDeatilsComponent }] },
Then we put another <router-outlet> in the bookshelf component. 

Then we'll need to get the book details from an url instead of based on an event.
We need to inject the route and the router into the component in the constructor.
Inside a TS file, it doesn't have access to anything outside of itself. Outside properties and methods need to be injected inside the constructor.
We can to subscribe to the parameters when the component loads, so we'll do it in the ngOnInit() {}

ngOnInit() {
    this.route.params.subscribe((params: Params) => {
        const bookIdFromParams = +params['id'];

        this.bookDeatils = this.bookshelfService.getBookById(bookIdFromParams);
    });
}

[console.logs printing right in the code: console ninja extension]

THen when we click on update book, we can navigate to a different route
onUpdateBook() {
this.router.navigate(['../', this.bookDetails.id, 'edit'], {
    relativeTo: this.route
})
}
Here we're saying go back a route, add the ID and then navigate relative to this route.
Then we need to create a component that holds the form for editing a book.

Then for the delete, we can say to go back a level in the routes. 
this.router.navigate(['../'])


We can reuse the same form for entering a new book or for editing an existing book.
We can create a property on the single-book-form component called isEditingBook and set it equal to false as the default. Then we can inject the route into the constructor.

constructor(private route: ActivatedRoute) {}

ngOnInit() {
    this.route.params.subscribe((params: Params) => {
        const bookId = +params['id'];

        this.isEditingBook = !!bookId;
    });
}

This uses the bang bang operator. This is a boolean based on whether the variable exists. Instead, we could use an if/else or a ternary operator.

Later, we'll learn about breaking our routing module into smaller routing modules.

# Observables
Changing event emitters to subjects.
A subject is a special type of observable. 
An observer (for example, a component) can be notified of changes, etc.

Initially we've set up event emitters in the bookshelf service as cross-component communicators. 
Angular doesn't recommend that. We should use observables.

Event emitters are more for components (child to parent, etc) and not for services.

When using Subjects instead of Event Emitters, we change emit to next.
selectedBook = new Subject<Book>();

this.bookListChanged.next(this.mySavedBooks.slice());

We can make a notification component and put it at the bottom of our app component.

<app-notification></app-notification>
And in this component we can put an alert object. 

In the TS file we need to inject the bookshelf service. We want the nofication component to subscribe to certain events at the start of its lifecycle, so we use ngOnInit().

When we subscribe we pass it a callback function.

Old way:
this.bookshelfService.bookListChanged.subscirbe((books: Book[]) => {
    console.log(books);
})

New way (something like this; look this up):
this.bookshelfService.bookListChanged.subscribe({
    next: () => {}
    error: () =>
})

We'll want to pass up three kinds of info:
books from the bookshelf
action
book we added or deleted

in the bookshelf service:
bookListChanged = new Subject<any>();

addBook(newBook: Book) {
    this.mySavedBooks.push(newBook);
    this.bookListChanged.next({
        myBooks: this.mySavedBooks.slice(),
        action: 'ADD',
        book: newBook
    })
}

deleteBookById(id: number) {
    const onDeleteBook = this.mySavedBooks.find(book => book.id === id);
    const newBooks = this.mySavedBooks.filter((book) => book.id !== id);

    this.mySavedBooks = newBooks;

    this.bookListChanged.next({
        myBooks: this.mySavedBooks.slice(),
        action: 'DELETE',
        book: onDeleteBook
    })
}

Then we need to change what one of the function returns [I missed this part]. It's not returning an array of books, but a payload.



this.bookshelfService.bookListChanged.subscribe(payload => {
    if(payload.action === 'DELETE') {
        alert(`You have deleted ${payload.book.title}.`)
    } else if(payload.action === 'ADD') {
        alert(`You have added ${payload.book.title}.`)
    }
})

# Forms
(template-driven):
These are going to be handled primarily in the HTML file.
<form (ngSubmit)="onFormSubmit(templateFormRef)" #templateFormRef="ngForm">

onFormSubmit(formObj: NgForm) {
    console.log('submitted', formObj);
}

On our form elements (input, etc) we can add the attribute required
We can add a reference #titleRef="ngModel"
We can use *ngIf on a message that shows when one of the inputs is not filled in. 
pristine: true (has not been clicked in or typed inside of)
status: "VALID" (is a valid entry)
touched: false (has not been clicked in or typed inside of)

*ngIf="!titleRef.valid && titleRef.touched"

required
#authorRef="ngModel"

We can use the disabled property on the button and only enable it if the whole form is valid.
[disabled]="!templateFormRef.valid"

In the css:
form .ng-invalid.ng-touched {
    border: 1px solid red;
}

In order to set a default value, we can set ngModel to a string.
ngModel="mystery"

Then to get the new book to show up in our bookshelf:
The default value formHadBeenSubmitted needs to get changed to true. Then we update the default empty strings in the bookDetails object get updated with the form inputs.

this.bookDetails.title = formObj.value.title

formObj.reset();

(Reactive approach):
These are going tobe handled primarily inside the TS code. 
We'll need to import the reactive module.

In the TS file - 
reactiveForm: FormGroup

this.reactiveForm = new FormGroup({
    title: new FormControl(null),
    author: new FormControl(null),
    genre: new FormControl('mystery')
})

Then we need to sync to the HTML template.
We'll bind the form with property binding.

<form [formGroup]="reactiveForm">...</form>

Then we use the attribute formControlName on each input
<input formControlName="title">

onFormSubmit() {
    console.log('Submitted', this.reactiveForm);
}

We don't need to pass the form object to the method here.

In the form setup, we can add Validators.required
this.reactiveForm = new FormGroup({
    title: new FormControl(null, Validators: required),
    author: new FormControl(null, Validators: required),
    genre: new FormControl('mystery', Validators: required)
})

*ngIf="!reactiveForm.get('title').valid && reactiveForm.get('title').touched"

[disabled]="!reactiveForm.valid"

this.bookDetails.title = this.reactiveForm.value.title

# routes and forms (review)
the new book path and the edit book path go to the same component

We can use ActivatedRoute to know which route we're on, then we can know that we want the form to be in edit mode. We can check the parameters (whether there's a book id). If the id exists we're in edit mode. If there isn't an id, we're on the add a book component and not edit mode.

isEditMode: boolean = false;
id: number = 0;

constructor(private route: ActivatedRoute) {}

ngOnIt(): void {
    this.route.params.subscribe((params: Params) => {
        this.id = +params['id];
        this.isEditMode = params['id] != null;

        if(this.isEditMode) {
            this.bookDetails = this.bookshelfService.getBookById(this.id);
            console.log(this.bookDetails)
        }
    })
}

We're saying if the id parameter is not empty, set isEditMode to true. (params['id] != null is the condition that makes isEditMode true)

Then we want to inject the bookshelf service and use the get one book method.

In the template we can bind the input to the book title property.
[ngModel]="bookDetails.title"

In the form TS file, in the submit function, we want to say if we're in edit mode, update the book; if we're not in edit mode, add the book to the bookshelf.

In the bookshelf service, functions for add book and update book.

addBook(newBook: Book) {
    this.mySavedBooks.push(newBook);
    this.bookListChanged.next(this.mySavedBooks.slice());
}

updateBook(updatedBook: Book) {
    // step 1: find the index of book (in real life it'd have an id)
    const nookIdx = this.mySavedBooks.findIndex(book => book.id === updatedBook.id)

    // step 2: update book by index
    this.mySavedBooks[bookIdx] = updatedBook;
}

In order to update the booklist on the left in real time when we edit a book, we need a Subject. We need to alert subscribers that a book has changed in the update book function.

# pipes
We can create a new pipe with the CLI
ng g p shared/pipes/sort-books
This will create a sort-books.pipe.ts file with the @Pipe({}) decorator and the implements PipeTransform with the transform method.

export class SortBooksPipe implements PipeTransform {
    transform(books: Book[], field: string): unknown {
        books.sort((a: Book, b: Book) => {
            if (a[field] < b[field]) {
                return -1;
            } else {
                return 1;
            }
        });
        return books;
    }
}

Then in the HTML file, <div class="row" *ngFor="let book of mySavedBooks | sortBook: 'author'">

The author string will be a parameter of the sortBook pipe transform method, and will be passed where we have the field: string.


# HTTP requests
API - allows applications to interact with each other
REST api - sets a standard

Usually there are two environments - production (live) and development. The development environment will have a testing database, etc.

ng g environments
Creates a folder in src with two files, environment.development.ts and environment.ts

We can define configuration for the environment.

export const environment = {
    firebaseUrl: "string",
    production: false
}

the other file (environment.ts) will have the configuration for production

export const environment = {
    firebaseUrl: 'string',
    production: true
}


Then in the http.service.ts we'll set a const for the url:

const FIREBASE_URL = environment.firebaseUrl

# AUTHENTICATION

Save the Firebase web api key in our enviroment variables. Usually we'll have a different database for production and for development.

firebaseWebAPI: 'key'

Can write a signUpWithEmailPassword method because we might have other signup methods later. (Firebase allows us to signup with google or facebook, etc)

We can pass the method an object, we can create an interface for that.

export interface IAuthReqData {
    email: string;
    password: string;
}

Good idea to add validation at the beginning of each function.
if (!authData.email || !authData.password) return;
We'll want to later add validation like the email should have an @ symbol, etc.

At the end of the url: `...signUp?key=${environment.firebaseWebAPI}`

http.post('url', {
    ...authData,
    returnSecrueToken: true,
})

In the auth component:

onAuthSubmit(form: NgForm) {
    const { email, password } = form.value;

    if (!form.valid || !email || !password) return;

    if (this.isSignInMode) {
        <!-- logic to sign in -->
    } else {
        this.authService.signupWithEmailPassword({
            email,
            pasword,
        }).pipe(
            tap((res) => {
                console.log(res);
            })
        );
    }
}

We need .pipe(), and we need to subscribe.
tap() will not alter the data; it will just do something on the side.

Then we need to store the user and the token that's being sent back. - we'll do this as a side effect

If the observable is successful, if the user is able to signup or sign in, we'll want to reroute to the bookshelf page.
(We'll need to inject the router into our auth component - in the constructor)
If there's an error we'll want to display that to the user.
Then on complete, we'll want to reset the form.

this.errorMsg = res?.error?.error?.message || 'Whoops! An error occured.'


We need to create a new BehaviorSubject, which can only store one thing at a time.
currUser = new BehaviorSubject<User | null>(null);

Then we'll have a User model (We'll want to keep this small - at least on the user side, since they'll get sent with every single request)

export class User {
    constructor(
        public id: string,
        public email: string,
        private _token: string,
        private _tokenExpDate: Date
    ) {}

    <!-- methods -->
    public get token() {
        <!-- ensure token exists and is not expired -->
        if (!this._tokenExpDate || new Date() > this._tokenExpDate) return null;

        return this._token
    }
}


In the signup with email function, in the tap:
tap((resData) => {
    const { email, localId, idToken, expiresIn } = resData;

    this.handleAuth(email, localId, idToken, +expiredIn)
})

In the auth service:

private handleAuth(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
) {
    <!-- create the expiration token -->
    <!-- this will be for one hour -->
    const expDate = new Date(
        expiresIn * 1000 + new Date().getTime()
    )

    <!-- create the user -->
    const newUser = new User(userId, email, token, expDate);

    <!-- emit the new user through the behavior token -->
    this.currUser.next(newUser);

    <!-- store the user in local storage -->
    localStorage.setItem('user-bookbased', JSON.stringify(newUser));
}

In order to update the navbar, we need to add inside of ngOnInit(){}, we want to subscribe to the curreUser observable.
In order to use that, we need to inject the authService into the navigation.
!! (bang bang) turns whatever is to the right of it to a truthy or falsey value.

For the signout button we'll create a method in the auth service that removes the current user (next the current user to null)

this.currUser.next(null);
this.router.navigate(['auth']);

Once we set up the auto signing and auto signout methods, we need to update the expiration timer for the token


The authGuard inside of the notes is an injectable and is deprecated.
The new way is to have it as a function. [canActivate]
(This will be in the github repository.)

We have to add the authGuard to any of the routes we want to be protected.