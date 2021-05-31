export interface AngularMoveElementEvent {
    currentTopValue: number;
    currentLeftValue: number;

    originalTopValue: number;
    originalLeftValue: number;

    differenceTopValue: number;
    differenceLeftValue: number;

    originalEvent: MouseEvent;
}

export interface Position {
    top: number;
    width: number;
    height: number;
    left: number;
}
