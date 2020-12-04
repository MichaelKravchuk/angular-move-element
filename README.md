# Angular-Move-Element

An angular 4.0+ directive that allows an element to be moved

[![npm version](https://badge.fury.io/js/ng-move-element.svg)](http://badge.fury.io/js/ng-move-element)
[![GitHub issues](https://img.shields.io/github/issues/MichaelKravchuk/angular-move-element.svg)](https://github.com/MichaelKravchuk/angular-move-element/issues)
[![GitHub stars](https://img.shields.io/github/stars/MichaelKravchuk/angular-move-element.svg)](https://github.com/MichaelKravchuk/angular-move-element/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/MichaelKravchuk/angular-move-element/master/LICENSE)


## Demo
https://michaelkravchuk.github.io/angular-libs

## Usage

**Step 1:** Install ng-move-element

```sh
npm install ng-move-element --save
```

**Step 2:** Import angular move element module into your app module

```ts
...
import { AngularMoveElementModule } from 'ng-move-element';

...

@NgModule({
    ...
    imports: [
        ...,
        AngularMoveElementModule
    ],
    ...
})
export class AppModule { }
```

**Step 3:** Add HTML code

```html
<div class="container" #container [style.top.px]="data.top" [style.left.px]="data.left">
    <div (move)="onMove($event)"
         [targetElement]="container"
    ></div>
</div>
```

Or if you use angular component (and look at TS)

```html
   [targetElement]="containerComponent"
```

**Step 4:** Add ts code

```ts
  public data: any = {};

  public onResize(evt: AngularMoveElementEvent): void {
        this.data.top = evt.currentTopValue;
        this.data.left = evt.currentLeftValue;
  }
```

and add ViewChild if you use angular component  (don`t forget about breaking changes when you use *ngIf with ViewChild)

```ts
  @ViewChild('container',  {read: ElementRef})
  public readonly containerElement;
```


## Interfaces
```ts
interface AngularMoveElementEvent {
    currentTopValue: number;
    currentLeftValue: number;
    originalTopValue: number;
    originalLeftValue: number;
    differenceTopValue: number;
    differenceLeftValue: number;
}
```

## API

| Attribute      | Type   | Description
|----------------|--------|------------
| moveStart | () => AngularMoveElementEvent | This event is fired when move is started (only one time) 
| move | () => AngularMoveElementEvent | This event is fired when mouse move and position is changed 
| moveEnd | () => AngularMoveElementEvent | This event is fired when move is finished (only one time) 
| targetElement | HTMLElement | Element that will be moved
| applyClass | string | CSS class that will be assigned to the "targetElement" when the "moveStart "is called and will be removed when "moveEnd"is called





## License
[MIT](https://choosealicense.com/licenses/mit/)
