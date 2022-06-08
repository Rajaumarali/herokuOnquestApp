import { Routes } from '@angular/router';
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";
import { TodayListingComponent } from './components/listings/listings.component';

export const TodayTasksRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: TodayListingComponent,
        data: {
          title: "Today's Tasks",
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: "Today's Tasks"}
          ]
        }
      },
      {
        path: ':id/view',
        component: TodayListingComponent,
        data: {
          title: 'View Captain',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: "Today's Tasks", url: '/todaytasks'},
            {title: 'View Task'}
          ]
        }
      }
    ]
  }
];
