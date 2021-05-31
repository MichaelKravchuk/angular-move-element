import {Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, Renderer2, SimpleChanges} from '@angular/core';
import {AngularMoveElementEvent, Position} from './angular-move-element-event.interface';

@Directive({
    selector: '[move], [moveStart], [moveEnd]'
})
export class AngularMoveElementDirective implements OnChanges {
    private mouseUpListener: () => void;
    private mouseMoveListener: () => void;

    private targetElementWidthValue: number;
    private targetElementHeightValue: number;

    private targetElementTopValue: number;
    private targetElementLeftValue: number;

    private originalEvent: MouseEvent;

    @Input()
    public readonly targetElement: HTMLElement | ElementRef;

    @Input()
    public readonly applyClass = 'move';

    @Input()
    public readonly rect: Position;

    @Input()
    public readonly forceMove: MouseEvent;

    @Output()
    public readonly forceMoveChange = new EventEmitter<MouseEvent>();

    @Output()
    public readonly moveStart: EventEmitter<AngularMoveElementEvent> = new EventEmitter();

    @Output()
    public readonly move: EventEmitter<AngularMoveElementEvent> = new EventEmitter();

    @Output()
    public readonly moveEnd: EventEmitter<AngularMoveElementEvent> = new EventEmitter();


    constructor(private readonly elementRef: ElementRef,
                private readonly renderer2: Renderer2
    ) {
    }


    public ngOnChanges(changes: SimpleChanges) {
        if (changes.forceMove && changes.forceMove.currentValue) {
            this.onMouseDown(changes.forceMove.currentValue);
            this.forceMoveChange.emit(null);
        }
    }


    @HostListener('mousedown', ['$event'])
    public onMouseDown(evt: MouseEvent): void {
        evt.preventDefault();

        this.setOriginalData(evt);

        this.moveStart.emit(this.generateValuesForEvent(evt));

        this.mouseUpListener = this.renderer2.listen('document', 'mouseup', event => this.onMouseUp(event));
        this.mouseMoveListener = this.renderer2.listen('document', 'mousemove', event => this.onMouseMove(event));
        this.renderer2.addClass(this.targetNativeElement, this.applyClass);
    }


    private onMouseUp(evt: MouseEvent): void {
        const eventValues = this.generateValuesForEvent(evt);
        this.move.emit(eventValues);
        this.mouseMoveListener();
        this.mouseUpListener();

        this.renderer2.removeClass(this.targetNativeElement, this.applyClass);
        this.moveEnd.emit(eventValues);
    }


    private onMouseMove(evt: MouseEvent): void {
        this.move.emit(this.generateValuesForEvent(evt));
    }


    private get targetNativeElement(): HTMLElement {
        return this.targetElement instanceof ElementRef ? this.targetElement.nativeElement : this.targetElement;
    }


    private setOriginalData(originalEvent: MouseEvent) {
        this.originalEvent = originalEvent;

        if (this.targetElement) {
            const dataSource = this.targetNativeElement;
            this.targetElementWidthValue = dataSource.offsetWidth;
            this.targetElementHeightValue = dataSource.offsetHeight;
            this.targetElementTopValue = dataSource.offsetTop;
            this.targetElementLeftValue = dataSource.offsetLeft;
        } else {
            this.targetElementWidthValue = 0;
            this.targetElementHeightValue = 0;
            this.targetElementTopValue = 0;
            this.targetElementLeftValue = 0;
        }
    }


    private generateValuesForEvent(evt: MouseEvent): AngularMoveElementEvent {
        const originalXValue = this.originalEvent.clientX;
        const originalYValue = this.originalEvent.clientY;

        const diffLeftValue = evt.clientX - originalXValue;
        const diffTopValue = evt.clientY - originalYValue;

        let currentTopValue = this.targetElementTopValue + diffTopValue;
        let currentLeftValue = this.targetElementLeftValue + diffLeftValue;
        const currentWidthValue = this.targetElementWidthValue;
        const currentHeightValue = this.targetElementHeightValue;

        if (this.rect) {
            if (currentTopValue < this.rect.top) {
                currentTopValue = this.rect.top;
            }
            if (currentHeightValue + currentTopValue > this.rect.height) {
                currentTopValue = this.rect.height - currentHeightValue;
            }

            if (currentLeftValue < this.rect.left) {
                currentLeftValue = this.rect.left;
            }
            if (currentWidthValue + currentLeftValue > this.rect.width) {
                currentLeftValue = this.rect.width - currentWidthValue;
            }
        }

        return {
            originalEvent: this.originalEvent,
            currentTopValue,
            currentLeftValue,
            originalTopValue: this.targetElementTopValue,
            originalLeftValue: this.targetElementLeftValue,
            differenceTopValue: currentTopValue - this.targetElementTopValue,
            differenceLeftValue: currentLeftValue - this.targetElementLeftValue,
        };
    }
}

