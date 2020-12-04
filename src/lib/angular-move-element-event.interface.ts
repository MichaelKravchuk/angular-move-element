export interface AngularMoveElementEvent {
    currentTopValue: number;
    currentLeftValue: number;

    originalTopValue: number;
    originalLeftValue: number;

    differenceTopValue: number;
    differenceLeftValue: number;

    originalEvent: MouseEvent;
}
