import {
    Component,
    ChangeDetectionStrategy,
    Inject,
    ViewChild,
    TemplateRef,
    OnInit
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
    MatDialog,
    MatDialogRef,
    MatDialogConfig,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CalendarService } from '../../services/calendar.service';
@Component({
    selector: 'app-calendar-dialog',
    template: `
    <h4 class="m-t-0">Event action occurred</h4>
    <div>
    Action:
    <pre>{{ data?.action }}</pre>
    </div><br/>
    <div>
    Event:
    <pre>{{ data?.event | json }}</pre>
    </div><br/>
    <button mat-raised-button color="primary" (click)="dialogRef.close()">Close dialog</button>`
})
export class CalendarDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<CalendarDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
}

import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';

import { Subject } from 'rxjs/Subject';

import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent
} from 'angular-calendar';
declare var $: any;
const colors: any = {
    red: {
        primary: '#fc4b6c',
        secondary: '#f9e7eb'
    },
    blue: {
        primary: '#1e88e5',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#ffb22b',
        secondary: '#FDF1BA'
    }
};

@Component({
    selector: 'app-fullcalendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './fullcalendar.component.html',
    styleUrls: ['./fullcalendar.component.scss']
})
export class FullcalendarComponent implements OnInit {
    dialogRef: MatDialogRef<CalendarDialogComponent>;
    lastCloseResult: string;
    actionsAlignment: string;
    config: MatDialogConfig = {
        disableClose: false,
        width: '',
        height: '',
        position: {
            top: '',
            bottom: '',
            left: '',
            right: ''
        },
        data: {
            action: '',
            event: []
        }
    };
    numTemplateOpens = 0;

    view = 'month';

    viewDate: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    actions: CalendarEventAction[] = [
        {
            label: '<i class="ti-pencil act"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            }
        },
        {
            label: '<i class="ti-close act"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];

    refresh: Subject<any> = new Subject();
    events: CalendarEvent[]
    activeDayIsOpen = true;
    respData: any;
    service_days_array = [];
    propertyCode;
    constructor(public dialog: MatDialog, private service: CalendarService, private router: Router, @Inject(DOCUMENT) doc: any) {
        $('.page-title').text("Calendar");
        var url = window.location.href;
        this.propertyCode = url.split("/").pop();
        this.getAllResidents();
        this.events = [];
    }

    ngOnInit() {

    }
    getAllResidents() {
        var date = new Date();
        var serviceDate = new Date(date || new Date());
        this.respData = "";
        //get location all residents and meet and greets date and time
        this.service.getAllUsers({
            'user_type': 'resident',
            'property_code': this.propertyCode
        }).subscribe((data: any) => {
            console.log("meet wala data");

            this.respData = data;
            var service_day = this.respData.service_day;
            this.events = [];
            this.respData.forEach((element, index) => {
                var date = new Date();
                var meet_greet_date_time_resident = new Date(date || new Date());
                var currentDay = meet_greet_date_time_resident.getDay();
                if (element.meet_greet_status != null && element.meet_greet_status != "completed" && element.meet_greet_date_time != null && element.meet_greet_date_time != "Invalid Date" && element.meet_greet_date_time != "") {
                    var meetDay = new Date(element.meet_greet_date_time);
                    console.log(currentDay);
                    console.log(meetDay.getDay());
                    console.log(element);
                    if (meetDay.getDay() == currentDay) {
                        var service_day_json = {
                            start: startOfDay(meet_greet_date_time_resident),
                            title: element.first_name + ' ' + element.last_name + ' Meet And Greet Day.',
                            color: colors.yellow,
                            url: 'residents/' + element.user_id + '/view'
                        };
                    } else {
                        var service_day_json = {
                            start: startOfDay(meet_greet_date_time_resident.setDate(meet_greet_date_time_resident.getDate() + (element.meet_greet_date_time - 1 - meet_greet_date_time_resident.getDay() + 7) % 7 + 1)),
                            title: element.first_name + ' ' + element.last_name + ' Meet And Greet Day.',
                            color: colors.yellow,
                            url: 'residents/' + element.user_id + '/view'
                        };
                    }
                    this.events.push(service_day_json);
                }
            });

            //Get location service days and assign it to calendar
            this.service.getLocation({
                'property_code': this.propertyCode
            }).subscribe((resp: any) => {
                this.service_days_array = [];
                var service_days = resp.service_day;
                this.service_days_array = service_days.split(',');
                let property_name = resp.property_name;
                let property_code = resp.property_code;
                this.service_days_array.forEach(ele => {
                    var date = new Date();
                    var serviceDate = new Date(date || new Date());
                    var currentDay = serviceDate.getDay();
                    if (ele == currentDay) {
                        var service_day_json = {
                            start: startOfDay(serviceDate),
                            title: property_name + ' Service Day.',
                            color: colors.blue,
                            url: 'ticketlist/' + property_code + '/' + ele
                        }
                    } else {
                        var service_day_json = {
                            start: startOfDay(serviceDate.setDate(serviceDate.getDate() + (ele - 1 - serviceDate.getDay() + 7) % 7 + 1)),
                            title: property_name + ' Service Day.',
                            color: colors.blue,
                            url: 'ticketlist/' + property_code + '/' + ele
                        };
                    }
                    this.events.push(service_day_json);
                });
                $(".cal-cell").click();
            });
        });
    }


    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd
    }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.config.data = { event, action };
        if (this.config.data.event.color.primary == "#1e88e5") {
            var url = this.config.data.event.url.substr(0, this.config.data.event.url.lastIndexOf("/"));
        } else {
            var url = this.config.data.event.url;
        }
        var serviceDay = this.config.data.event.url.split("/").pop();
        localStorage.setItem('serviceDay', serviceDay);
        this.router.navigate(['/' + url]);
        // this.dialogRef = this.dialog.open(CalendarDialogComponent, this.config);

        // this.dialogRef.afterClosed().subscribe((result: string) => {
        // this.lastCloseResult = result;
        // this.dialogRef = null;
        // });
    }

    addEvent(): void {
        this.events.push({
            title: 'New event',
            start: startOfDay(new Date()),
            end: endOfDay(new Date()),
            color: colors.red,
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        });
        this.refresh.next();
    }
}
