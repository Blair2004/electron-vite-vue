import { BehaviorSubject, Observable, Subject } from "rxjs";

class ObservableService {
    private subject = new BehaviorSubject({});

    public observable: Observable<any> = this.subject.asObservable();

    public next( value: any ): void {
        this.subject.next( value );
    }
}

export const store = new ObservableService();