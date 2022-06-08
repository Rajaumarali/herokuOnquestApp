import { Routes } from '@angular/router';

import {ResidenteditComponent} from "./components/edit/residentedit.component";
import {ResidentlistingComponent} from "./components/listings/residentlisting.component";
import {ResidentviewComponent} from "./components/view/residentview.component";
import {BasicTableComponent} from "../tables/basic-table/basic-table.component";
import {ResidentcreateComponent} from "./components/create/residentcreate.component";
import {MessageLogsComponent} from './components/messageLogs/messageLogs.component';

export const ResidentRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ResidentlistingComponent,
        data: {
          title: 'Resident',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Residents'}
          ]
        }
      },
      {
        path: ':id/edit',
        component: ResidenteditComponent,
        data: {
          title: 'Edit Resident',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Residents', url: '/residents'},
            {title: 'Edit Resident'}
          ]
        }
      },
      {
        path: ':id/view',
        component: ResidentviewComponent,
        data: {
          title: 'View Resident Profiles',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Residents', url: '/residents'},
            {title: 'View Resident'}
          ]
        }
      }
      ,
      {
        path: 'create',
        component: ResidentcreateComponent,
        data: {
          title: 'Create Resident',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Residents', url: '/residents'},
            {title: 'Create Resident'}
          ]
        }
      },
      {
        path: ':id/messageLogs',
        component: MessageLogsComponent,
        data: {
          title: 'View Message Logs',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'All Residents', url: '/residents'},
            {title: 'View Message Logs'}
          ]
        }
      }
    ]
  }
];
