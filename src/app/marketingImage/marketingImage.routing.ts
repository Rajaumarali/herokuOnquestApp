import { Routes } from '@angular/router';

import {ImgeditComponent} from "./components/imgedit/imgedit.component";
import {ImglistingComponent} from "./components/imglisting/imglisting.component";
import {ImgCreateComponent} from './components/imgCreate/imgCreate.component';

export const MarkrtingImageRouter: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ImglistingComponent,
        data: {
          title: 'Marketing Images',
          urls: [
            {title: 'Home', url: '/marketingImage'},
            {title: 'Marketing Images'}
          ]
        }
      },
      {
        path: ':id/edit',
        component: ImgeditComponent,
        data: {
          title: 'Edit Images',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Marketing Images', url: '/marketingImage'},
            {title: 'Edit Images'}
          ]
        }
      },
      {
        path: 'create',
        component: ImgCreateComponent,
        data: {
          title: 'Add new images',
          urls: [
            {title: 'Home', url: '/dashboard'},
            {title: 'Marketing Images', url: '/marketingImage'},
            {title: 'Add New Images'}
          ]
        }
      }
    ]
  }
];
