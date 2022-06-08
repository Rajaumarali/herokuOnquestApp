import { Routes } from '@angular/router';
import {CalendarDialogComponent} from "./components/calendar/fullcalendar.component";
import { FullcalendarComponent } from './components/calendar/fullcalendar.component';
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";

export const CalendarRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: FullcalendarComponent,
        data: {
          title: 'Calendar',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Calendar'}
          ]
        }
      }
    ]
  }
];
