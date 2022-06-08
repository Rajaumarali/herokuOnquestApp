import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { ActivatedRoute } from "@angular/router";
import{ PropertyService } from '../services/property.service';
import {Router} from '@angular/router';

import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexTooltip,
    ApexGrid,
    ApexNonAxisChartSeries,
    ApexResponsive
} from 'ng-apexcharts';
import { MatDialog } from '@angular/material/dialog';
import { DeletepopupComponent } from '../../common/component/deletepopup.component';
import { MatSort } from '@angular/material/sort';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    grid: ApexGrid;
};

export type VisitorChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    tooltip: ApexTooltip;
    legend: ApexLegend;
    colors: string[];
    stroke: any;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
};

declare var require: any;

const data: any = require('./data.json');

export interface Chart {
    type: ChartType;
    data: Chartist.IChartistData;
    options?: any;
    responsiveOptions?: any;
    events?: ChartEvent;
}

export interface Element {
    name: string;
    pic: string;
    email: string;
    designation: string;
}

@Component({
    selector: 'app-dashboard2',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements AfterViewInit {

    totalResident=0;
    newResidents:any;
    newResidentsArray:any;
    allResidents:any;
    allTasks:any;
    totalTasks:any;
    newTasks=0;
    todayTasks=0;
    outStandingTasks=0;
    propertyCode:any;
    captains=[];
    dataSource;
    locationName;
    locationManagementCompanayName;
    locationAddress;
    locationPropertyCode;
    locationsServiceDay;
    className='asd';
    todaysServicesListing:any;
    outStandingServicesArray:any;
    lastWeekServices:any;
    testVari:any="Hello";
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    serviceDay:any;
    userType;
    allMeetGreet=[];
    totalMeetGreet=0;
    displayedColumns = ['name', 'email', 'designation' , 'action'];
    @ViewChild('chart') chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;
    @ViewChild('visitor-chart') chart2: ChartComponent;
    public VisitorChartOptions: Partial<VisitorChartOptions>;

    // Barchart
    barChart1: Chart = {
        type: 'Bar',
        data: data['Bar'],
        options: {
            seriesBarDistance: 15,
            high: 12,
            height: 325,
            axisX: {
                showGrid: false,
                offset: 20
            },
            axisY: {
                showGrid: true,
                offset: 40
            }
        },
        responsiveOptions: [
            [
                'screen and (min-width: 640px)',
                {
                    axisX: {
                        labelInterpolationFnc: function (
                            value: number,
                            index: number
                        ): string {
                            return index % 1 === 0 ? `${value}` : null;
                        }
                    }
                }
            ]
        ]
    };

    // This is for the comments
    mycomments: Object[] = [
        {
            name: 'James Anderson',
            content:
                'Lorem Ipsum is simply dummy text of the printing and type setting industry.',
            profile: 'assets/images/users/1.jpg',
            status: 'Pending',
            class: 'info',
            date: 'April 14, 2016'
        },
        {
            name: 'Michael Jorden',
            content:
                'Lorem Ipsum is simply dummy text of the printing and type setting industry.',
            profile: 'assets/images/users/2.jpg',
            status: 'Approved',
            class: 'light-success',
            date: 'April 14, 2016'
        },
        {
            name: 'James Anderson',
            content:
                'Lorem Ipsum is simply dummy text of the printing and type setting industry.',
            profile: 'assets/images/users/3.jpg',
            status: 'Pending',
            class: 'danger',
            date: 'April 14, 2016'
        },
        {
            name: 'Johnathan Doeting',
            content:
                'Lorem Ipsum is simply dummy text of the printing and type setting industry.',
            profile: 'assets/images/users/1.jpg',
            status: 'Pending',
            class: 'info',
            date: 'April 14, 2016'
        }
    ];

    // This is for Mymessages
    mymessages: Object[] = [
        {
            useravatar: 'assets/images/users/1.jpg',
            status: 'online',
            from: 'Pavan kumar',
            subject: 'Just see the my admin!',
            time: '9:30 AM'
        },
        {
            useravatar: 'assets/images/users/2.jpg',
            status: 'busy',
            from: 'Sonu Nigam',
            subject: 'I have sung a song! See you at',
            time: '9:10 AM'
        },
        {
            useravatar: 'assets/images/users/3.jpg',
            status: 'away',
            from: 'Arijit Sinh',
            subject: 'I am a singer!',
            time: '9:08 AM'
        },
        {
            useravatar: 'assets/images/users/4.jpg',
            status: 'busy',
            from: 'Sonu Nigam',
            subject: 'I have sung a song! See you at',
            time: '9:10 AM'
        },
        {
            useravatar: 'assets/images/users/6.jpg',
            status: 'away',
            from: 'Arijit Sinh',
            subject: 'I am a singer!',
            time: '9:08 AM'
        },
        {
            useravatar: 'assets/images/users/7.jpg',
            status: 'busy',
            from: 'Sonu Nigam',
            subject: 'I have sung a song! See you at',
            time: '9:10 AM'
        },
        {
            useravatar: 'assets/images/users/8.jpg',
            status: 'away',
            from: 'Arijit Sinh',
            subject: 'I am a singer!',
            time: '9:08 AM'
        }
    ];
    // bar chart
    public barChartData: Array<any> = [
        { data: [1.1, 1.4, 1.1, 0.9, 1.9, 1, 0.3, 1.1, 1.4, 1.1, 0.9, 1.9, 1, 0.3, 1.1], label: 'Cost' }
    ];
    public barChartLabels: Array<any> = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15'
    ];
    public barChartOptions: any = {
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        scales: {
            xAxes: [{
                display: false,
                datasets: [{
                    barPercentage: 0.3,
                    categoryPercentage: 0.7
                }]
            }],
            yAxes: [{
                display: false
            }]
        }
    };
    public barChartColors: Array<any> = [
        {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.5)',
            hoverBorderWidth: 2,
            hoverBorderColor: 'rgba(255, 255, 255, 0.5)'
        }
    ];
    public barChartLegend = false;
    public barChartType = 'bar';

    // This is for the table responsive
    constructor(public dialog: MatDialog,private breakpointObserver: BreakpointObserver, private service: PropertyService, private router: Router) {
        if(localStorage.getItem('serviceDay') != ""){
            localStorage.removeItem('serviceDay');
        }
        this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
        var url = window.location.href;
        this.propertyCode = url.split("/").pop();
        this.getResidentsByPropertyCode(this.propertyCode);
        this.getCaptainsByPropertyCode(this.propertyCode);
        this.getLocationByPropertyCode(this.propertyCode);
        this.getMeetGreet(this.propertyCode);
        breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
            if (this.userType == '5' || this.userType == '4' ){
                this.displayedColumns = result.matches ?
                    ['first_name', 'email', 'phone','action'] :
                    ['first_name', 'email', 'phone','action'];
            }else{
                this.displayedColumns = result.matches ?
                    ['first_name', 'email', 'phone'] :
                    ['first_name', 'email', 'phone'];
            }

        });

        this.VisitorChartOptions = {
            series: [45, 15, 27, 18],
            chart: {
                type: 'donut',
                height: 230
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '80px'
                    }
                }
            },
            tooltip: {
                fillSeriesColor: false,
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 0
            },
            legend: {
                show: false,
            },
            labels: ['Mobile', 'Tablet', 'Desktop', 'Other'],
            colors: ['#1e88e5', '#26c6da', '#745af2', '#eceff1'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        }
                    }
                }
            ]
        };

        this.chartOptions = {
            series: [
                {
                    name: 'Ample',
                    data: [9, 4, 11, 7, 10, 12]
                },
                {
                    name: 'Pixel',
                    data: [3, 2, 9, 5, 8, 10]
                }
            ],
            chart: {
                type: 'bar',
                height: 320
            },
            grid: {
                borderColor: 'rgba(0,0,0,.2)',
                strokeDashArray: 3,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '40%',
                    endingShape: 'flat'
                },

            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: [
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct'
                ]
            },

            legend: {
                show: false,
            },
            fill: {
                colors: ['#26c6da', '#1e88e5'],
                opacity: 1
            },
            tooltip: {
                fillSeriesColor: false,
            }
        };

        var setCalClick = setInterval(()=> {
            if($("mat-toolbar-row span.cursor-p").length > 0){
                $("mat-toolbar-row span.cursor-p").on('click',()=> {
                    this.subTabs('calendar');
                })
                clearInterval(setCalClick);
            }
        },1000);
    }

    // tslint:disable-next-line:member-ordering

    // tslint:disable-next-line:member-ordering
    //dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
    // tslint:disable-next-line:member-ordering
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    /**
     * Get residents based upon location through request.
     * @param propertyCode property code .
     */
    getResidentsByPropertyCode(propertyCode){
        var data = {
            "user_type":"resident",    // should be captain or resident
            "property_code": propertyCode
        }
        this.totalResident = 0;
        this.newResidents= 0;
        this.allResidents= 0;
        let endDate = new Date();
        let startDate = new Date(<any>endDate - 1000 * 60 * 60 * 24 * 10);  
        this.service.getAllResidents(data).subscribe((response: any) => {
            this.allResidents = response.map(item => {
                let it = {...item,user_profile_service_day: item.user_profile_service_day == '1' ? 'Monday' : item.user_profile_service_day == '2' ? 'Tuesday' : item.user_profile_service_day == '3' ? 'Wednesday' : item.user_profile_service_day == '4' ? 'Thursday' : item.user_profile_service_day == '5' ? 'Friday' : item.user_profile_service_day == '6' ? 'Saturday' : item.user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' }
                  return it;
              });
            this.totalResident = this.allResidents.length;
            let filteredArray = this.allResidents.filter((user) => {
              let date = new Date(user.created_at);
              return date >= startDate &&  date <= endDate
            });
            this.newResidents = filteredArray.length;
            this.newResidentsArray = filteredArray;
    
          });
    }

    getMeetGreet(propCode){
        var body = {user_type: "resident", property_code: propCode};
        this.service.getAllResidents(body).subscribe(res=> {
            console.log("res");
            console.log(res);
            this.allMeetGreet = res;
            this.totalMeetGreet = res.filter(item=> item.meet_greet_status != 'true'&&item.meet_greet_status != 'completed').length;
        })
    }
    getPhone = function(phone){
        if(phone!=null){
            phone = phone.replace("+1","");
            phone = phone.replace("+92","");
            return phone.replace(/^(\d{3})(\d{3})/, "$1-$2-");
            }
            return "N/A";
    };
    openAllCaptain(){
        this.router.navigate(['/captains']);

    }
    /**
     * Get all services based upon location through request.
     * @param propertyCode property code .
     */
    getAllServicesByPropertyCode(propertyCode){
        var data = {
            "property_code": propertyCode,"captainId":"","service_day":""
        }
        this.allTasks = 0;
        this.totalTasks = 0;
        this.newTasks = 0;
        this.todayTasks = 0;
        this.outStandingTasks = 0;
        let endDate = new Date();
        let startDate = new Date(<any>endDate - 1000 * 60 * 60 * 24 * 10);  
        this.service.getAllServices(data).subscribe((response: any) => {
            this.allTasks = response;
            this.totalTasks = this.allTasks.length;
        let today = new Date();
        let todaystart = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' 00:00:00');
        let todayend = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' 23:59:59');
          const bakingServices = [];
          let index = 0;
          const servicesObject = response;
          for (let i = 0; i < servicesObject.length; i++) {
            const services = servicesObject[i];
            for (let j = 0; j < services.length; j++) {
            let captain = this.captains.find(itec => itec.user_id == services[j].assigned_captain_id)
            bakingServices[index] = { ...services[j], responsible_party:services[j].responsible_party?services[j].responsible_party:'', status: services[j].service_enable != 'true' ? "Cancelled" : services[j].service_completed == 'true' ? 'Completed' : 'Not Completed', captain: captain ? captain.first_name + ' ' + captain.last_name : '', resident: services[j].first_name + " " + services[j].last_name, user_profile_service_day: services[j].user_profile_service_day == '1' ? 'Monday' : services[j].user_profile_service_day == '2' ? 'Tuesday' : services[j].user_profile_service_day == '3' ? 'Wednesday' : services[j].user_profile_service_day == '4' ? 'Thursday' : services[j].user_profile_service_day == '5' ? 'Friday' : services[j].user_profile_service_day == '6' ? 'Saturday' : services[j].user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' };
              index++;
            }
          }
          let filteredArray = bakingServices.filter((user) => {
            let date = new Date(user.created_at);
            return date >= startDate &&  date <= endDate 
          });
          this.newTasks = filteredArray.length;
          this.lastWeekServices = filteredArray;

          let todaysServices = bakingServices.filter((service) => {
            let date = new Date(service.created_at);
            return date >= todaystart && date <= todayend 
          });
          this.todayTasks = todaysServices.length;
          this.todaysServicesListing = todaysServices;
          let outStandingServices = bakingServices.filter((service) => {
            return service.service_completed == "false" && service.service_enable == "true";
          });
           this.outStandingTasks = outStandingServices.length;
           this.outStandingServicesArray =  outStandingServices;

          });
    }

    /**
     * Get location based upon captains code through request.
     * @param propertyCode property code .
     */
    getCaptainsByPropertyCode(propertyCode){
        this.captains = [];
        var data = {
            "user_type":"captain",    // should be captain or resident
            "property_code": propertyCode
        }
        this.service.getAllResidents(data).subscribe((response: any) => {
            this.captains = response.filter(item => item.user_type_id==2);
            localStorage.setItem('allCaptains',JSON.stringify(this.captains))
            if(this.captains[0])
            this.className = "height";
            else
            this.className = "noHeight";
            this.dataSource = new MatTableDataSource<any>(this.captains);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        this.getAllServicesByPropertyCode(this.propertyCode);
            
        },err=>{
              this.className = "noHeight";
              this.dataSource = new MatTableDataSource<any>(this.captains);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          });
    }

    /**
     * Set residents in localstorage and redirect it to specific listing page.
     */
    newResidentsListing(){
        this.newResidentsArray.forEach(element => {
            element.service_day = this.locationsServiceDay;
            element.property_name = this.locationName;
        });
        //this.newResidentsArray[0].service_day = this.serviceDay;
        //this.newResidentsArray[0].property_name = this.locationName;
        localStorage.setItem('residentListing', JSON.stringify(this.newResidentsArray));
      localStorage.setItem('screenName',this.locationName);

        this.router.navigate(['/residents/listings',]);
    }

    /**
     * Set residents in localstorage and redirect it to specific listing page.
     */
    allResidentsListing(){
        this.allResidents.forEach(element => {
            element.service_day = this.locationsServiceDay;
            element.property_name = this.locationName;
        });
        //this.newResidentsArray[0].service_day = this.serviceDay;
        //this.newResidentsArray[0].property_name = this.locationName;
        console.log(this.locationName);
        
        localStorage.setItem('residentListing', JSON.stringify(this.allResidents));
        localStorage.setItem('screenName', this.locationName);

        this.router.navigate(['/residentAllProperty',]);
    }

    /**
     * Get location based upon property code through request.
     * @param propertyCode property code .
     */
    getLocationByPropertyCode(propertyCode){
        this.serviceDay = [];
        this.service.getLocation(propertyCode).subscribe((location: any) => {
            this.locationName = location.property_name;
            this.locationManagementCompanayName = location.management_company;
            this.locationAddress = location.address_city;
            this.locationPropertyCode = location.property_code;
            this.locationsServiceDay = location.service_day;
            let service_days_array = location.service_day.split(',');
            $(".page-title").text(this.locationName);

            service_days_array.forEach(element => {
                this.serviceDay.push(this.days[element - 1]);
            });
          });
    }
    

    lastWeekTasksListing(){
        localStorage.setItem('tasksListing', JSON.stringify(this.lastWeekServices));
      localStorage.setItem('screenName',this.locationName);
      this.router.navigate(['/tasks/listings',]);
    }

    todayTasksListing(){
        localStorage.setItem('tasksListing', JSON.stringify(this.todaysServicesListing));
      localStorage.setItem('screenName',this.locationName);
      this.router.navigate(['/todaytask',]);
    }

    outstandingTasksListing(){
        localStorage.setItem('tasksListing', JSON.stringify(this.outStandingServicesArray));
      localStorage.setItem('screenName',this.locationName);
      this.router.navigate(['/outstanding/tasks',]);
    }

    editProperty(propertyCode){
        this.router.navigate(['/properties/' + propertyCode + '/edit']);
    }

    serviceDayCalendar(){
        this.router.navigate(['/calendar/'+ this.locationPropertyCode ]);
    }

    editCaptain(userId) {
        this.router.navigate(['/captains/' + userId + '/edit']);
    }
    captainDetail(userId) {
        this.router.navigate(['/captains/' + userId + '/view']);
    }
    ngAfterViewInit() {
    }
    subTabs(tabs) {
        this.router.navigate(['/' + tabs + '/' + this.propertyCode ]);
    }
    detailCaptain(uerId) {
        this.router.navigate(['/captains/' + uerId + '/view']);
      }
    openMeetGreet(){
        // localStorage.setItem('allMeetGreet', JSON.stringify(this.allMeetGreet));
      localStorage.setItem('screenName',this.locationName);
      this.router.navigate(['/meetgreet/listings/'+ this.propertyCode ]);
    }

    openDialog(id): void {
        const dialogRef = this.dialog.open(DeletepopupComponent, {
            width: '400px',
            data: {id:  id, service: this.service, showConfirmField: true}
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getCaptainsByPropertyCode(this.propertyCode);
            
        });
    }
}
