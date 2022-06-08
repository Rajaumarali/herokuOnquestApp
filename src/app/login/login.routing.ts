import { Routes } from '@angular/router';

import {BasicTableComponent} from "../tables/basic-table/basic-table.component";
import {LoginComponent} from "./components/login/login.component";
import {ForgotComponent} from './components/forgot/forgot.component';
import {UpdatePassword} from './components/updatePassword/updatePassword';

export const LoginRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: LoginComponent,
        data: {
          title: 'Login',
  /*        urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Resident'}
          ]*/
        }
      },
      {
        path: 'forgot',
        component: ForgotComponent,
        data: {
          title: 'Forgot Password',
          /*        urls: [
                    {title: 'Home', url: '/dashboard'},
                    {title: 'Resident'}
                  ]*/
        }
      },
      {
        path: 'update/:id',
        component: UpdatePassword,
        data: {
          title: 'Change Password',
          /*        urls: [
                    {title: 'Home', url: '/dashboard'},
                    {title: 'Resident'}
                  ]*/
        }
      }
    ]
  }
];
