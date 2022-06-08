import { Routes } from '@angular/router';

import {EditComponent} from "./components/edit/edit.component";
import { ChangePassword } from './components/changepassword/changepassword.component';

export const CaptainsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: EditComponent,
        data: {
          title: 'My Profile',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'My Account', url: '/dashboard'},
            {title: 'My Profile'}
          ]
        }
      },
      {
        path: 'changepassword',
        // pathMatch: 'changepassword',
        component: ChangePassword,
        data: {
          title: 'Change Password',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'My Account', url: '/dashboard'},
            {title: 'Change Password'}
          ]
        }
      }
    ]
  }
];
