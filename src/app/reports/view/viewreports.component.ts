import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportsService } from '../services/reports.service';
import * as jsPDF from 'jspdf';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserlistComponent } from '../../common/component/userList.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'app-reports',
    templateUrl: './viewreports.component.html',
    styleUrls: ['./viewreports.component.css']
})

export class ViewreportsComponent {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    allUsers = [];
    allBasicUsers = [];
    allResidents = [];
    allRegionalUsers = [];
    allCaptains = [];
    allRestrictedServices = [];
    services_enable = [];
    services = [];
    missingPayments = [];
    allPaymentHistoryArr = []
    reportId: any;
    loader = true;
    matchedSignupResident: any;
    downloadCSVArray: any;
    allUsageService = [];
    allDownloadsDetail = [];
    allPropertiesReport = [];
    allAdminUsers = [];
    matchedActiveResidents = [];
    matchedInActiveResidents = [];
    taskCompletionArr = [];
    inCompleteTasksArr = [];
    allBuildings = [];
    allCaptainList = [];
    allPropertySummary = [];
    downloadOption = 'PDF';
    dataSource;
    finalDetailArr = [];
    userType: any;
    selectedPropRegion = '';
    showActiveUsers = false;
    androidCount = 0;
    appleCount = 0;
    groceryCompletion = 0;
    packageCompletion = 0;
    onquestCompletion = 0;
    rxCompletion = 0;
    flowerCompletion = 0;
    allServicesFeature = [];
    laundrypickCompletion = 0;
    taskDetailsArr = [];
    laundrydropCompletion = 0;
    displayedColumns = ['id', 'first_name', 'property', 'unit_Number', 'service_day', 'email', 'phone', 'Action'];
    constructor(public dialog: MatDialog, private route: ActivatedRoute, private router: Router, private service: ReportsService, public breakpointObserver: BreakpointObserver) {
        $('.page-title').text('View Reports');
        this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
        this.reportId = this.route.snapshot.params.id;
        this.downloadOption = localStorage.getItem('downloadOption');
        this.selectedPropRegion = localStorage.getItem('region');
        breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
            if (this.reportId == 'app_downloads') {
                this.displayedColumns = result.matches ?
                    ['property_name', 'first_name', 'region', 'os', 'created_at'] :
                    ['property_name', 'first_name', 'region', 'os', 'created_at'];
            } else if (this.reportId == 'payment_histories') {
                this.displayedColumns = result.matches ?
                    ['first_name', 'service', 'amount', 'created_at'] :
                    ['first_name', 'service', 'amount', 'created_at'];
            } else if (this.reportId == 'residents') {
                this.displayedColumns = result.matches ?
                    ['first_name', 'email', 'property_name', 'service_day', 'captain', 'complete_services', 'incomplete_services', 'created_at'] :
                    ['first_name', 'email', 'property_name', 'service_day', 'captain', 'complete_services', 'incomplete_services', 'created_at'];
            } else if (this.reportId == 'new_signup') {
                this.displayedColumns = result.matches ?
                    ['resident_name', 'email', 'created_at', 'property_name', 'street_name', 'phone', 'city', 'state', 'service_day'] :
                    ['resident_name', 'email', 'created_at', 'property_name', 'street_name', 'phone', 'city', 'state', 'service_day'];
            } else if (this.reportId == 4) {
                this.displayedColumns = result.matches ?
                    ['service', 'count'] :
                    ['service', 'count'];
            } else if (this.reportId == 5) {
                this.displayedColumns = result.matches ?
                    ['service_name', 'name', 'status', 'unit_number'] :
                    ['service_name', 'name', 'status', 'unit_number'];
            } else if (this.reportId == 6) {
                this.displayedColumns = result.matches ?
                    ['name', 'phone', 'user_profile_service_day', 'unit_number', 'email', 'address'] :
                    ['name', 'phone', 'user_profile_service_day', 'unit_number', 'email', 'address'];
            } else {
                this.displayedColumns = result.matches ?
                    ['name', 'email', 'created_at', 'property_name', 'service_completed', 'phone', 'unit_number', 'service_name', 'user_profile_service_day'] :
                    ['name', 'email', 'created_at', 'property_name', 'service_completed', 'phone', 'unit_number', 'service_name', 'user_profile_service_day'];
            }

        });


        if (this.reportId == 'app_downloads') {
            this.getDownloads();
        }
        else if (this.reportId == 'new_signup') {
            this.getSignUpBaseResidents();
        } else if (this.reportId == 'properties') {
            this.service.allServices().subscribe((response: any) => {
                this.services = response;
                this.getAllProperties();
            });
        } else if (this.reportId == 'residents') {
            this.getAllResidents();
        } else if (this.reportId == 'feature_usage') {
            this.getBuildingTasks(this.reportId);
        } else if (this.reportId == 'task_completion') {
            this.taskCompletion();
        } else if (this.reportId == 'task_detail') {
            this.taskDetail();
        } else if (this.reportId == 'incomplete_tasks') {
            this.incompleteTasks();
        } else if (this.reportId == 'payment_histories') {
            this.getPaymentHistories();
        } else if (this.reportId == 'admin_users') {
            this.getAdminUsers();
        } else if (this.reportId == 'missing_payment_method') {
            this.getMissingPayments();
        } else if (this.reportId == 'captain_list') {
            let region = JSON.parse(localStorage.getItem('user')).user_region;
            this.service.getAllLocations().subscribe(response => {
                if (this.userType == '6')
                    response = response.filter(item => item.region == region);
                var selectedProperty = JSON.parse(localStorage.getItem('selectedProperty'));

                this.allBuildings = response.filter(item => selectedProperty.find(ite => ite == item.property_code));
                this.getCaptainList();
            })

        } else if (this.reportId == 'property_summary') {
            this.getPropertySummary();
        }
    }


    getPaymentHistories() {
        this.service.getPayments().subscribe(response => {
            var selectedResi = JSON.parse(localStorage.getItem('selectedResidents'));
            
            if(selectedResi[0])
            response = response.filter(item => selectedResi.find(ite => ite == item.user_id));
            response.map(item => {
                if (item.flower_delivery_total_amount != null)
                    this.allPaymentHistoryArr.push({ ...item, service: "Flower Delivery", created_at: item.flower_delivery_created_at });
                if (item.grocery_total_amount != null)
                    this.allPaymentHistoryArr.push({ ...item, service: "Grocery Shopping", created_at: item.grocery_created_at });
                if (item.rx_pickup_total_amount != null)
                    this.allPaymentHistoryArr.push({ ...item, service: "Rx Pick-Up", created_at: item.rx_pickup_created_at });
            });
            this.dataSource = new MatTableDataSource<any>(this.allPaymentHistoryArr);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.loader = false;
            if (this.downloadOption == "CSV") {
                const arr = [];
                this.allPaymentHistoryArr.map(item => {
                    arr.push({
                        Resident: item.first_name + ' ' + item.last_name,
                        Service: item.service,
                        Date_of_Payment: item.service == 'Flower Delivery' ? item.flower_delivery_created_at : item.service == 'Grocery Shopping' ? item.grocery_created_at : item.rx_pickup_created_at,
                        Total_Amount: item.service == 'Flower Delivery' ? item.flower_delivery_total_amount : item.service == 'Grocery Shopping' ? item.grocery_total_amount : item.service == 'Rx Pick-Up' ? item.rx_pickup_total_amount : 'N/A',
                    });
                });
                this.downloadCSVArray = arr;
            }
        })
    }

    getPropertySummary() {
        this.service.getAllLocations().subscribe(response => {
            let data = { "property_code": "", "captainId": "", "service_day": "" };

            this.service.getAllServices(data).subscribe(responseSer => {
                var endDateOld = new Date(localStorage.getItem('enddate'));
                endDateOld.setHours(0, 0, 0, 0);
                let endDate = Date.parse(endDateOld.toString());
                var startDateOld = new Date(localStorage.getItem('startdate'));
                startDateOld.setHours(0, 0, 0, 0);
                let startDate = Date.parse(startDateOld.toString());
                var selectedProp = JSON.parse(localStorage.getItem('selectedProperty'));
                this.service.getAllResidents().subscribe(resResi => {
                    var bakingServices = [];
                    let index = 0;
                    for (let i = 0; i < responseSer.length; i++) {
                        const services = responseSer[i];
                        for (let j = 0; j < services.length; j++) {

                            if (selectedProp.find(item => services[j].building_code == item) && services[j].service_completed == 'true') {
                                if (endDate && startDate){
                                    let createdDateOld = new Date(services[j].created_at);
                                    createdDateOld.setHours(0, 0, 0, 0);
                                    let createdDate = Date.parse(createdDateOld.toString());
                                    if (createdDate <= endDate && createdDate >= startDate)
                                    bakingServices.push({ ...services[j] });
                                }else
                                bakingServices.push({ ...services[j] });
                                index++;
                            }
                        }
                    }
                    selectedProp.map(item => {
                        let findProp = response.find(ite => ite.property_code == item);
                        let findResiAcc = resResi.filter(itemR => {
                            if (endDate && startDate){
                                let createdDateOld = new Date(itemR.created_at);
                                createdDateOld.setHours(0, 0, 0, 0);
                                let createdDate = Date.parse(createdDateOld.toString());
                                if (itemR.building_id == item && createdDate <= endDate && createdDate >= startDate)
                                return itemR;
                            }
                            else if(itemR.building_id == item)
                            return itemR;
                        });
                        let taskCom = bakingServices.filter(itemSer => itemSer.building_code == item);
                        this.allPropertySummary.push({ name: findProp.property_name, total_task: taskCom.length, total_acc: findResiAcc.length });
                    })
                    this.loader = false;
                    if (this.downloadOption == "CSV") {
                        const arr = [];
                        this.allPropertySummary.map(item => {
                            arr.push({
                                Property: item.name,
                                Total_Task_Completed: item.total_task,
                                Residents_With_Tasks_Completed: item.total_acc,
                            });
                        });
                        this.downloadCSVArray = arr;
                    }
                })
            })
        })
    }

    getMissingPayments() {
        this.service.getPayments().subscribe(response => {
            let allCaps = [];
            this.service.getAllCaptains().subscribe(resC => {
                allCaps = resC;
            })
            this.service.getAllResidents().subscribe(res => {
                res = res.filter(itemRes => {
                    let findMissing = response.find(itemResponse => itemResponse.user_id == itemRes.user_id);
                    if (findMissing) { }
                    else
                        return itemRes;
                });
                var selectedProp = JSON.parse(localStorage.getItem('selectedProperty'));
                res = res.filter(item => selectedProp.find(ite => ite == item.building_id));
                var endDateOld = new Date(localStorage.getItem('enddate'));
                endDateOld.setHours(0, 0, 0, 0);
                let endDate = Date.parse(endDateOld.toString());
                var startDateOld = new Date(localStorage.getItem('startdate'));
                startDateOld.setHours(0, 0, 0, 0);
                let startDate = Date.parse(startDateOld.toString());

                if (endDate && startDate) {

                    res = res.filter(item => {

                        let createdDateOld = new Date(item.created_at);
                        createdDateOld.setHours(0, 0, 0, 0);
                        let createdDate = Date.parse(createdDateOld.toString());
                        if (createdDate <= endDate && createdDate >= startDate)
                            return item;

                    })
                }

                res.map(item => {
                    let findCap = allCaps.find(itemC => itemC.user_id == item.assigned_captain_id);
                    if (findCap)
                        this.missingPayments.push({ ...item, captain: findCap.first_name + ' ' + findCap.last_name });
                    else
                        this.missingPayments.push({ ...item, captain: "Not Assigned" });
                });
                this.loader = false;
                if (this.downloadOption == "CSV") {
                    const arr = [];
                    this.missingPayments.map(item => {
                        arr.push({
                            Name: item.first_name + ' ' + item.last_name,
                            Property: item.property_name,
                            Captain: item.captain,
                            Service_Day: item.user_profile_service_day == '1' ? 'Monday' :
                                item.user_profile_service_day == '2' ? 'Tuesday' :
                                    item.user_profile_service_day == '3' ? 'Wednesday' :
                                        item.user_profile_service_day == '4' ? 'Thursday' :
                                            item.user_profile_service_day == '5' ? 'Friday' :
                                                item.user_profile_service_day == '6' ? 'Saturday' :
                                                    item.user_profile_service_day == '0' ? 'Sunday' : 'Not Assigned',
                            Missing: 'Missing Valid Payment Method'

                        });
                    });
                    this.downloadCSVArray = arr;
                }
            })
        })

    }

    getCaptainList() {
        this.service.getAllCaptains().subscribe(response => {

            var endDateOld = new Date(localStorage.getItem('enddate'));
            endDateOld.setHours(0, 0, 0, 0);
            let endDate = Date.parse(endDateOld.toString());
            var startDateOld = new Date(localStorage.getItem('startdate'));
            startDateOld.setHours(0, 0, 0, 0);
            let startDate = Date.parse(startDateOld.toString());

            if (this.userType == '3') {
                var building = JSON.parse(localStorage.getItem("user")).building_id;
                response = response.filter(item => {
                    var findBuil = undefined;
                    if (item.additional_building !== null && item.additional_building !== "null") {
                        let additionaBuild = item.additional_building.split(",");
                        findBuil = additionaBuild.find(iteAB => iteAB == building);
                    }
                    if (findBuil || item.property_code == building)
                        return item;
                })
            } else if (this.userType == '6') {
                response = response.filter(item => {
                    var findBuild = undefined;
                    if (item.additional_building !== null && item.additional_building !== "null") {
                        let additionaBuild = item.additional_building.split(",");
                        findBuild = additionaBuild.find(iteAB => this.allBuildings.find(itemB => itemB.property_code == iteAB));
                    }
                    if (findBuild || this.allBuildings.find(iteAB => iteAB.property_code == item.property_code))
                        return item;
                });
            }

            response.map(item => {

                var properties = "N/A";
                let building = undefined;
                if (item.property_code) {
                    if (endDate && startDate) {
                        let createdDateOld = new Date(item.created_at);
                        createdDateOld.setHours(0, 0, 0, 0);
                        let createdDate = Date.parse(createdDateOld.toString());
                        building = this.allBuildings.find(iteA => item.property_code == iteA.property_code && createdDate <= endDate && createdDate >= startDate);
                    } else
                        building = this.allBuildings.find(iteA => item.property_code == iteA.property_code);
                }
                if (building) {
                    properties = building.property_name + ", ";
                    if (item.additional_building !== null && item.additional_building !== "null") {
                        let additionaBuild = item.additional_building.split(",");
                        additionaBuild.map((item, index) => {
                            let findbuild = this.allBuildings.find(ite => ite.property_code == item);
                            if (findbuild && index == additionaBuild.length)
                                properties = properties + findbuild.property_name;
                            else if (findbuild)
                                properties = properties + findbuild.property_name + ", "

                        })
                    }
                    properties = properties.replace(/,\s*$/, "");
                    this.allCaptainList.push({ ...item, assigned_buildings: properties });
                }
            });
            this.loader = false;
            if (this.downloadOption == "CSV") {
                const arr = [];
                this.allCaptainList.map(item => {
                    arr.push({
                        Name: item.first_name + ' ' + item.last_name,
                        Email: item.email,
                        Region: item.region,
                        Properties: '\"' + item.assigned_buildings + '\"',
                        Created_At: item.created_at.slice(0, 10),

                    });
                });
                this.downloadCSVArray = arr;
            }
        })
    }

    getAdminUsers() {
        this.service.getUsers().subscribe(response => {
            var selectedProp = JSON.parse(localStorage.getItem('selectedProperty'));
            var selectedRegion = localStorage.getItem('region');

            var endDateOld = new Date(localStorage.getItem('enddate'));
            endDateOld.setHours(0, 0, 0, 0);
            let endDate = Date.parse(endDateOld.toString());
            var startDateOld = new Date(localStorage.getItem('startdate'));
            startDateOld.setHours(0, 0, 0, 0);
            let startDate = Date.parse(startDateOld.toString());
            if (this.userType == '3') {
                var building = JSON.parse(localStorage.getItem("user")).building_id;
                response = response.filter(item => item.user_type_id == '3' && item.property_code == building);
            } else if (this.userType == '6') {
                var region = JSON.parse(localStorage.getItem("user")).user_region;
                response = response.filter(item => item.user_type_id == '3' && item.region == region);
            }
                response.map(item => {
                    if (endDate && startDate){
                        let createdDateOld = new Date(item.created_at);
                        createdDateOld.setHours(0, 0, 0, 0);
                        let createdDate = Date.parse(createdDateOld.toString());

                        if (item.user_type_id == '3' && selectedProp.find(ite => ite == item.property_code) && createdDate <= endDate && createdDate >= startDate)
                            this.allAdminUsers.push({ ...item, type: "Basic Admin", });
                        else if (item.user_type_id == '4' && createdDate <= endDate && createdDate >= startDate)
                            this.allAdminUsers.push({ ...item, type: "Global Admin", property_name: "All Properties", region: "All Regions" });
                        else if (item.user_type_id == '5' && createdDate <= endDate && createdDate >= startDate)
                            this.allAdminUsers.push({ ...item, type: "Super Admin", property_name: "All Properties", region: "All Regions" });
                        else if (item.user_type_id == '6' && createdDate <= endDate && createdDate >= startDate) {
                            if (selectedRegion == "All")
                                this.allAdminUsers.push({ ...item, type: "Regional Admin", property_name: "All Region Properties", region: item.user_region });
                            else if (selectedRegion == item.user_region)
                                this.allAdminUsers.push({ ...item, type: "Regional Admin", property_name: "All Region Properties", region: item.user_region });
                        }
                    }else{
                        if (item.user_type_id == '3' && selectedProp.find(ite => ite == item.property_code))
                            this.allAdminUsers.push({ ...item, type: "Basic Admin", });
                        else if (item.user_type_id == '4')
                            this.allAdminUsers.push({ ...item, type: "Global Admin", property_name: "All Properties", region: "All Regions" });
                        else if (item.user_type_id == '5')
                            this.allAdminUsers.push({ ...item, type: "Super Admin", property_name: "All Properties", region: "All Regions" });
                        else if (item.user_type_id == '6') {
                            if (selectedRegion == "All")
                                this.allAdminUsers.push({ ...item, type: "Regional Admin", property_name: "All Region Properties", region: item.user_region });
                            else if (selectedRegion == item.user_region)
                                this.allAdminUsers.push({ ...item, type: "Regional Admin", property_name: "All Region Properties", region: item.user_region });
                        }
                    }
                })
            
            this.loader = false;
            if (this.downloadOption == "CSV") {
                const arr = [];
                this.allAdminUsers.map(item => {
                    arr.push({
                        Name: item.first_name + ' ' + item.last_name,
                        Email: item.email,
                        Type: item.type,
                        Region: item.region,
                        Property: item.property_name,
                        Created_At: item.created_at.slice(0, 10),

                    });
                });
                this.downloadCSVArray = arr;
            }

        })
    }

    getAllProperties() {
        this.service.getAllLocations().subscribe(res => {
            var selectedProp = JSON.parse(localStorage.getItem('selectedProperty'));
            var finalPropDetailArr = [];
            if (this.userType == '3') {
                var building = JSON.parse(localStorage.getItem("user")).property_code;
                let matchedBuilding = res.filter(item => item.property_code == building);
                if (matchedBuilding[0])
                    this.allPropertiesReport = matchedBuilding.filter(item => selectedProp.find(it => item.property_code == it));
                this.loader = false;
            } else if (this.userType == '6') {
                var region = JSON.parse(localStorage.getItem("user")).user_region;
                let matchedBuilding = res.filter(item => item.region == region);
                if (matchedBuilding[0])
                    this.allPropertiesReport = matchedBuilding.filter(item => selectedProp.find(it => item.property_code == it));
                this.loader = false;
            } else {
                this.allPropertiesReport = res.filter(item => selectedProp.find(it => item.property_code == it));
                this.loader = false;
            }

            this.service.getUsers().subscribe(res => {

                this.allBasicUsers = res.filter(item => item.user_type_id == 3 && this.allPropertiesReport.find(it => it.property_code == item.property_code));

                this.allRegionalUsers = res.filter(item => item.user_type_id == 6 && this.allPropertiesReport.find(it => it.region == item.user_region));

            });
            this.service.getAllCaptains().subscribe(res => {
                this.allCaptains = res
            });

            this.service.getAllRestrictedService().subscribe((response: any) => {
                this.allRestrictedServices = response;

                this.allPropertiesReport.map((item, index) => {

                    let findBasic = this.allBasicUsers.filter(itemB => itemB.property_code == item.property_code);
                    let findRegional = this.allRegionalUsers.filter(itemR => itemR.user_region == item.region);
                    let findCap = this.allCaptains.filter(itemCap => {
                        var additionaBuild: any;
                        var findAddBuild = undefined;
                        if (itemCap.additional_building !== null && itemCap.additional_building !== "null") {
                            additionaBuild = itemCap.additional_building.split(",");
                            findAddBuild = additionaBuild.find(ite => ite == item.property_code)
                        }
                        if (item.property_code == itemCap.property_code || findAddBuild)
                            return item;
                    });
                    var findService = []
                    let findallRestrictedService = response.filter(itemF => item.property_code == itemF.criteria);
                    this.services.map(itemR => {
                        var findRestrictedService = findallRestrictedService.find(itemF => itemR.id == itemF.service_id);
                        if (findRestrictedService) { }
                        else
                            findService.push(itemR);

                    })
                    this.finalDetailArr.push({ property: item, captains: findCap, Regional: findRegional, Basic: findBasic, services: findService });
                })
            });
        })
    }

    taskDetail() {
        this.service.getAllLocations().subscribe(res => {
            const allCap = JSON.parse(localStorage.getItem("selectedCaptain"));
            var allCaptains = [];
            var allSelectedService = [];
            this.service.getAllCaptains().subscribe(resC => {
                allCaptains = resC;
            });
            var endDateOld = new Date(localStorage.getItem('enddate'));
            endDateOld.setHours(0, 0, 0, 0);
            let endDate = Date.parse(endDateOld.toString());
            var startDateOld = new Date(localStorage.getItem('startdate'));
            startDateOld.setHours(0, 0, 0, 0);
            let startDate = Date.parse(startDateOld.toString());

            var selectedProp = JSON.parse(localStorage.getItem('selectedProperty'));
            let data = { "property_code": "", "captainId": "", "service_day": "" };
            this.service.getAllServices(data).subscribe(resService => {

                var bakingServices = [];
                let index = 0;
                for (let i = 0; i < resService.length; i++) {
                    const services = resService[i];
                    for (let j = 0; j < services.length; j++) {

                        if (selectedProp.find(item => services[j].building_code == item) && services[j].service_enable == 'true') {
                            var captain = "Not Found";
                            let findCap = allCaptains.find(itemC => itemC.user_id == services[j].assigned_captain_id);
                            if (findCap)
                                captain = findCap.first_name + ' ' + findCap.last_name;
                            bakingServices.push({ ...services[j], captain: captain });
                            index++;
                        }
                    }
                }
                if (allCap != null)
                    bakingServices = bakingServices.filter(item => allCap.find(ite => ite == item.assigned_captain_id));
                if (endDate && startDate) {

                    bakingServices = bakingServices.filter(item => {

                        let createdDateOld = new Date(item.created_at);
                        createdDateOld.setHours(0, 0, 0, 0);
                        let createdDate = Date.parse(createdDateOld.toString());
                        if (createdDate <= endDate && createdDate >= startDate)
                            return item;

                    })
                }
                var selectedService = localStorage.getItem('selectedService');

                allSelectedService = bakingServices.filter(item => item.service_name == selectedService);
                this.taskDetailsArr = allSelectedService;
                this.loader = false;
                if (this.downloadOption == "CSV") {
                    const arr = [];
                    if (selectedService == "GROCERY SHOPPING")
                        this.taskDetailsArr.map(item => {
                            arr.push({
                                Service: item.service_name,
                                Resident: item.first_name + ' ' + item.last_name,
                                Phone: item.phone,
                                Unit_Number: item.unit_number,
                                Captain: item.captain,
                                Region: item.region,
                                Property: item.property_name,
                                Completed: item.service_completed == 'true' ? 'Completed' : 'Not Completed',
                                Completion_Date: item.service_completed_date == null ? 'N/A' : item.service_completed_date,
                                List_name: item.list_name,
                                Description: item.description,
                                Total_amount: item.total_amount == null ? 'N/A' : item.total_amount,
                                Requested_Date: item.created_at,
                            });
                        });

                    else if (selectedService == "FLOWER DELIVERY")
                        this.taskDetailsArr.map(item => {
                            arr.push({
                                Service: item.service_name,
                                Resident: item.first_name + ' ' + item.last_name,
                                Phone: item.phone,
                                Unit_Number: item.unit_number,
                                Captain: item.captain,
                                Region: item.region,
                                Property: item.property_name,
                                Completed: item.service_completed == 'true' ? 'Completed' : 'Not Completed',
                                Completion_Date: item.service_completed_date == null ? 'N/A' : item.service_completed_date,
                                Display_area: item.display_flower_area,
                                Flower_budget: item.flower_budget,
                                Arrangement_type: item.notes,
                                Vase_required: item.vase,
                                Vase_budget: item.vase_budget,
                            });
                        });

                    else if (selectedService == "RX PICK-UP")
                        this.taskDetailsArr.map(item => {
                            arr.push({
                                Service: item.service_name,
                                Resident: item.first_name + ' ' + item.last_name,
                                Phone: item.phone,
                                Unit_Number: item.unit_number,
                                Captain: item.captain,
                                Region: item.region,
                                Property: item.property_name,
                                Completed: item.service_completed == 'true' ? 'Completed' : 'Not Completed',
                                Completion_Date: item.service_completed_date == null ? 'N/A' : item.service_completed_date,
                                Prescription_name: item.name_of_prescription,
                                Payment_required: item.payment_required_for_pickup,
                                Information: item.other_information,
                            });
                        });
                    else if (selectedService == "ONQUEST CLEAN")
                        this.taskDetailsArr.map(item => {
                            arr.push({
                                Service: item.service_name,
                                Resident: item.first_name + ' ' + item.last_name,
                                Phone: item.phone,
                                Unit_Number: item.unit_number,
                                Captain: item.captain,
                                Region: item.region,
                                Property: item.property_name,
                                Completed: item.service_completed == 'true' ? 'Completed' : 'Not Completed',
                                Completion_Date: item.service_completed_date == null ? 'N/A' : item.service_completed_date,
                                Information: item.notes,
                            });
                        });
                    else if (selectedService == "LAUNDRY PICK-UP")
                        this.taskDetailsArr.map(item => {
                            arr.push({
                                Service: item.service_name,
                                Resident: item.first_name + ' ' + item.last_name,
                                Phone: item.phone,
                                Unit_Number: item.unit_number,
                                Captain: item.captain,
                                Region: item.region,
                                Property: item.property_name,
                                Completed: item.service_completed == 'true' ? 'Completed' : 'Not Completed',
                                Completion_Date: item.service_completed_date == null ? 'N/A' : item.service_completed_date,
                                Pick_items: item.number_of_items,
                                Instruction: item.specific_instruction,
                            });
                        });
                    else if (selectedService == "LAUNDRY DROP-OFF")
                        this.taskDetailsArr.map(item => {
                            arr.push({
                                Service: item.service_name,
                                Resident: item.first_name + ' ' + item.last_name,
                                Phone: item.phone,
                                Unit_Number: item.unit_number,
                                Captain: item.captain,
                                Region: item.region,
                                Property: item.property_name,
                                Completed: item.service_completed == 'true' ? 'Completed' : 'Not Completed',
                                Completion_Date: item.service_completed_date == null ? 'N/A' : item.service_completed_date,
                                Drop_items: item.number_of_items,
                                Information: item.relevant_information,
                            });
                        });
                    else if (selectedService == "PACKAGE PICK-UP")
                        this.taskDetailsArr.map(item => {
                            arr.push({
                                Service: item.service_name,
                                Resident: item.first_name + ' ' + item.last_name,
                                Phone: item.phone,
                                Unit_Number: item.unit_number,
                                Captain: item.captain,
                                Region: item.region,
                                Property: item.property_name,
                                Completed: item.service_completed == 'true' ? 'Completed' : 'Not Completed',
                                Completion_Date: item.service_completed_date == null ? 'N/A' : item.service_completed_date,
                                Items: item.number_of_packages,
                                Information: item.other_information,
                            });
                        });
                    this.downloadCSVArray = arr;

                }

            });
        });
    }

    incompleteTasks() {
        this.service.getAllLocations().subscribe(res => {
            const allCap = JSON.parse(localStorage.getItem("selectedCaptain"));
            var allCaptains = [];
            var allGrocery = [];
            var allFlower = [];
            var allRx = [];
            var allPackage = [];
            var allLaundryPick = [];
            var allLaundryDrop = [];
            var allOnQuest = [];
            this.service.getAllCaptains().subscribe(resC => {
                allCaptains = resC;
            });
            var endDateOld = new Date(localStorage.getItem('enddate'));
            endDateOld.setHours(0, 0, 0, 0);
            let endDate = Date.parse(endDateOld.toString());
            var startDateOld = new Date(localStorage.getItem('startdate'));
            startDateOld.setHours(0, 0, 0, 0);
            let startDate = Date.parse(startDateOld.toString());

            var selectedProp = JSON.parse(localStorage.getItem('selectedProperty'));
            let data = { "property_code": "", "captainId": "", "service_day": "" };
            this.service.getAllServices(data).subscribe(resService => {

                var bakingServices = [];
                let index = 0;
                for (let i = 0; i < resService.length; i++) {
                    const services = resService[i];
                    for (let j = 0; j < services.length; j++) {

                        if (selectedProp.find(item => services[j].building_code == item) && services[j].service_enable == 'true' && services[j].service_completed == 'false') {
                            var captain = "Not Found";
                            let findCap = allCaptains.find(itemC => itemC.user_id == services[j].assigned_captain_id);
                            if (findCap)
                                captain = findCap.first_name + ' ' + findCap.last_name;
                            bakingServices.push({ ...services[j], captain: captain });
                            index++;
                        }
                    }
                }
                if (allCap != null)
                    bakingServices = bakingServices.filter(item => allCap.find(ite => ite == item.assigned_captain_id));
                if (endDate && startDate) {

                    bakingServices = bakingServices.filter(item => {

                        let createdDateOld = new Date(item.created_at);
                        createdDateOld.setHours(0, 0, 0, 0);
                        let createdDate = Date.parse(createdDateOld.toString());
                        if (createdDate <= endDate && createdDate >= startDate)
                            return item;

                    })
                }

                this.inCompleteTasksArr = bakingServices;
                this.loader = false;
                if (this.downloadOption == "CSV") {
                    const arr = [];
                    this.inCompleteTasksArr.map(item => {
                        arr.push({
                            Service: item.service_name,
                            Resident: item.first_name + ' ' + item.last_name,
                            Captain: item.captain,
                            Property: item.property_name,
                            Requested_Date: item.created_at,
                            User_Profile_Service_Day: item.user_profile_service_day == '1' ? 'Monday' :
                                item.user_profile_service_day == '2' ? 'Tuesday' :
                                    item.user_profile_service_day == '3' ? 'Wednesday' :
                                        item.user_profile_service_day == '4' ? 'Thursday' :
                                            item.user_profile_service_day == '5' ? 'Friday' :
                                                item.user_profile_service_day == '6' ? 'Saturday' :
                                                    item.user_profile_service_day == '0' ? 'Sunday' : 'Not Assigned',
                        });
                    });
                    this.inCompleteTasksArr.map(item => {
                        arr.push({
                            Services: item.service_name,
                            Residents: item.first_name + ' ' + item.last_name,
                            Captain: item.captain,
                            Property: item.property_name,
                            Requested_Date: item.created_at,
                            User_Profile_Service_Day: item.user_profile_service_day == '1' ? 'Monday' :
                                item.user_profile_service_day == '2' ? 'Tuesday' :
                                    item.user_profile_service_day == '3' ? 'Wednesday' :
                                        item.user_profile_service_day == '4' ? 'Thursday' :
                                            item.user_profile_service_day == '5' ? 'Friday' :
                                                item.user_profile_service_day == '6' ? 'Saturday' :
                                                    item.user_profile_service_day == '0' ? 'Sunday' : 'Not Assigned',
                        });
                    });
                    this.downloadCSVArray = arr;
                }

            });
        });
    }

    taskCompletion() {
        this.service.getAllLocations().subscribe(res => {
            const allCap = JSON.parse(localStorage.getItem("selectedCaptain"));
            var allCaptains = [];
            this.service.getAllCaptains().subscribe(resC => {
                allCaptains = resC;
            });
            var endDateOld = new Date(localStorage.getItem('enddate'));
            endDateOld.setHours(0, 0, 0, 0);
            let endDate = Date.parse(endDateOld.toString());
            var startDateOld = new Date(localStorage.getItem('startdate'));
            startDateOld.setHours(0, 0, 0, 0);
            let startDate = Date.parse(startDateOld.toString());

            var selectedProp = JSON.parse(localStorage.getItem('selectedProperty'));
            let data = { "property_code": "", "captainId": "", "service_day": "" };
            this.service.getAllServices(data).subscribe(resService => {

                var bakingServices = [];
                let index = 0;
                for (let i = 0; i < resService.length; i++) {
                    const services = resService[i];
                    for (let j = 0; j < services.length; j++) {

                        if (selectedProp.find(item => services[j].building_code == item) && services[j].service_completed == 'true') {
                            var captain = "Not Found";
                            let findCap = allCaptains.find(itemC => itemC.user_id == services[j].assigned_captain_id);
                            if (findCap)
                                captain = findCap.first_name + ' ' + findCap.last_name;
                            bakingServices.push({ ...services[j], captain: captain });
                            index++;
                        }
                    }
                }
                if (allCap != null)
                    bakingServices = bakingServices.filter(item => allCap.find(ite => ite == item.assigned_captain_id));
                if (endDate && startDate) {

                    bakingServices = bakingServices.filter(item => {

                        let createdDateOld = new Date(item.created_at);
                        createdDateOld.setHours(0, 0, 0, 0);
                        let createdDate = Date.parse(createdDateOld.toString());
                        if (createdDate <= endDate && createdDate >= startDate)
                            return item;

                    })
                }
                this.taskCompletionArr = bakingServices;
                this.loader = false;
                if (this.downloadOption == "CSV") {
                    const arr = [];
                    this.taskCompletionArr.map(item => {
                        arr.push({
                            Service: item.service_name,
                            Resident: item.first_name + ' ' + item.last_name,
                            Captain: item.captain,
                            Property: item.property_name,
                            Requested_Date: item.created_at,
                            Completion_Date: item.updated_at ? item.updated_at.slice(0, 10) : item.last_updated.slice(0, 10),
                            User_Profile_Service_Day: item.user_profile_service_day == '1' ? 'Monday' :
                                item.user_profile_service_day == '2' ? 'Tuesday' :
                                    item.user_profile_service_day == '3' ? 'Wednesday' :
                                        item.user_profile_service_day == '4' ? 'Thursday' :
                                            item.user_profile_service_day == '5' ? 'Friday' :
                                                item.user_profile_service_day == '6' ? 'Saturday' :
                                                    item.user_profile_service_day == '0' ? 'Sunday' : 'Not Assigned',
                        });
                    });
                    this.downloadCSVArray = arr;
                }

            });
        });
    }

    getDownloads() {
        this.service.getAllDownloads().subscribe(res => {
            if (res) {
                var selectedProp = JSON.parse(localStorage.getItem('selectedProperty'));
                this.service.getAllLocations().subscribe(allProp => {
                    let findPropName = allProp.filter(item => selectedProp.find(ite => ite == item.property_code))

                    res = res.filter(item => findPropName.find(ite => ite.property_name == item.property_name));
                    var endDateOld = new Date(localStorage.getItem('enddate'));
                    endDateOld.setHours(0, 0, 0, 0);
                    let endDate = Date.parse(endDateOld.toString());
                    var startDateOld = new Date(localStorage.getItem('startdate'));
                    startDateOld.setHours(0, 0, 0, 0);
                    let startDate = Date.parse(startDateOld.toString());
                    var allAndroid = [];
                    var allIOS = [];
                    if (endDate && startDate) {

                        res = res.filter(item => {
                            let createdDateOld = new Date(item.created_at);
                            createdDateOld.setHours(0, 0, 0, 0);
                            let createdDate = Date.parse(createdDateOld.toString());
                            if (createdDate <= endDate && createdDate >= startDate)
                                return item;

                        });
                        allAndroid = res.filter(item => item.os == 'android');
                        allIOS = res.filter(item => item.os == 'ios');
                    } else {
                        allAndroid = res.filter(item => item.os == 'android');
                        allIOS = res.filter(item => item.os == 'ios');
                    }
                    this.allDownloadsDetail = res;
                    this.appleCount = allIOS.length;
                    this.androidCount = allAndroid.length;
                    this.loader = false;
                    if (this.downloadOption == "EXCEL" || this.downloadOption == "CSV") {
                        let tableArr = [{ 'android': this.androidCount, 'ios': this.appleCount }];
                        this.dataSource = new MatTableDataSource<any>(this.allDownloadsDetail);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    }
                    if (this.downloadOption == "CSV") {
                        const arr = [];
                        res.map(item => {
                            arr.push({
                                Property: item.property_name,
                                Resident: item.first_name + ' ' + item.last_name,
                                Region: item.region,
                                Device: item.os,
                                Download_Date: item.created_at,
                            });
                        });
                        this.downloadCSVArray = arr;
                    }
                    this.loader = false;
                });
            }
        });

    }

    openUsers(prop_code, type, region) {

        const dialogRef = this.dialog.open(UserlistComponent, {
            width: '80vw',
            data: { service: this.service, userType: type, property_code: prop_code, region: region }
        });

        dialogRef.afterClosed().subscribe(result => {

        });

    }

    getSignUpBaseResidents() {
        const selectedProperty = JSON.parse(localStorage.getItem('selectedProperty'));
        // let data = { "property_code": selectedProperty, "captainId": "", "service_day": "" };
        this.service.getAllResidents().subscribe((response: any) => {
            if (this.userType == "3") {
                var building = JSON.parse(localStorage.getItem("user")).building_id;
                var findMatch = response.filter(item => item.building_id == building)
                response = findMatch;
            }
            var endDate = new Date(localStorage.getItem('enddate'));
            var startDate = new Date(localStorage.getItem('startdate'));
            var matchedResidents = response.filter(item => selectedProperty.find(ite => item.building_id == ite));
            matchedResidents = matchedResidents.map(item => {return {...item,service_day:item.user_profile_service_day=='1'?'Monday':
            item.user_profile_service_day=='2'?'Tuesday':
                    item.user_profile_service_day=='3'?'Wednesday':
                            item.user_profile_service_day=='4'?'Thursday':
                                    item.user_profile_service_day=='5'?'Friday':
                                            item.user_profile_service_day=='6'?'Saturday':
                                                    item.user_profile_service_day=='0'?'Sunday':'Not Assigned',resident_name:item.first_name+' '+item.last_name}});
            if (endDate.toString() != 'Invalid Date' && startDate.toString() != 'Invalid Date') {
                this.matchedSignupResident = matchedResidents.filter(item => {
                    const createdDate = new Date(item.created_at);
                    if (createdDate <= endDate && createdDate >= startDate) {
                        return item;
                    }
                });
            } else {
                this.matchedSignupResident = matchedResidents;
            }
            this.dataSource = new MatTableDataSource<any>(this.matchedSignupResident);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.loader = false;
            if (this.downloadOption == "CSV") {
                const arr = [];
                this.matchedSignupResident.map(item => {
                    arr.push({
                        '\"Resident Name\"': item.resident_name,
                        Email: item.email,
                        Property_Name: item.property_name,
                        region: this.selectedPropRegion,
                        Created_At: item.created_at,
                        Phone: item.phone,
                        '\"Service Day\"': item.service_day
                    });
                });
                this.downloadCSVArray = arr;
            }
        });
    }

    getAllResidents() {
        this.service.getAllResidents().subscribe((response: any) => {
            var allCaptains = [];
            this.service.getAllCaptains().subscribe(res => {
                allCaptains = res;
            });
            let building_code = JSON.parse(localStorage.getItem('selectedProperty'));
            var endDateOld = new Date(localStorage.getItem('enddate'));
            endDateOld.setHours(0, 0, 0, 0);
            let endDate = Date.parse(endDateOld.toString());
            var startDateOld = new Date(localStorage.getItem('startdate'));
            startDateOld.setHours(0, 0, 0, 0);
            let startDate = Date.parse(startDateOld.toString());
            let data = { "property_code": "", "captainId": "", "service_day": "" };
            this.service.getAllServices(data).subscribe(resService => {

                var bakingServices = [];
                let index = 0;

                for (let i = 0; i < resService.length; i++) {
                    const services = resService[i];
                    for (let j = 0; j < services.length; j++) {
                        if (building_code.find(ite => ite == services[j].building_code)) {
                            bakingServices[index] = services[j];
                            index++;
                        }
                    }
                }

                response.map((item, index) => {
                    let createdDateOld = new Date(item.created_at);
                    createdDateOld.setHours(0, 0, 0, 0);

                    let createdDate = Date.parse(createdDateOld.toString());


                    if (building_code.find(ite => item.building_id == ite)) {
                        if (endDate.toString() != 'Invalid Date' && startDate.toString() != 'Invalid Date' && endDate.toString() != 'NaN' && startDate.toString() != 'NaN') {
                            if (createdDate <= endDate && createdDate >= startDate) {
                                let findCap = allCaptains.find(itC => itC.user_id == item.assigned_captain_id);
                                let findBuildingCompleted = bakingServices.filter(itemS => itemS.service_completed == "true" && itemS.user_id == item.user_id);
                                let findBuildingInCompleted = bakingServices.filter(itemS => itemS.service_completed == "false" && itemS.service_enable == "true" && itemS.user_id == item.user_id);

                                this.allResidents.push({
                                    ...item, captain: findCap ? findCap.first_name + ' ' + findCap.last_name : "Not Assigned",
                                    service_complete: findBuildingCompleted.length, service_incomplete: findBuildingInCompleted.length
                                });
                            }
                        }
                        else {
                            let findCap = allCaptains.find(itC => itC.user_id == item.assigned_captain_id);
                            let findBuildingCompleted = bakingServices.filter(itemS => itemS.service_completed == "true" && itemS.user_id == item.user_id);
                            let findBuildingInCompleted = bakingServices.filter(itemS => itemS.service_completed == "false" && itemS.service_enable == "true" && itemS.user_id == item.user_id);

                            this.allResidents.push({
                                ...item, captain: findCap ? findCap.first_name + ' ' + findCap.last_name : "Not Assigned",
                                service_complete: findBuildingCompleted.length, service_incomplete: findBuildingInCompleted.length
                            });

                        }
                    }
                });
                this.dataSource = new MatTableDataSource<any>(this.allResidents);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.loader = false;
                if (this.downloadOption == "CSV") {
                    const arr = [];
                    this.allResidents.map(item => {
                        arr.push({
                            Name: item.first_name + ' ' + item.last_name,
                            Email: item.email,
                            Captain: item.captain,
                            Property: item.property_name,
                            Service_Day: item.user_profile_service_day == '1' ? 'Monday' :
                                item.user_profile_service_day == '2' ? 'Tuesday' :
                                    item.user_profile_service_day == '3' ? 'Wednesday' :
                                        item.user_profile_service_day == '4' ? 'Thursday' :
                                            item.user_profile_service_day == '5' ? 'Friday' :
                                                item.user_profile_service_day == '6' ? 'Saturday' :
                                                    item.user_profile_service_day == '0' ? 'Sunday' : 'Not Assigned',
                            Service_Complete: item.service_complete,
                            Service_InComplete: item.service_incomplete,
                            Created_at: item.created_at,
                        });
                    });
                    this.downloadCSVArray = arr;
                }
            });

        });
    }


    inCompleteTasksExcel() {
        var finalExcel: any = [["Service_name", '\"Property\"', 'Captains', "Resident", '\"Requested_Date\"', "Service_Day"]];

        var arr = [];
        this.inCompleteTasksArr.map(item => {

            arr.push(
                '\"' + item.service_name + '\"',
                '\"' + item.property_name + '\"',
                '\"' + item.captain + '\"',
                '\"' + item.first_name + " " + item.last_name + '\"',
                '\"' + item.created_at.slice(0, 10) + '\"',
                '\"' + item.user_profile_service_day == '0' ? "Monday" : item.user_profile_service_day == '1' ? "Tuesday" : item.user_profile_service_day == '2' ? "Tuesday"
                    : item.user_profile_service_day == '3' ? "Wednesday" : item.user_profile_service_day == '4' ? "Thursday" : item.user_profile_service_day == '5' ? "Friday" :
                        item.user_profile_service_day == '6' ? "Saturday" : "Not Assigned" + '\"',

            );


            finalExcel.push(arr);
            arr = [];
        });
        var lineArray = [];
        finalExcel.forEach(function (infoArray, index) {
            var line = infoArray.join(" \t");
            lineArray.push(index == 0 ? line : line);
        });
        var csvContent = lineArray.join("\r\n");
        var excel_file = document.createElement('a');
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        excel_file.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csvContent));
        excel_file.setAttribute('download', this.reportId + date + '.xls');
        document.body.appendChild(excel_file);
        excel_file.click();
        document.body.removeChild(excel_file);
    }

    captainListExcel() {
        var finalExcel: any = [["Name", '\"Email\"', 'Region', '\"Assigned Properties\"', '\"Created At\"']];

        var arr = [];
        this.allCaptainList.map(item => {

            arr.push(
                '\"' + item.first_name + " " + item.last_name + '\"',
                '\"' + item.email + '\"',
                '\"' + item.region + '\"',
                '\"' + item.assigned_buildings + '\"',
                '\"' + item.created_at.slice(0, 10) + '\"'

            );


            finalExcel.push(arr);
            arr = [];
        });

        var lineArray = [];
        finalExcel.forEach(function (infoArray, index) {
            var line = infoArray.join(" \t");
            lineArray.push(index == 0 ? line : line);
        });
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var csvContent = lineArray.join("\r\n");
        var excel_file = document.createElement('a');
        excel_file.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csvContent));
        excel_file.setAttribute('download', this.reportId + date + '.xls');
        document.body.appendChild(excel_file);
        excel_file.click();
        document.body.removeChild(excel_file);
    }

    taskDetailExcel() {
        var selectedService = localStorage.getItem('selectedService');
        if (selectedService == "GROCERY SHOPPING")
            var finalExcel: any = [["Service", 'Resident', 'Phone', '\"Unit Number\"', 'Captain', 'Region', 'Property', 'Completed', '\"Completed At\"', 'Description', '\"Total Amount\"', 'Requested']];
        else if (selectedService == "FLOWER DELIVERY")
            var finalExcel: any = [["Service", 'Resident', 'Phone', '\"Unit Number\"', 'Captain', 'Region', 'Property', 'Completed', '\"Completed At\"', '\"Display Area\"', '\"Flower Budget\"', '\"Total Amount\"', '\"Arrangement Type\"', 'Information', '\"Vase Required\"', '\"Vase Budget\"']];
        else if (selectedService == "RX PICK-UP")
            var finalExcel: any = [["Service", 'Resident', 'Phone', '\"Unit Number\"', 'Captain', 'Region', 'Property', 'Completed', '\"Completed At\"', '\"Prescription Name\"', '\"Payment Required\"', 'Information']];
        else if (selectedService == "ONQUEST CLEAN")
            var finalExcel: any = [["Service", 'Resident', 'Phone', '\"Unit Number\"', 'Captain', 'Region', 'Property', 'Completed', '\"Completed At\"', 'Information']];
        else if (selectedService == "LAUNDRY PICK-UP")
            var finalExcel: any = [["Service", 'Resident', 'Phone', '\"Unit Number\"', 'Captain', 'Region', 'Property', 'Completed', '\"Completed At\"', '\"Pick Items\"', 'Instructions']];
        else if (selectedService == "LAUNDRY DROP-OFF")
            var finalExcel: any = [["Service", 'Resident', 'Phone', '\"Unit Number\"', 'Captain', 'Region', 'Property', 'Completed', '\"Completed At\"', '\"Drop Items\"', 'Instructions']];
        else if (selectedService == "PACKAGE PICK-UP")
            var finalExcel: any = [["Service", 'Resident', 'Phone', '\"Unit Number\"', 'Captain', 'Region', 'Property', 'Completed', '\"Completed At\"', '\"Total Packages\"', 'Instructions']];

        var arr = [];
        this.taskDetailsArr.map(item => {
            if (selectedService == "GROCERY SHOPPING")
                arr.push(
                    '\"' + item.service_name + '\"',
                    '\"' + item.first_name + ' ' + item.last_name + '\"',
                    item.phone,
                    item.unit_number,
                    '\"' + item.captain + '\"',
                    '\"' + item.region + '\"',
                    '\"' + item.property_name + '\"',
                    item.service_completed == 'true' ? 'Completed' : '\"Not Completed\"',
                    item.service_completed_date == null ? 'N/A' : '\"' + item.service_completed_date + '\"',
                    '\"' + item.list_name + '\"',
                    '\"' + item.description + '\"',
                    item.total_amount == null ? 'N/A' : '\"' + item.total_amount + '\"',
                    '\"' + item.created_at + '\"',
                );
            else if (selectedService == "FLOWER DELIVERY")
                arr.push(
                    '\"' + item.service_name + '\"',
                    '\"' + item.first_name + ' ' + item.last_name + '\"',
                    item.phone,
                    item.unit_number,
                    '\"' + item.captain + '\"',
                    '\"' + item.region + '\"',
                    '\"' + item.property_name + '\"',
                    item.service_completed == 'true' ? 'Completed' : '\"Not Completed\"',
                    item.service_completed_date == null ? 'N/A' : '\"' + item.service_completed_date + '\"',
                    '\"' + item.display_flower_area + '\"',
                    '\"' + item.flower_budget + '\"',
                    item.total_amount == null ? 'N/A' : '\"' + item.total_amount + '\"',
                    '\"' + item.notes + '\"',
                    '\"' + item.other_information + '\"',
                    '\"' + item.vase + '\"',
                    '\"' + item.vase_budget + '\"',
                );
            else if (selectedService == "RX PICK-UP")
                arr.push(
                    '\"' + item.service_name + '\"',
                    '\"' + item.first_name + ' ' + item.last_name + '\"',
                    item.phone,
                    item.unit_number,
                    '\"' + item.captain + '\"',
                    '\"' + item.region + '\"',
                    '\"' + item.property_name + '\"',
                    item.service_completed == 'true' ? 'Completed' : '\"Not Completed\"',
                    item.service_completed_date == null ? 'N/A' : '\"' + item.service_completed_date + '\"',
                    '\"' + item.name_of_prescription + '\"',
                    '\"' + item.payment_required_for_pickup + '\"',
                    '\"' + item.other_information + '\"',
                );
            else if (selectedService == "ONQUEST CLEAN")
                arr.push(
                    '\"' + item.service_name + '\"',
                    '\"' + item.first_name + ' ' + item.last_name + '\"',
                    item.phone,
                    item.unit_number,
                    '\"' + item.captain + '\"',
                    '\"' + item.region + '\"',
                    '\"' + item.property_name + '\"',
                    item.service_completed == 'true' ? 'Completed' : '\"Not Completed\"',
                    item.service_completed_date == null ? 'N/A' : '\"' + item.service_completed_date + '\"',
                    '\"' + item.notes + '\"',
                );
            else if (selectedService == "LAUNDRY PICK-UP")
                arr.push(
                    '\"' + item.service_name + '\"',
                    '\"' + item.first_name + ' ' + item.last_name + '\"',
                    item.phone,
                    item.unit_number,
                    '\"' + item.captain + '\"',
                    '\"' + item.region + '\"',
                    '\"' + item.property_name + '\"',
                    item.service_completed == 'true' ? 'Completed' : '\"Not Completed\"',
                    item.service_completed_date == null ? 'N/A' : '\"' + item.service_completed_date + '\"',
                    '\"' + item.number_of_items + '\"',
                    '\"' + item.specific_instruction + '\"',
                );
            else if (selectedService == "LAUNDRY DROP-OFF")
                arr.push(
                    '\"' + item.service_name + '\"',
                    '\"' + item.first_name + ' ' + item.last_name + '\"',
                    item.phone,
                    item.unit_number,
                    '\"' + item.captain + '\"',
                    '\"' + item.region + '\"',
                    '\"' + item.property_name + '\"',
                    item.service_completed == 'true' ? 'Completed' : '\"Not Completed\"',
                    item.service_completed_date == null ? 'N/A' : '\"' + item.service_completed_date + '\"',
                    '\"' + item.number_of_items + '\"',
                    '\"' + item.relevant_information + '\"',
                );
            else if (selectedService == "PACKAGE PICK-UP")
                arr.push(
                    '\"' + item.service_name + '\"',
                    '\"' + item.first_name + ' ' + item.last_name + '\"',
                    item.phone,
                    item.unit_number,
                    '\"' + item.captain + '\"',
                    '\"' + item.region + '\"',
                    '\"' + item.property_name + '\"',
                    item.service_completed == 'true' ? 'Completed' : '\"Not Completed\"',
                    item.service_completed_date == null ? 'N/A' : '\"' + item.service_completed_date + '\"',
                    '\"' + item.number_of_packages + '\"',
                    '\"' + item.other_information + '\"',
                );

            finalExcel.push(arr);
            arr = [];
        });
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();

        var lineArray = [];
        finalExcel.forEach(function (infoArray, index) {
            var line = infoArray.join(" \t");
            lineArray.push(index == 0 ? line : line);
        });
        var csvContent = lineArray.join("\r\n");
        var excel_file = document.createElement('a');
        excel_file.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csvContent));
        excel_file.setAttribute('download', this.reportId + date + '.xls');
        document.body.appendChild(excel_file);
        excel_file.click();
        document.body.removeChild(excel_file);
    }

    missingPayExcel() {
        var finalExcel: any = [["Name", '\"Property\"', 'Captain', '\"Service Day\"', 'Missing']];

        var arr = [];
        this.missingPayments.map(item => {

            arr.push(
                '\"' + item.first_name + " " + item.last_name + '\"',
                '\"' + item.property_name + '\"',
                '\"' + item.captain + '\"',
                '"' + item.user_profile_service_day == '0' ? "Monday" : item.user_profile_service_day == '1' ? "Tuesday" : item.user_profile_service_day == '2' ? "Tuesday"
                    : item.user_profile_service_day == '3' ? "Wednesday" : item.user_profile_service_day == '4' ? "Thursday" : item.user_profile_service_day == '5' ? "Friday" :
                        item.user_profile_service_day == '6' ? "Saturday" : "Not_Assigned" + '"',
                '\"Missing Valid Payment Method\"'

            );


            finalExcel.push(arr);
            arr = [];
        });
        var lineArray = [];
        finalExcel.forEach(function (infoArray, index) {
            var line = infoArray.join(" \t");
            lineArray.push(index == 0 ? line : line);
        });
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var csvContent = lineArray.join("\r\n");
        var excel_file = document.createElement('a');
        excel_file.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csvContent));
        excel_file.setAttribute('download', "missing_payment_method_" + date + '.xls');
        document.body.appendChild(excel_file);
        excel_file.click();
        document.body.removeChild(excel_file);
    }

    propSummaryExcel() {
        var finalExcel: any = [["Property", '\"Total Task Completed\"', '\"Residents With Tasks Completed\"']];

        var arr = [];
        this.allPropertySummary.map(item => {

            arr.push(
                '\"' + item.name + '\"',
                '\"' + item.total_task + '\"',
                '\"' + item.total_acc + '\"'
            );
            finalExcel.push(arr);
            arr = [];
        });
        var lineArray = [];
        finalExcel.forEach(function (infoArray, index) {
            var line = infoArray.join(" \t");
            lineArray.push(index == 0 ? line : line);
        });
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var csvContent = lineArray.join("\r\n");
        var excel_file = document.createElement('a');
        excel_file.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csvContent));
        excel_file.setAttribute('download', this.reportId + date + '.xls');
        document.body.appendChild(excel_file);
        excel_file.click();
        document.body.removeChild(excel_file);
    }

    adminUsersExcel() {
        var finalExcel: any = [["Name", '\"Email\"', 'Type', "Region", '\"Assigned Property\"', '\"Created At\"']];

        var arr = [];
        this.allAdminUsers.map(item => {

            arr.push(
                '\"' + item.first_name + " " + item.last_name + '\"',
                '\"' + item.email + '\"',
                '\"' + item.type + '\"',
                '\"' + item.region + '\"',
                '\"' + item.property_name + '\"',
                '\"' + item.created_at.slice(0, 10) + '\"'

            );


            finalExcel.push(arr);
            arr = [];
        });

        var lineArray = [];
        finalExcel.forEach(function (infoArray, index) {
            var line = infoArray.join(" \t");
            lineArray.push(index == 0 ? line : line);
        });
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var csvContent = lineArray.join("\r\n");
        var excel_file = document.createElement('a');
        excel_file.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csvContent));
        excel_file.setAttribute('download', this.reportId + date + '.xls');
        document.body.appendChild(excel_file);
        excel_file.click();
        document.body.removeChild(excel_file);
    }



    taskCompletionExcel() {
        var finalExcel: any = [["Service_name", '\"Property\"', 'Captains', "Resident", '\"Requested_Date\"', 'Completion_Date', "Service_Day"]];

        var arr = [];
        this.taskCompletionArr.map(item => {
            if (item.updated_at)
                arr.push(
                    '\"' + item.service_name + '\"',
                    '\"' + item.property_name + '\"',
                    '\"' + item.captain + '\"',
                    '\"' + item.first_name + " " + item.last_name + '\"',
                    '\"' + item.created_at.slice(0, 10) + '\"',
                    '\"' + item.updated_at.slice(0, 10) + '\"',
                    '\"' + item.user_profile_service_day == '0' ? "Monday" : item.user_profile_service_day == '1' ? "Tuesday" : item.user_profile_service_day == '2' ? "Tuesday"
                        : item.user_profile_service_day == '3' ? "Wednesday" : item.user_profile_service_day == '4' ? "Thursday" : item.user_profile_service_day == '5' ? "Friday" :
                            item.user_profile_service_day == '6' ? "Saturday" : '\"Not Assigned\"' + '\"'
                );
            else
                arr.push(
                    '\"' + item.service_name + '\"',
                    '\"' + item.property_name + '\"',
                    '\"' + item.captain + '\"',
                    '\"' + item.first_name + " " + item.last_name + '\"',
                    '\"' + item.created_at.slice(0, 10) + '\"',
                    '\"' + item.last_updated.slice(0, 10) + '\"',
                    '\"' + item.user_profile_service_day == '0' ? "Monday" : item.user_profile_service_day == '1' ? "Tuesday" : item.user_profile_service_day == '2' ? "Tuesday"
                        : item.user_profile_service_day == '3' ? "Wednesday" : item.user_profile_service_day == '4' ? "Thursday" : item.user_profile_service_day == '5' ? "Friday" :
                            item.user_profile_service_day == '6' ? "Saturday" : "Not Assigned" + '\"'

                );

            finalExcel.push(arr);
            arr = [];
        });
    
        var lineArray = [];
        finalExcel.forEach(function (infoArray, index) {
            var line = infoArray.join(" \t");
            lineArray.push(index == 0 ? line : line);
        });
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var csvContent = lineArray.join("\r\n");
        var excel_file = document.createElement('a');
        excel_file.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csvContent));
        excel_file.setAttribute('download', this.reportId + date + '.xls');
        document.body.appendChild(excel_file);
        excel_file.click();
        document.body.removeChild(excel_file);
    }

    generatePDF() {
        if (this.downloadOption == 'EXCEL') {
            if (this.reportId == "properties")
                this.peropertyDownloadPDF();
            else if (this.reportId == "feature_usage")
                this.downloadExlFeature();
            else if (this.reportId == "task_completion")
                this.taskCompletionExcel();
            else if (this.reportId == "incomplete_tasks")
                this.inCompleteTasksExcel();
            else if (this.reportId == "admin_users")
                this.adminUsersExcel();
            else if (this.reportId == 'captain_list')
                this.captainListExcel();
            else if (this.reportId == "property_summary")
                this.propSummaryExcel();
            else if (this.reportId == "missing_payment_method")
                this.missingPayExcel();
            else if (this.reportId == "task_detail")
                this.taskDetailExcel();
            else
                this.exportTableToExcel('mytab', this.reportId);
        } else if (this.downloadOption == 'CSV') {
            if (this.reportId == "properties")
                this.propertyDownloadCSV();
            else
                this.exportToCsv(this.reportId + date + '.csv', this.downloadCSVArray);
        } else {
            var today = new Date();
            var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
            var fileName ="";
            if(this.reportId == "missing_payment_method")
            fileName = "missing_payment_method";
            else
            fileName = this.reportId;
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
            var docId = ""
            if (this.reportId == 'properties')
                docId = 'properties-pdf';
            else if (this.reportId == 'residents')
                docId = 'residents-pdf';
            else if (this.reportId == "feature_usage")
                docId = 'feature_usage-pdf';
            else if (this.reportId == "task_completion")
                docId = "task_completion-pdf";
            else if (this.reportId == "task_detail")
                docId = "task_detail-pdf";
            else if (this.reportId == 'incomplete_tasks')
                docId = 'incomplete_tasks-pdf'
            else if (this.reportId == "admin_users")
                docId = "admin_users-pdf";
            else if (this.reportId == "captain_list")
                docId = "captain_list-pdf";
            else if (this.reportId == "missing_payment_method")
                docId = "missing_payment_method-pdf";
            else if (this.reportId == "property_summary")
                docId = "property_summary-pdf";
            else if (this.reportId == 'payment_histories')
                docId = 'payment_histories-pdf';
            else
                docId = 'html-2-pdfwrapper';
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
                },
            );
        }
    }

    exportToCsv(filename: string, rows: object[]) {
        if (!rows || !rows.length) {
            return;
        }
        const separator = ',';
        const keys = Object.keys(rows[0]);
        const csvData =
            keys.join(separator) +
            '\n' +
            rows.map(row => {
                return keys.map(k => {
                    let cell = row[k] === null || row[k] === undefined ? '' : row[k];
                    cell = cell instanceof Date
                        ? cell.toLocaleString()
                        : cell.toString().replace(/"/g, '""');
                    if (cell.search(/("| |\n)/g) >= 0) {
                        cell = `"${cell}"`;
                    }
                    return cell;
                }).join(separator);
            }).join('\n');

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            if (link.download !== undefined) {
                // Browsers that support HTML5 download attribute
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    downloadExlFeature() {
        var finalExcel: any = [["Service_name", "Completion", "Service", '\"Property\"', '\"Region\"', 'Captains', 'Date']];
        // var finalExcel: any = [["Service", '\"Property\"', '\"Region\"', 'Captains', 'Date']];
        var arr = [];
        arr.push('\"Grocery Shopping\"', this.groceryCompletion.toString()+'%', '', '', '', '', '');
        finalExcel.push(arr);
        arr = [];
        arr.push('\"Flower Delivery\"', this.flowerCompletion.toString()+'%', '', '', '', '', '');
        finalExcel.push(arr);
        arr = [];
        arr.push('\"Rx Pick-Up\"', this.rxCompletion.toString()+'%', '', '', '', '', '');
        finalExcel.push(arr);
        arr = [];
        arr.push('\"OnQuest Clean\"', this.onquestCompletion.toString()+'%', '', '', '', '', '');
        finalExcel.push(arr);
        arr = [];
        arr.push('\"Package Pick-Up\"', this.packageCompletion.toString()+'%', '', '', '', '', '');
        finalExcel.push(arr);
        arr = [];
        arr.push('\"Laundry Drop-Off\"', this.laundrydropCompletion.toString()+'%', '', '', '', '', '');
        finalExcel.push(arr);
        arr = [];
        arr.push('\"Laundry Pick-Up\"', this.laundrypickCompletion.toString()+'%', '', '', '', '', '');
        finalExcel.push(arr);
        arr = [];
        this.allServicesFeature.map(item => {

            arr.push(
                '',
                '',
                '\"' + item.service_name + '\"',
                '\"' + item.property_name + '\"',
                '\"' + item.region + '\"',
                '\"' + item.captain + '\"',
                '\"' + item.created_at.slice(0, 10) + '\"',

            );
            finalExcel.push(arr);
            arr = [];
        });

        var lineArray = [];
        finalExcel.forEach(function (infoArray, index) {
            var line = infoArray.join(" \t");
            lineArray.push(index == 0 ? line : line);
        });
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var csvContent = lineArray.join("\r\n");
        var excel_file = document.createElement('a');
        excel_file.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csvContent));
        excel_file.setAttribute('download', this.reportId + date + '.xls');
        document.body.appendChild(excel_file);
        excel_file.click();
        document.body.removeChild(excel_file);
    }

    propertyDownloadCSV() {

        const arr = [];
        this.finalDetailArr.map(item => {
            var propName = "";
            var captainName = "";
            var serviceName = "";
            var regionalName = "";
            var basicName = "";
            if (item.captains[0]) {
                item.captains.map(itemC => {
                    captainName += itemC.first_name + ' ' + itemC.last_name+', ';
                })
            } else captainName = "Not Found";
            if (item.services[0]) {
                item.services.map(itemS => {
                    serviceName += itemS.service_name + ', ';
                })
            } else serviceName = "Not Found";

            if (item.Regional[0]) {
                item.Regional.map(itemR => {
                    regionalName += itemR.first_name + ' ' + itemR.last_name+', ';
                })
            } else regionalName = "Not Found";

            if (item.Basic[0]) {
                item.Basic.map(itemR => {
                    basicName += itemR.first_name + ' ' + itemR.last_name+', ';
                })
            } else basicName = "Not Found";
            arr.push({
                Property: item.property.property_name,
                '\"Management Company\"':item.property.management_company, 
                '\"Property Manager\"':item.property.property_manager!=null&&item.property.property_manager!=''?item.property.property_manager:'N/A',
                Captains: captainName,
                Service: serviceName,
                Regional_Admin: regionalName,
                Basic_User: basicName,

            });
        });
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        this.downloadCSVArray = arr;
        this.exportToCsv(this.reportId + date + '.csv', this.downloadCSVArray);
    }

    peropertyDownloadPDF() {
        var finalExcel: any = [["Property", '\"Management Company\"', '\"Property Manager\"', '\"Enabled Service\"', "Captains", '\"Regional Admin\"', '\"Basic Admin\"']];
        this.finalDetailArr.map((item, index) => {
            var tempArr = [];
            var propName = "";
            var propMgmtC = "";
            var propMgr = "N/A";
            var captainName = "";
            var serviceName = "";
            var regionalName = "";
            var basicName = "";

            propName = item.property.property_name;
            propMgmtC = item.property.management_company;
            if(item.property.property_manager!=''&&item.property.property_manager!=null)
            propMgr = item.property.property_manager;
            if (item.captains[0]) {
                item.captains.map(itemC => {
                    captainName += itemC.first_name + ', ' + itemC.last_name;
                })
            } else captainName = "Not Found";

            if (item.services[0]) {
                item.services.map(itemS => {
                    serviceName += itemS.service_name + ', ';
                })
            } else serviceName = "Not Found";

            if (item.Regional[0]) {
                item.Regional.map(itemR => {
                    regionalName += itemR.first_name + ', ' + itemR.last_name;
                })
            } else regionalName = "Not Found";

            if (item.Basic[0]) {
                item.Basic.map(itemR => {
                    basicName += itemR.first_name + ', ' + itemR.last_name;
                })
            } else basicName = "Not Found";
            tempArr.push('\"' + propName + '\"','\"' + propMgmtC + '\"','\"' + propMgr + '\"', '\"' + serviceName + '\"', '\"' + captainName + '\"', '\"' + regionalName + '\"', '\"' + basicName + '\"');
            finalExcel.push(tempArr);
        })
        var lineArray = [];
        finalExcel.forEach(function (infoArray, index) {
            var line = infoArray.join(" \t");
            lineArray.push(index == 0 ? line : line);
        });
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var csvContent = lineArray.join("\r\n");
        var excel_file = document.createElement('a');
        excel_file.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csvContent));
        excel_file.setAttribute('download', this.reportId + date + '.xls');
        document.body.appendChild(excel_file);
        excel_file.click();
        document.body.removeChild(excel_file);
    }

    exportTableToExcel(tableID, filename = '') {

        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var tableSelect = document.getElementById('mytab');
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        // Specify file name
        filename = filename ? (filename + date) + '.xls' : 'excel_data.xls';

        // Create download link element
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
    }

    getBuildingTasks(propertyCode) {

        // if (propertyCode == 4 || propertyCode == 5) {
        // }
        propertyCode = JSON.parse(localStorage.getItem('selectedProperty'));
        var allCaps = []
        let data = { 'property_code': "", 'captainId': '', 'service_day': '' };
        this.service.getAllCaptains().subscribe(res => {
            allCaps = res;
        });
        this.service.getAllServices(data).subscribe((response: any) => {
            var allServices = [];

            var endDateOld = new Date(localStorage.getItem('enddate'));
            var region = localStorage.getItem('region');
            endDateOld.setHours(0, 0, 0, 0);
            let endDate = Date.parse(endDateOld.toString());
            var startDateOld = new Date(localStorage.getItem('startdate'));
            startDateOld.setHours(0, 0, 0, 0);
            let startDate = Date.parse(startDateOld.toString());

            let index = 0;
            const servicesObject = response;
            for (let i = 0; i < servicesObject.length; i++) {
                const services = servicesObject[i];
                for (let j = 0; j < services.length; j++) {
                    if (propertyCode.find(ite => ite == services[j].building_code)) {
                        allServices[index] = services[j];
                        index++;
                    }
                }
            }
            if (endDate.toString() != 'Invalid Date' && startDate.toString() != 'Invalid Date' && endDate.toString() != 'NaN' && startDate.toString() != 'NaN') {
                allServices = allServices.filter(item => {
                    let createdDateOld = new Date(item.created_at);
                    createdDateOld.setHours(0, 0, 0, 0);
                    let createdDate = Date.parse(createdDateOld.toString());
                    if (createdDate <= endDate && createdDate >= startDate)
                        return item;
                });
            }
            let allGroceryCompleted = allServices.filter(item => item.service_name == "GROCERY SHOPPING" && item.service_completed == "true" && item.service_enable == "true");
            let allgrocery = allServices.filter(item => item.service_name == "GROCERY SHOPPING" && item.service_enable == "true");
            let allPackageCompleted = allServices.filter(item => item.service_name == "PACKAGE PICK-UP" && item.service_completed == "true" && item.service_enable == "true");
            let allpackage = allServices.filter(item => item.service_name == "PACKAGE PICK-UP" && item.service_enable == "true");
            let allOnQuestCompleted = allServices.filter(item => item.service_name == "ONQUEST CLEAN" && item.service_completed == "true" && item.service_enable == "true");
            let allonquest = allServices.filter(item => item.service_name == "ONQUEST CLEAN" && item.service_enable == "true");
            let allRxCompleted = allServices.filter(item => item.service_name == "RX PICK-UP" && item.service_completed == "true" && item.service_enable == "true");
            let allrx = allServices.filter(item => item.service_name == "RX PICK-UP" && item.service_enable == "true");
            let allFlowerCompleted = allServices.filter(item => item.service_name == "FLOWER DELIVERY" && item.service_completed == "true" && item.service_enable == "true");
            let allflower = allServices.filter(item => item.service_name == "FLOWER DELIVERY" && item.service_enable == "true");
            let allLaundryPickCompleted = allServices.filter(item => item.service_name == "LAUNDRY PICK-UP" && item.service_completed == "true" && item.service_enable == "true");
            let alllaundrypick = allServices.filter(item => item.service_name == "LAUNDRY PICK-UP" && item.service_enable == "true");
            let allLaundryDropCompleted = allServices.filter(item => item.service_name == "LAUNDRY DROP-OFF" && item.service_completed == "true" && item.service_enable == "true");
            let alllaundrydrop = allServices.filter(item => item.service_name == "LAUNDRY DROP-OFF" && item.service_enable == "true");
            
            if(allgrocery.length>0)
            this.groceryCompletion = Math.round((allGroceryCompleted.length / allgrocery.length) * 100);
            else
            this.groceryCompletion = 0;
            if(allpackage.length>0)
            this.packageCompletion = Math.round((allPackageCompleted.length / allpackage.length) * 100);
            else
            this.packageCompletion = 0;
            if(allonquest.length>0)
            this.onquestCompletion = Math.round((allOnQuestCompleted.length / allonquest.length) * 100);
            else
            this.onquestCompletion = 0;
            if(allflower.length>0)
            this.flowerCompletion = Math.round((allFlowerCompleted.length / allflower.length) * 100);
            else
            this.flowerCompletion = 0;
            if(alllaundrydrop.length>0)
            this.laundrydropCompletion = Math.round((allLaundryDropCompleted.length / alllaundrydrop.length) * 100);
            else
            this.laundrydropCompletion = 0;
            if(alllaundrypick.length>0)
            this.laundrypickCompletion = Math.round((allLaundryPickCompleted.length / alllaundrypick.length) * 100);
            else
            this.laundrypickCompletion = 0;
            if(allrx.length>0)
            this.rxCompletion = Math.round((allRxCompleted.length / allrx.length) * 100);
            else
            this.rxCompletion = 0;

            allServices.map(item => {
                let findCap = allCaps.find(itemC => item.assigned_captain_id == itemC.user_id);
                if (findCap)
                    this.allServicesFeature.push({ ...item, captain: findCap.first_name + " " + findCap.last_name });
                else
                    this.allServicesFeature.push({ ...item, captain: "Not Found" });
            });

            if (this.downloadOption == "CSV") {
                const arr = [];
                arr.push({ Service_name: '\"Grocery Shopping\"', Completion: this.groceryCompletion.toString()+'%', Service: '', Property: '', Region: '', Captains: '', Date: '' });
                arr.push({ Service_name: '\"Flower Delivery\"', Completion: this.flowerCompletion.toString()+'%', Service: '', Property: '', Region: '', Captains: '', Date: '' });
                arr.push({ Service_name: '\"Rx Pick-Up\"', Completion: this.rxCompletion.toString()+'%', Service: '', Property: '', Region: '', Captains: '', Date: '' });
                arr.push({ Service_name: '\"OnQuest Clean\"', Completion: this.onquestCompletion.toString()+'%', Service: '', Property: '', Region: '', Captains: '', Date: '' });
                arr.push({ Service_name: '\"Package Pick-Up\"', Completion: this.packageCompletion.toString()+'%', Service: '', Property: '', Region: '', Captains: '', Date: '' });
                arr.push({ Service_name: '\"Laundry Drop-Off\"', Completion: this.laundrydropCompletion.toString()+'%', Service: '', Property: '', Region: '', Captains: '', Date: '' });
                arr.push({ Service_name: '\"Laundry Pick-Up\"', Completion: this.laundrypickCompletion.toString()+'%', Service: '', Property: '', Region: '', Captains: '', Date: '' });
                this.allServicesFeature.map(item => {

                    arr.push({
                        Service_name:'',
                        Completion:'',
                        Service: '\"' + item.service_name + '\"',
                        Property: '\"' + item.property_name + '\"',
                        Region: '\"' + item.region + '\"',
                        Captains: '\"' + item.captain + '\"',
                        Date: '\"' + item.created_at.toString().slice(0, 10) + '\"',

                    });
                });
                this.downloadCSVArray = arr;

            }

            this.loader = false;
        });

    }
}
