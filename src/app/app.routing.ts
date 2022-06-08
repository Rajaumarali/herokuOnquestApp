import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { ComingsoonComponent } from "./comingsoon/comingsoon.component";
import {LoginComponent} from "./login/components/login/login.component";
import {AppBlankComponent} from "./layouts/blank/blank.component";

export const AppRoutes: Routes = [
    {
        path: '',
        component: FullComponent,
        children: [
            {
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full'
            },
            {
                path: 'material',
                loadChildren: () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
            },
            {
                path: 'starter',
                loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule)
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
            },
            {
                path: 'property',
                loadChildren: () => import('./properties/property.module').then(m => m.PropertyModule)
            },
            {
                path: 'properties',
                loadChildren: () => import('./property-listings/propertyListing.module').then(m => m.PropertyListingModule)
            },
            {
                path: 'residents',
                loadChildren: () => import('./resident/residents.module').then(m => m.ResidentsModule)
            },
            {
                path: 'users',
                loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
            },
            {
                path: 'outstanding/tasks',
                loadChildren: () => import('./outstanding-tasks/tasks.module').then(m => m.TasksOutModule)
            },
            {
                path: 'residents/listings',
                loadChildren: () => import('./resident-listings/residentlisting.module').then(m => m.ResidentListingModule)
            },
            {
                path: 'residentAllProperty',
                loadChildren: () => import('./residentAllProperty/residentlisting.module').then(m => m.ResidentAllPropertyListingModule)
            },
            {
                path: 'captains',
                loadChildren: () => import('./captains/captains.module').then(m => m.CaptainsModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
            },
            {
                path: 'services',
                loadChildren: () => import('./services/services.module').then(m => m.ServicesModule)
            },
            {
                path: 'restrictedservices',
                loadChildren: () => import('./restrictedservices/restrictedservices.module').then(m => m.RestrictedservicesModule)
            },
            {
                path: 'tasks',
                loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule)
            },
            {
                path: 'todaytask',
                loadChildren: () => import('./todaytask/todaytask.module').then(m => m.TodayTasksModule)
            },
            {
                path: 'tasks/listings',
                loadChildren: () => import('./tasks-listing/taskslisting.module').then(m => m.TasksListingModule)
            },
            {
                path: 'reports',
                loadChildren: () => import('./reports/report.module').then(m => m.ReportModule)
            },
            {
                path: 'marketingImage',
                loadChildren: () => import('./marketingImage/marketingImage.module').then(m => m.MarketingImageModule)
            },
            {
                path: 'meetgreet/listings/:code',
                loadChildren: () => import('./meetgreet/meetgreet.module').then(m => m.MeetGreetModule)
            },
            {
                path: 'taskStatus',
                loadChildren: () => import('./taskStatus/taskStatus.module').then(m => m.TasksStatusModule)
            },


            {
              path: 'calendar/:code',
                loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarsModule)
            },
            {
              path: 'chat/:code',
              component: ComingsoonComponent,
              //loadChildren: () => import('./comingsoon/comingsoon.component').then(m => m.ComingsoonComponent)
            },
            {
              path: 'taskboard/:code',
              //component: ComingsoonComponent,
              loadChildren: () => import('./taskboard/taskboard.module').then(m => m.TasksBoardModule)
            },
            {
              path: 'ticketlist/:code',
              loadChildren: () => import('./ticket-list/ticketListing.module').then(m => m.TicketListingModule)
            },
          {
            path: 'tables',
            loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
          }

        ]
    },
    {
        path: '',
        component: AppBlankComponent,
        children: [
            {
                path: 'login',
                loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
            }
        ]
    }

];
