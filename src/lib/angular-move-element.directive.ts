import {Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';
import {AngularMoveElementEvent} from './angular-move-element-event.interface';

@Directive({
    selector: '[move], [moveStart], [moveEnd]'
})
export class AngularMoveElementDirective {
    private mouseUpListener: () => void;
    private mouseMoveListener: () => void;

    private targetElementTopValue: number;
    private targetElementLeftValue: number;

    private originalEvent: MouseEvent;

    @Input()
    public readonly targetElement: HTMLElement | ElementRef;

    @Input()
    public readonly applyClass = 'move';

    @Output()
    public readonly moveStart: EventEmitter<AngularMoveElementEvent> = new EventEmitter();

    @Output()
    public readonly move: EventEmitter<AngularMoveElementEvent> = new EventEmitter();

    @Output()
    public readonly moveEnd: EventEmitter<AngularMoveElementEvent> = new EventEmitter();


    constructor(private readonly elementRef: ElementRef,
                private readonly renderer2: Renderer2
    ) {}


    @HostListener('mousedown', ['$event'])
    public onMouseDown(evt: MouseEvent): void {
        evt.preventDefault();

        this.setOriginalData(evt);

        this.moveStart.emit(this.generateValuesForEvent(evt));

        this.mouseUpListener = this.renderer2.listen('document', 'mouseup', event => this.onMouseUp(event));
        this.mouseMoveListener = this.renderer2.listen('document', 'mousemove', event => this.onMouseMove(event));
        this.renderer2.addClass(this.elementRef.nativeElement, this.applyClass);
    }


    private onMouseUp(evt: MouseEvent): void {
        const eventValues = this.generateValuesForEvent(evt);
        this.move.emit(eventValues);
        this.mouseMoveListener();
        this.mouseUpListener();

        this.renderer2.removeClass(this.elementRef.nativeElement, this.applyClass);
        this.moveEnd.emit(eventValues);
    }


    private onMouseMove(evt: MouseEvent): void {
        this.move.emit(this.generateValuesForEvent(evt));
    }


    private setOriginalData(originalEvent: MouseEvent) {
        this.originalEvent = originalEvent;

        if (this.targetElement) {
            const dataSource = this.targetElement instanceof ElementRef ? this.targetElement.nativeElement : this.targetElement;
            this.targetElementTopValue = dataSource.offsetTop;
            this.targetElementLeftValue = dataSource.offsetLeft;
        } else {
            this.targetElementTopValue = 0;
            this.targetElementLeftValue = 0;
        }
    }


    private generateValuesForEvent(evt: MouseEvent): AngularMoveElementEvent {
        const originalXValue = this.originalEvent.clientX;
        const originalYValue = this.originalEvent.clientY;

        const diffLeftValue = evt.clientX - originalXValue;
        const diffTopValue = evt.clientY - originalYValue;

        return {
            originalEvent: this.originalEvent,
            currentTopValue: this.targetElementTopValue + diffTopValue,
            currentLeftValue: this.targetElementLeftValue + diffLeftValue,
            originalTopValue: this.targetElementTopValue,
            originalLeftValue: this.targetElementLeftValue,
            differenceTopValue: this.targetElementTopValue - diffTopValue,
            differenceLeftValue: this.targetElementLeftValue - diffLeftValue,
        };
    }
}

