import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { Router } from '@angular/router';
import { MatSort } from "@angular/material/sort";
import * as jsPDF from 'jspdf';

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
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { DashboardService } from "../services/dashboard.service";

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

export type newsletterchartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: any;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    colors: string[];
    markers: any;
    grid: ApexGrid;
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


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard1.component.html',
    styleUrls: ['./dashboard1.component.scss']
})
export class Dashboard1Component implements OnInit {
    // Barchart
    @ViewChild('chart') chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    @ViewChild('visitor-chart') chart2: ChartComponent;
    public VisitorChartOptions: Partial<VisitorChartOptions>;

    @ViewChild('newsletter-chart') chart3: ChartComponent;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    public newsletterchartOptions: Partial<newsletterchartOptions>;
    allResidentUsers = [];
    total_services: any;
    lastWeekServices: any;
    todaysServices;
    allConciergeUsers = [];
    allbuildings;
    displayedColumns = ['resident', 'service_name', 'first_name', 'property_name', 'service_completed'];
    years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    dataSource;
    year = new Date();

    newResidents: any;
    outStandingServices: any;
    totalResident: any;
    totalProperties: any;
    newResidentsArray: any;
    todaysServicesListing: any;
    outStandingServicesArray: any;
    userType;
    captains: any;
    monthsandroid = [];
    monthsios = [];
    ios = [];
    android = [];
    constructor(private dbService: DashboardService, private router: Router) {
        $(".apexcharts-toolbar").insertAfter('.download-content');
        var showOption = setInterval(() => {
            if ($(".exportPDF").length > 0) {
                
                
            } else {
                $("apx-chart").attr("style", "position:inherit;");
                $(".apexcharts-canvas").attr("style", "position:inherit;width:486px;height:340px;");
                $(".apexcharts-toolbar").attr("style", "top:25px !important;right: 25px !important");
                $(".apexcharts-menu.apexcharts-menu-open .exportSVG").remove();
                $(".apexcharts-menu.apexcharts-menu-open .exportPNG").remove();
                $(".apexcharts-menu.apexcharts-menu-open").append("<div class='apexcharts-menu-item exportPDF' title='Download PDF'>Download PDF</div>");
                $(".apexcharts-menu.apexcharts-menu-open").append("<div class='apexcharts-menu-item exportEXCEL' title='Download PDF'>Download XLS</div>");
                $(".apexcharts-menu").attr('style', 'min-width: max-content !important;text-align: left;');
                $(".exportPDF").on('click', () => {
                    this.getPDF();
                })
                $(".exportEXCEL").on('click', () => {
                    this.getExcel();
                })
            }
        }, 100);
        this.getAllProperties();
        this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
        $('.page-title').text('Home');

        if (this.userType == '5' || this.userType == '4') {
            this.dbService.getAllDownloads().subscribe((response: any) => {
                console.log("responseRes", response);
                let dateToday = new Date();
                response.map(item => {
                    if (item.os == 'android') {
                        var date = new Date(item.created_at);
                        if (date.getFullYear() == dateToday.getFullYear())
                            this.monthsandroid.push(date.getMonth());
                    }
                    else {
                        var date = new Date(item.created_at);
                        if (date.getFullYear() == dateToday.getFullYear())
                            this.monthsios.push(date.getMonth());
                    }
                });

                for (var i = 0; i < 12; i++) {
                    var findMonthsIOS = this.monthsios.filter(item => item == i);
                    var findMonthsAndroid = this.monthsandroid.filter(item => item == i);
                    this.ios.push(findMonthsIOS.length);
                    this.android.push(findMonthsAndroid.length);
                }
                console.log("ios", this.ios);
                console.log("and", this.android);

            });

            let date = new Date();
            setTimeout(() => {
                this.chartOptions = {
                    series: [
                        {
                            name: 'IOS',
                            data: this.ios
                        },
                        {
                            name: 'ANDROID',
                            data: this.android
                        }
                    ],
                    chart: {
                        type: 'bar',
                        height: 340
                    },
                    grid: {
                        borderColor: 'rgba(0,0,0,.2)',
                        strokeDashArray: 3,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '30%',
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
                            '1/' + date.getFullYear().toString().slice(2, 4),
                            '2/' + date.getFullYear().toString().slice(2, 4),
                            '3/' + date.getFullYear().toString().slice(2, 4),
                            '4/' + date.getFullYear().toString().slice(2, 4),
                            '5/' + date.getFullYear().toString().slice(2, 4),
                            '6/' + date.getFullYear().toString().slice(2, 4),
                            '7/' + date.getFullYear().toString().slice(2, 4),
                            '8/' + date.getFullYear().toString().slice(2, 4),
                            '9/' + date.getFullYear().toString().slice(2, 4),
                            '10/' + date.getFullYear().toString().slice(2, 4),
                            '11/' + date.getFullYear().toString().slice(2, 4),
                            '12/' + date.getFullYear().toString().slice(2, 4),
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
                        marker: {
                            show: false,
                        },
                    }
                };
            }, 1000);
        }
        this.VisitorChartOptions = {
            series: [45, 15, 27, 18],
            chart: {
                type: 'donut',
                height: 290
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
        this.newsletterchartOptions = {
            series: [
                {
                    name: 'Clicked',
                    data: [0, 5000, 15000, 8000, 15000, 9000, 30000, 0]
                },
                {
                    name: 'Sent',
                    data: [0, 3000, 5000, 2000, 8000, 1000, 5000, 0]
                }
            ],
            chart: {
                height: 290,
                type: 'area'
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 3,
            },
            stroke: {
                curve: 'smooth',
                width: '2'
            },
            colors: ['#26c6da', '#1e88e5'],
            legend: {
                show: false,
            },
            grid: {
                borderColor: 'rgba(0,0,0,.2)',
                strokeDashArray: 3,
                yaxis: {
                    lines: {
                        show: true
                    }
                },
                xaxis: {
                    lines: {
                        show: true
                    }
                },
            },
            xaxis: {
                type: 'category',
                categories: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8'
                ]
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                }
            }
        };
    }

    getAllTasks(){
        let today = new Date();
        let todaystart = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' 00:00:00')
        let todayend = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' 23:59:59')

        this.dbService.getAllLastWeekServices().subscribe((response: any) => {
            console.log("lastweek");
            console.log(response);

            const bakingServices = [];
            let index = 0;
            const servicesObject = response.response;
            for (let i = 0; i < servicesObject.length; i++) {
                const services = servicesObject[i];
                for (let j = 0; j < services.length; j++) {
                    if(services[j].service_name!="HOUSEKEEPING"){
                        let captain = this.captains.find(itec => itec.user_id == services[j].assigned_captain_id)
                        if (this.userType == '6' || this.userType == '3') {
                            let findMatch = this.allbuildings.find(item => item.property_code == services[j].building_id)
                            if (findMatch) {
                                bakingServices[index] = { ...services[j], responsible_party: services[j].responsible_party ? services[j].responsible_party : '', status: services[j].service_enable != 'true' ? "Cancelled" : services[j].service_completed == 'true' ? 'Completed' : 'Not Completed', captain: captain ? captain.first_name + ' ' + captain.last_name : '', resident: services[j].first_name + " " + services[j].last_name, user_profile_service_day: services[j].user_profile_service_day == '1' ? 'Monday' : services[j].user_profile_service_day == '2' ? 'Tuesday' : services[j].user_profile_service_day == '3' ? 'Wednesday' : services[j].user_profile_service_day == '4' ? 'Thursday' : services[j].user_profile_service_day == '5' ? 'Friday' : services[j].user_profile_service_day == '6' ? 'Saturday' : services[j].user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' };
                                index++;
                            }
                        } else {
                            bakingServices[index] = { ...services[j], responsible_party: services[j].responsible_party ? services[j].responsible_party : '', status: services[j].service_enable != 'true' ? "Cancelled" : services[j].service_completed == 'true' ? 'Completed' : 'Not Completed', captain: captain ? captain.first_name + ' ' + captain.last_name : '', resident: services[j].first_name + " " + services[j].last_name, user_profile_service_day: services[j].user_profile_service_day == '1' ? 'Monday' : services[j].user_profile_service_day == '2' ? 'Tuesday' : services[j].user_profile_service_day == '3' ? 'Wednesday' : services[j].user_profile_service_day == '4' ? 'Thursday' : services[j].user_profile_service_day == '5' ? 'Friday' : services[j].user_profile_service_day == '6' ? 'Saturday' : services[j].user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' };
                            index++;
                        }
                    }
                }
            }
            this.lastWeekServices = bakingServices;
            this.total_services = this.lastWeekServices.length;
            console.log(this.lastWeekServices);
            this.dataSource = new MatTableDataSource<any>(this.lastWeekServices);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            let todaysServices = bakingServices.filter((service) => {
                let date = new Date(service.created_at);

                return date >= todaystart && date <= todayend 
            });
            this.todaysServices = todaysServices.length;
            this.todaysServicesListing = todaysServices;
            let outStandingServices = bakingServices.filter((service) => {
                return service.service_completed == "false" && service.service_enable == "true";
            });
            this.outStandingServices = outStandingServices.length;
            this.outStandingServicesArray = outStandingServices;
        });
    }

    ngOnInit() {
        this.newResidents = 0;
        this.outStandingServices = 0;
        this.totalResident = 0;
        this.totalProperties = 0;
        this.total_services = 0;
        this.todaysServices = 0;
        let endDate = new Date();
        let startDate = new Date(<any>endDate - 1000 * 60 * 60 * 24 * 10);

        this.dbService.getAllResidentUsers().subscribe((response: any) => {

            if (this.userType == "3") {
                var building = JSON.parse(localStorage.getItem("user")).building_id;
                var findMatch = response.filter(item => item.building_id == building)
                response = findMatch;
            } else if (this.userType == '6') {
                var findAllResi = response.filter(item => {
                    var findMatchResi = this.allbuildings.find(itemProp => itemProp.property_code == item.building_id);
                    if (findMatchResi)
                        return item;
                })
                response = findAllResi;
            }
            this.allResidentUsers = response.map(item => {
                let it = {...item,user_profile_service_day: item.user_profile_service_day == '1' ? 'Monday' : item.user_profile_service_day == '2' ? 'Tuesday' : item.user_profile_service_day == '3' ? 'Wednesday' : item.user_profile_service_day == '4' ? 'Thursday' : item.user_profile_service_day == '5' ? 'Friday' : item.user_profile_service_day == '6' ? 'Saturday' : item.user_profile_service_day == '7' ? 'Sunday' : 'Not Assigned' }
                  return it;
              });
            this.totalResident = response.length;
            let filteredArray = this.allResidentUsers.filter((user) => {
                let date = new Date(user.created_at);
                return date >= startDate && date <= endDate
            });
            this.newResidents = filteredArray.length;
            this.newResidentsArray = filteredArray;

        });
        
        this.dbService.getAllConciergesusers().subscribe((response: any) => {
            console.log('allCaps');
            console.log(response);
            if (this.userType == '6') {

                var region = JSON.parse(localStorage.getItem("user")).user_region;
                console.log(this.allbuildings);

                var findAllResi = response.filter(item => {
                    var additionaBuild: any;
                    var findAddBuild = undefined;
                    if (item.additional_building !== null && item.additional_building !== "null") {
                        additionaBuild = item.additional_building.split(",");
                        findAddBuild = additionaBuild.find(ite => {
                            var findadd = this.allbuildings.find(it => it.property_code == ite);
                            if (findadd)
                                return ite;
                        })
                    }
                    console.log(findAddBuild);

                    var findMatchResi = this.allbuildings.find(itemProp => itemProp.property_code == item.property_code);
                    if (findMatchResi || findAddBuild)
                        return item;
                })
                console.log(findAllResi);

                response = findAllResi;

            }
            console.log(response);

            localStorage.setItem('allCaptains', JSON.stringify(response));
            let allConciergeUsers = response.filter((user) => {
                return user.user_type_id == "3";
            });
            this.allConciergeUsers = allConciergeUsers;
            // tslint:disable-next-line:member-ordering
            this.dataSource = new MatTableDataSource<any>(this.allConciergeUsers);
        });



    }

    openTasks() {

        this.router.navigate(['/tasks',]);

    }


    getPDF() {
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var fileName = 'downloadDevice';
        console.log(date);
        var base64Img = null;
        var margins = {
            top: 20,
            bottom: 60,
            left: 30,
            width: 900
        };
        // var pdf = new jsPDF('p', 'pt', 'a4');
        var pdf = new jsPDF('l', 'mm', "a1");
        pdf.setFontSize(8);
        var docId = "downloadsDeviceTable";
        var specialHand = {
            '#elementH': function (element, handler) {
                return true;
            }
        }
        pdf.fromHTML(document.getElementById(docId),
            margins.left, // x coord
            margins.top,
            {
                // y coord

                width: margins.width,// max width of content on PDF
                elementHandlers: specialHand
            }, function (dispose) {
                pdf.save(fileName + date + '.pdf');
                //     $(".apexcharts-menu.apexcharts-menu-open").append("<div class='apexcharts-menu-item exportPDF' title='Download PDF'>Download PDF</div>");
                // $(".exportPDF").on('click',()=>{
                //     this.getPDF();
                //     })
            },
        );
    }

    getExcel() {
        var finalExcel: any = [["Year", "IOS", "Android"]];
        var arr = [];
        let dateToday = new Date();
        for (var i = 0; i < 12; i++) {
            arr.push('\"' + i + '/' + dateToday.getFullYear().toString().slice(2, 4) + '\"', this.ios[i], this.android[i]);
            finalExcel.push(arr);
            arr = [];
        }
        var lineArray = [];
        finalExcel.forEach(function (infoArray, index) {
            var line = infoArray.join(" \t");
            lineArray.push(index == 0 ? line : line);
        });
        var today = new Date();
        var filename = "downloadDevices";
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var csvContent = lineArray.join("\r\n");
        var excel_file = document.createElement('a');
        excel_file.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csvContent));
        excel_file.setAttribute('download', filename + date + '.xls');
        document.body.appendChild(excel_file);
        excel_file.click();
        document.body.removeChild(excel_file);
    }

    getAllProperties() {
        this.dbService.getAllLocations().subscribe((response: any) => {
            var userType = JSON.parse(localStorage.getItem("user")).user_type_id;
            if (userType == '3') {
                var property_code = JSON.parse(localStorage.getItem("user")).building_id;
                var findProp = response.filter(item => item.property_code == property_code);
                if (findProp)
                    this.totalProperties = findProp.length;
                this.getAllCaptains();
            } else if (userType == '6') {
                let region = JSON.parse(localStorage.getItem("user")).user_region;
                var findProp = response.filter(item => item.region == region);
                if (findProp) {
                    this.totalProperties = findProp.length;
                    this.allbuildings = findProp;
                }
                this.getAllCaptains();
            } else
                this.totalProperties = response.length;
            this.getAllCaptains();
        });
    }
    // This is for the line chart
    // Line chart
    lineChart1: Chart = {
        type: 'Line',
        data: data['LineWithArea'],
        options: {
            low: 0,
            height: 360,
            high: 35000,
            showArea: true,
            fullWidth: true
        }
    };

    // Timeline
    mytimelines: any[] = [
        {
            from: 'Nirav joshi',
            time: '(5 minute ago)',
            image: 'assets/images/users/1.jpg',
            attachment: 'assets/images/big/img2.jpg',
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.'
        },
        {
            from: 'Sunil joshi',
            time: '(3 minute ago)',
            image: 'assets/images/users/2.jpg',
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.',
            buttons: 'primary'
        },
        {
            from: 'Vishal Bhatt',
            time: '(1 minute ago)',
            image: 'assets/images/users/3.jpg',
            attachment: 'assets/images/big/img1.jpg',
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.'
        },
        {
            from: 'Dhiren Adesara',
            time: '(1 minute ago)',
            image: 'assets/images/users/4.jpg',
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.',
            buttons: 'warn'
        }
    ];

    // bar chart
    public barChartData: Array<any> = [
        { data: [1.1, 1.4, 1.1, 0.9, 1.9, 1, 0.3, 1.1, 1.4, 1.1, 0.9, 1.9], label: 'Cost' }
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
        '12'
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


    newResidentsListing() {
        localStorage.setItem('residentListing', JSON.stringify(this.newResidentsArray));
        localStorage.setItem('screenName', "New Residents");

        // console.log(this.newResidentsArray);
        this.router.navigate(['/residents/listings',]);
    }

    lastWeekTasksListing() {
        localStorage.setItem('tasksListing', JSON.stringify(this.lastWeekServices));
        // console.log(this.lastWeekServices);
        localStorage.setItem('screenName', "Tasks This Week");
        this.router.navigate(['/tasks/listings',]);
    }

    todayTasksListing() {
        localStorage.setItem('tasksListing', JSON.stringify(this.todaysServicesListing));
        // console.log(this.todaysServicesListing);
        localStorage.setItem('screenName', "Today's Tasks");
        this.router.navigate(['/todaytask',]);
    }

    outstandingTasksListing() {
        localStorage.setItem('tasksListing', JSON.stringify(this.outStandingServicesArray));
        localStorage.setItem('screenName', "Outstanding Tasks");
        // console.log(this.outStandingServicesArray);
        this.router.navigate(['/outstanding/tasks',]);
    }



    propertiesListing() {
        //localStorage.setItem('tasksListing', JSON.stringify(this.outStandingServicesArray));
        this.router.navigate(['/properties',]);
    }

    editCaptain(userId) {
        this.router.navigate(['/captains/' + userId + '/edit']);
    }
    captainDetail(userId) {
        this.router.navigate(['/captains/' + userId + '/view']);
    }

    // tslint:disable-next-line:member-ordering


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

    }
    /**
     * Get location based upon captains code through request.
     */
    getAllCaptains() {
        this.dbService.getAllPropertyCaptains().subscribe((response: any) => {
            console.log("Capresponse");
            console.log(JSON.parse(localStorage.getItem("user")));
            console.log(response);

            if (this.userType == "3") {

                var building = JSON.parse(localStorage.getItem("user")).building_id;
                var propName = JSON.parse(localStorage.getItem("user")).property_name;
                var findMatch = response.filter(item => {
                    var additionaBuild: any;
                    var findAddBuild = undefined;
                    if (item.additional_building !== null && item.additional_building !== "null") {
                        additionaBuild = item.additional_building.split(",");
                        findAddBuild = additionaBuild.find(ite => ite == building)
                    }
                    if (item.property_name == propName || findAddBuild)
                        return item;

                })
                response = findMatch;

            } else if (this.userType == '6') {
                var region = JSON.parse(localStorage.getItem("user")).user_region;
                // var findAllProp = this.allbuildings.filter(item => item.region == region);
                console.log(this.allbuildings);
                console.log(region);

                var findAllResi = response.filter(item => {
                    var additionaBuild: any;
                    var findAddBuild = undefined;
                    if (item.additional_building !== null && item.additional_building !== "null") {
                        additionaBuild = item.additional_building.split(",");
                        findAddBuild = additionaBuild.find(ite => {
                            var findadd = this.allbuildings.find(it => it.property_code == ite);
                            if (findadd)
                                return ite;
                        })
                    }
                    console.log(findAddBuild);

                    var findMatchResi = this.allbuildings.find(itemProp => itemProp.property_code == item.property_code);
                    if (findMatchResi || findAddBuild)
                        return item;
                })
                console.log(findAllResi);

                response = findAllResi;
            }
            this.captains = response;
            this.getAllTasks();
        });
    }

    detail(element) {
        localStorage.setItem('task', JSON.stringify(element));
        this.router.navigate(['/tasks/' + 1 + '/view']);
    }

}
