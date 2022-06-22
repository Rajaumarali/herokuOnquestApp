import {
    ChangeDetectorRef,
    Component,
    NgZone,
    OnDestroy,
    ViewChild,
    HostListener,
    Directive,
    AfterViewInit,
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';


import { MenuItems } from '../../../shared/menu-items/menu-items';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { Router } from '@angular/router';
import { config } from '../../../config';
import { LogoutpopupComponent } from '../../../common/component/logoutpopup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: []
})
export class AppSidebarComponent implements OnDestroy {
    public config: PerfectScrollbarConfigInterface = {};
    mobileQuery: MediaQueryList;
    
    private _mobileQueryListener: () => void;
    status: boolean = true;

    itemSelect: number[] = []
    parentIndex: Number;
    childIndex: Number;
    menuItemsData: any;
    propertyItems:any;
    userData:any;
    private urls =  {
        'get_all_locations': `${config.apiUrl}/location/getall`,
    };
   
    setClickedRow(i, j) {
        this.parentIndex = i;
        this.childIndex = j;
    }
    subclickEvent() {
        this.status = true;
    }
    scrollToTop() {
        document.querySelector('.page-wrapper').scroll({
            top: 0,
            left: 0
        });
    }

    constructor(
        private httpClient: HttpClient,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        public menuItems: MenuItems,
        public dialog: MatDialog,
        public router: Router
       
    ) {
        this.mobileQuery = media.matchMedia('(min-width: 768px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.sideNavProperties();
        this.menuItemsData = this.menuItems.getMenuitem();
        this.userData = JSON.parse(localStorage.getItem('user'));
        
    }
    ngOnInit(){
       
    }
    reload(href){
        console.log(href);
        // if(href=="dashboard")
        // setTimeout(() => {
        //     window.location.reload();
        //  }, 500);
    }
    sideNavProperties(){
        var userType = JSON.parse(localStorage.getItem("user")).user_type_id;

        this.httpClient.get(this.urls.get_all_locations).subscribe(
            (res) => {
                var arr : any;
                arr = res;
                if(userType=="3"){
                    var building = JSON.parse(localStorage.getItem("user")).building_id;
                    var findProp = arr.response.filter(item=> item.property_code==building);
                    if(findProp)
                    this.propertyItems = findProp;
                }else if(userType=='6'){
                    let region = JSON.parse(localStorage.getItem("user")).user_region;
                    this.propertyItems = arr.response.filter(item => item.region == region);
                }else
                this.propertyItems = arr.response;
                this.propertyItems.forEach(element => {
                    element.type = 'subchild';
                    /*element.subchildren = [{
                    property_code: element.property_code,
                    state: 'calendar',
                    name: 'Calendar',
                    type: '',
                    icon: '',},
                  /!*  {
                    property_code: element.property_code,
                    state: 'chat',
                    name: 'Chat',
                    type: '',
                    icon: '',},*!/
                    {
                    property_code: element.property_code,
                    state: 'taskboard',
                    name: 'Taskboard',
                    type: '',
                    icon: '',},
                    {
                    property_code: element.property_code,
                    state: 'ticketlist',
                    name: 'Ticket List',
                    type: '',
                    icon: '',}]*/
                    
                });
                this.menuItemsData[1].children = this.propertyItems;
              },
            (err: HttpErrorResponse) => {
              if (err.error instanceof Error) {
              } else {
                if ( err.error &&  err.error.text) {
                  return;
                }
              }
            }
          );
    }

    navigate(state, property_code){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['property',property_code]);
        });
    }
    
    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    logout(){
        const dialogRef = this.dialog.open(LogoutpopupComponent, {
            width: '400px',
            data: {router: this.router}
        });

        dialogRef.afterClosed().subscribe(result => {
            
        });
        
      }
    userProfile(){
        this.router.navigate(['/profile']);
    }
    changePassword(){
        this.router.navigate(['/profile/changepassword']);
    }
    open(name){
        if(name=="Property"){
            this.router.navigate(['/properties']);
        }
    }
}
