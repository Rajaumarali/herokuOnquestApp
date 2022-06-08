import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ResidentService } from '../../services/resident.service';
import { MatDialog } from '@angular/material/dialog';
import { MailComponent } from "../../../common/component/mail.component";
import { SMSComponent } from '../../../common/component/sms.component';
import { GrocerylistComponent } from '../../../common/component/grocerylist.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-location-edit',
    templateUrl: './residentview.component.html',
    styleUrls: ['./residentview.component.css']
})

export class ResidentviewComponent implements OnInit {

    @ViewChild('form') profileForm: NgForm;
    paginatorGro: MatPaginator;
    paginatorFlo: MatPaginator;
    paginatorRx: MatPaginator;
    paginatorLP: MatPaginator;
    paginatorLD: MatPaginator;
    paginatorPack: MatPaginator;
    paginatorOC: MatPaginator;
    sortRx: MatSort;
    sortGro: MatSort;
    sortFlo: MatSort;
    sortLP: MatSort;
    sortLD: MatSort;
    sortPack: MatSort;
    sortOC: MatSort;
    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sortGro = ms;
        this.setDataSourceAttributes();
    }
    @ViewChild(MatSort) set matSortFlo(ms: MatSort) {
        this.sortFlo = ms;
        this.setDataSourceAttributesFlo();
    }
    @ViewChild(MatSort) set matSortRx(ms: MatSort) {
        this.sortRx = ms;
        this.setDataSourceAttributesRx();
    }
    @ViewChild(MatSort) set matSortLP(ms: MatSort) {
        this.sortLP = ms;
        this.setDataSourceAttributesLP();
    }
    @ViewChild(MatSort) set matSortLD(ms: MatSort) {
        this.sortLD = ms;
        this.setDataSourceAttributesLD();
    }
    @ViewChild(MatSort) set matSortOC(ms: MatSort) {
        this.sortOC = ms;
        this.setDataSourceAttributesOC();
    }
    @ViewChild(MatSort) set matSortPack(ms: MatSort) {
        this.sortPack = ms;
        this.setDataSourceAttributesPack();
    }

    @ViewChild(MatPaginator) set matPaginatorFlo(mp: MatPaginator) {
        this.paginatorFlo = mp;
        this.setDataSourceAttributesFlo();
    }
    @ViewChild(MatPaginator) set matPaginatorGro(mp: MatPaginator) {
        this.paginatorGro = mp;
        this.setDataSourceAttributes();
    }
    @ViewChild(MatPaginator) set matPaginatorRx(mp: MatPaginator) {
        this.paginatorRx = mp;
        this.setDataSourceAttributesRx();
    }
    @ViewChild(MatPaginator) set matPaginatorOC(mp: MatPaginator) {
        this.paginatorOC = mp;
        this.setDataSourceAttributesOC();
    }
    @ViewChild(MatPaginator) set matPaginatorLP(mp: MatPaginator) {
        this.paginatorLP = mp;
        this.setDataSourceAttributesLP();
    }
    @ViewChild(MatPaginator) set matPaginatorLD(mp: MatPaginator) {
        this.paginatorLD = mp;
        this.setDataSourceAttributesLD();
    }
    @ViewChild(MatPaginator) set matPaginatorPack(mp: MatPaginator) {
        this.paginatorPack = mp;
        this.setDataSourceAttributesPack();
    }

    displayedColumnsGro = ['first_name', 'property_name', 'unit_number', 'user_profile_service_day', 'email', 'phone'];
    displayedColumnsFlo = ['first_name', 'property_name', 'unit_number', 'user_profile_service_day', 'email', 'phone'];
    displayedColumnsRx = ['first_name', 'property_name', 'unit_number', 'user_profile_service_day', 'email', 'phone'];
    displayedColumnsL = ['first_name', 'property_name', 'unit_number', 'user_profile_service_day', 'email', 'phone'];
    displayedColumnsPack = ['first_name', 'property_name', 'unit_number', 'user_profile_service_day', 'email', 'phone'];
    displayedColumnsOC = ['first_name', 'property_name', 'unit_number', 'user_profile_service_day', 'email', 'phone'];
    dataSourceGro: MatTableDataSource<any>;
    dataSourceFlo: MatTableDataSource<any>;
    dataSourceRx: MatTableDataSource<any>;
    dataSourceLD: MatTableDataSource<any>;
    dataSourceLP: MatTableDataSource<any>;
    dataSourcePack: MatTableDataSource<any>;
    dataSourceOC: MatTableDataSource<any>;
    allGorceryServ=[];
    allCleanServ=[];
    allFlowerServ=[];
    allRxServ=[];
    allLaundryPickServ=[];
    allLaundryDropServ=[];
    allPackServ=[];
    isError = false;
    showLoader = false;
    fileData: File = null;
    previewUrl: any = null;
    uploadedFilePath: string = null;
    user_id = null;
    alert = {};
    allNotes: any;
    userService = [];
    groceryService = [];
    petFlag = false;
    laundryPickService = [];
    laundryDropService = [];
    housekeepingService = [];
    rxService = [];
    flowerDeliveryService = [];
    onquestService = [];
    packageService = [];
    petProfiles: any = [];
    houseKeeping: any = [];
    rxPickup: any = [];
    allList: any = [];
    note: any;

    groceryShoping: any = [];
    groceryPayment: any = [];
    flowerPayment: any = [];
    rxPayment: any = [];
    user: any = [];
    residentNotes: any;
    noteUpdate = false;
    userObject: any;
    constructor(private dom: DomSanitizer, public dialog: MatDialog, breakpointObserver: BreakpointObserver, private service: AuthService, private route: ActivatedRoute, private router: Router, private residentService: ResidentService) {
        breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
            this.displayedColumnsFlo = result.matches ?
                ['service_completed', 'responsible_party', 'is_paid', 'user_profile_service_day', 'created_at'] :
                ['service_completed', 'responsible_party', 'is_paid', 'user_profile_service_day', 'created_at'];
            this.displayedColumnsGro = result.matches ?
                ['listname', 'service_completed', 'responsible_party', 'is_paid', 'user_profile_service_day', 'created_at'] :
                ['listname', 'service_completed', 'responsible_party', 'is_paid', 'user_profile_service_day', 'created_at'];
            this.displayedColumnsL = result.matches ?
                ['number_of_items', 'service_completed', 'responsible_party', 'user_profile_service_day', 'created_at'] :
                ['number_of_items', 'service_completed', 'responsible_party', 'user_profile_service_day', 'created_at'];
            this.displayedColumnsRx = result.matches ?
                ['name_of_prescription', 'service_completed', 'responsible_party', 'is_paid', 'user_profile_service_day', 'created_at'] :
                ['name_of_prescription', 'service_completed', 'responsible_party', 'is_paid', 'user_profile_service_day', 'created_at'];
            this.displayedColumnsPack = result.matches ?
                ['number_of_packages', 'service_completed', 'responsible_party', 'user_profile_service_day', 'created_at'] :
                ['number_of_packages', 'service_completed', 'responsible_party', 'user_profile_service_day', 'created_at'];
            this.displayedColumnsOC = result.matches ?
                ['service_completed', 'responsible_party', 'user_profile_service_day', 'created_at'] :
                ['service_completed', 'responsible_party', 'user_profile_service_day', 'created_at'];

        });

    }
    setDataSourceAttributes() {
        this.dataSourceGro.paginator = this.paginatorGro;
        this.dataSourceGro.sort = this.sortGro;
    }
    setDataSourceAttributesFlo() {
        this.dataSourceFlo.paginator = this.paginatorFlo;
        this.dataSourceFlo.sort = this.sortFlo;
    }
    setDataSourceAttributesRx() {
        this.dataSourceRx.paginator = this.paginatorRx;
        this.dataSourceRx.sort = this.sortRx;
    }
    setDataSourceAttributesOC() {
        this.dataSourceOC.paginator = this.paginatorOC;
        this.dataSourceOC.sort = this.sortOC;
    }
    setDataSourceAttributesPack() {
        this.dataSourcePack.paginator = this.paginatorPack;
        this.dataSourcePack.sort = this.sortPack;
    }
    setDataSourceAttributesLD() {
        this.dataSourceLD.paginator = this.paginatorLD;
        this.dataSourceLD.sort = this.sortLD;
    }
    setDataSourceAttributesLP() {
        this.dataSourceLP.paginator = this.paginatorLP;
        this.dataSourceLP.sort = this.sortLP;
    }
    ngOnInit() {
        this.userObject = JSON.parse(localStorage.getItem('user'));
        this.user_id = this.route.snapshot.params.id;
        $('.page-title').text('View Resident');
        this.getNotes(this.user_id);

        this.residentService.getAllUserprofile(this.user_id).subscribe((response) => {

            if (response.pet_profile[0] !== undefined)
                this.petProfiles = response.pet_profile;
            if (response.house_keeping[0] !== undefined)
                this.houseKeeping = response.house_keeping[0];
            if (response.rx_pickup[0] !== undefined)
                this.rxPickup = response.rx_pickup[0];
            if (response.grocery_shoping[0] !== undefined)
                this.groceryShoping = { ...response.grocery_shoping[0], prefered_brand_photos: JSON.parse(response.grocery_shoping[0].prefered_brand_photos), not_prefered_brand_photos: JSON.parse(response.grocery_shoping[0].not_prefered_brand_photos) };

        });

        this.service.getUserProfile(this.user_id).subscribe((response) => {
            this.user = { ...response, phone: response.phone.replace("+1", "") };
            this.service.getUserProfile(response.assigned_captain_id).subscribe((respC) => {
                this.user = { ...this.user, captain: respC.first_name + " " + respC.last_name }
            })
            let data = {
                'property_code': this.user.building_id,
                'captainId': "",
                'service_day': ""
            }
            this.residentService.getAllServiceByLocation(data).subscribe((response) => {
                let index = 0;
                for (let i = 0; i < response.length; i++) {
                    for (let j = 0; j < response[i].length; j++) {
                        if (response[i][j]['user_id'] == this.user_id) {
                            this.userService[index] = response[i][j];
                            index++;
                        }
                    }
                }


                

                this.residentService.getGroceryPayment(this.user_id).subscribe(res => {
                    if (res.response) {
                        var gro = 0;
                        res.response.map((item, index) => {
                            if (item.is_paid == 1) {
                                item.payment_invoice = JSON.parse(item.payment_invoice);
                                this.groceryPayment.push({ key: gro, item: item });
                                gro++;
                            }
                        });
                        console.log("groceryPayment");
                        console.log(this.groceryPayment);

                    }
                    console.log("response");
                    console.log(res);
                });

                this.residentService.getFlowerPayment(this.user_id).subscribe(res => {
                    if (res.response) {
                        var flower = 0;
                        res.response.map((item, index) => {
                            if (item.is_paid == 1) {
                                item.payment_invoice = JSON.parse(item.payment_invoice);
                                this.flowerPayment.push({ key: flower, item: item });
                                flower++;
                            }
                        });
                        console.log("flowerPayment");
                        console.log(this.flowerPayment);

                    }
                    console.log("response");
                    console.log(res);
                });
                this.residentService.getRxPayment(this.user_id).subscribe(res => {
                    if (res.response) {
                        var rx = 0;
                        res.response.map((item, index) => {
                            if (item.is_paid == 1) {
                                item.payment_invoice = JSON.parse(item.payment_invoice);
                                this.rxPayment.push({ key: rx, item: item });
                                rx++;
                            }
                        });
                        console.log("rxPayment");
                        console.log(this.rxPayment);

                    }
                    console.log("response");
                    console.log(res);
                });

                this.flowerDeliveryService = this.userService.filter(item => item.service_name == "FLOWER DELIVERY");
                this.groceryService = this.userService.filter(item => item.service_name == "GROCERY SHOPPING");
                this.groceryService.map(item => {
                    this.residentService.getGroceryListById(item.list_id).subscribe(res => {

                        this.allList.push({ id: item.list_id, res: res.filter(it => it.item_type == 'inventoryItem') });
                    })
                })
                console.log(this.allList);
                this.laundryPickService = this.userService.filter(item => item.service_name == "LAUNDRY PICK-UP");
                this.laundryDropService = this.userService.filter(item => item.service_name == "LAUNDRY DROP-OFF");
                this.rxService = this.userService.filter(item => item.service_name == "RX PICK-UP");
                this.onquestService = this.userService.filter(item => item.service_name == "ONQUEST CLEAN");
                this.packageService = this.userService.filter(item => item.service_name == "PACKAGE PICK-UP");

                this.dataSourceGro = new MatTableDataSource<any>(this.groceryService);


                this.dataSourceFlo = new MatTableDataSource<any>(this.flowerDeliveryService);


                this.dataSourceRx = new MatTableDataSource<any>(this.rxService);
                setTimeout(() => {
                    this.dataSourceRx.paginator = this.paginatorRx
                    this.dataSourceRx.sort = this.sortRx;
                });

                this.dataSourceLD = new MatTableDataSource<any>(this.laundryDropService);
                setTimeout(() => {
                    this.dataSourceLD.paginator = this.paginatorLD
                    this.dataSourceLD.sort = this.sortLD;
                });

                this.dataSourceLP = new MatTableDataSource<any>(this.laundryPickService);
                setTimeout(() => {
                    this.dataSourceLP.paginator = this.paginatorLP
                    this.dataSourceLP.sort = this.sortLP;
                });

                this.dataSourcePack = new MatTableDataSource<any>(this.packageService);
                setTimeout(() => {
                    this.dataSourcePack.paginator = this.paginatorPack
                    this.dataSourcePack.sort = this.sortPack;
                });

                this.dataSourceOC = new MatTableDataSource<any>(this.onquestService);
                setTimeout(() => {
                    this.dataSourceOC.paginator = this.paginatorOC
                    this.dataSourceOC.sort = this.sortOC;
                });




                setTimeout(() => {
                    this.dataSourceGro.paginator = this.paginatorGro
                    this.dataSourceGro.sort = this.sortGro;
                });
                setTimeout(() => {
                    this.dataSourceFlo.paginator = this.paginatorFlo
                    this.dataSourceFlo.sort = this.sortFlo;
                });
                console.log(this.groceryService);
            });
        });


    }

    getImage(image) {
        console.log(image);
        try {
            return (this.dom.bypassSecurityTrustResourceUrl(JSON.parse(image)));
        } catch {
            return (this.dom.bypassSecurityTrustResourceUrl(image));
        }
    }

    openGroceryTask(item) {
        item = { ...item, service_name: "GROCERY SHOPPING", list_id: item.id, first_name: this.user.first_name, last_name: this.user.last_name, unit_number: this.user.unit_number, email: this.user.email, property_name: this.user.property_name, phone: this.user.phone };
        localStorage.setItem('task', JSON.stringify(item));
        this.router.navigate(['/tasks/' + 1 + '/view']);


    }
    openRXTask(item) {
        item = { ...item, service_name: "RX PICK-UP", first_name: this.user.first_name, last_name: this.user.last_name, unit_number: this.user.unit_number, email: this.user.email, property_name: this.user.property_name, phone: this.user.phone };
        localStorage.setItem('task', JSON.stringify(item));
        this.router.navigate(['/tasks/' + 1 + '/view']);
        console.log(item);

    }
    openFlowerTask(item) {
        item = { ...item, service_name: "FLOWER DELIVERY", first_name: this.user.first_name, last_name: this.user.last_name, unit_number: this.user.unit_number, email: this.user.email, property_name: this.user.property_name, phone: this.user.phone };
        localStorage.setItem('task', JSON.stringify(item));
        this.router.navigate(['/tasks/' + 1 + '/view']);
        console.log(item);

    }
    parseJson(jsonString) {
        return JSON.parse(jsonString);
    }
    sendEmail(fname, lname, email): void {
        const dialogRef = this.dialog.open(MailComponent, {
            width: '400px',
            data: { fname: fname, lname: lname, email: email, service: this.service }
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }
    getPhone = function (phone) {
        if (phone != null) {
            phone = phone.replace("+1", "");
            phone = phone.replace("+92", "");
            return phone.replace(/^(\d{3})(\d{3})/, "$1-$2-");
        }
        return "N/A";
    };
    openImage(image) {
        console.log(image);

        var modal = document.getElementById("myModal");
        var modalImg: any;
        modalImg = document.getElementById("img01");

        modal.style.display = "block";
        try {
            modalImg.src = JSON.parse(image);
        }
        catch {
            modalImg.src = image;
        }


    }
    closeModal() {
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
    }
    sendSMS(fname, lname, phone, user_id): void {
        const dialogRef = this.dialog.open(SMSComponent, {
            width: '400px',
            data: { name: fname + ' ' + lname, phone: phone, user_id: user_id, service: this.service }
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }
    openList(id): void {
        const dialogRef = this.dialog.open(GrocerylistComponent, {
            width: '80vw',
            data: { service: this.service, id: id }
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }
    getMessageLogs(user_id,fname,lname) {
        localStorage.setItem('messageUser',fname+' '+lname);
        this.router.navigate(['/residents/' + user_id + '/messageLogs']);
    }

    editResident() {
        this.router.navigate(['/residents/' + this.user_id + '/edit']);
    }

    getNotes(user_id) {
        this.residentService.getNotes(this.user_id).subscribe((user) => {
            this.allNotes = user;
        });
    }
    saveNotes() {
        this.showLoader = true;
        let date = new Date();
        let residentNote = {
            "user_id": this.user_id,
            "captain_id": this.userObject.user_id,
            "concierage_captain_image": this.userObject.profile_picture_url,
            "name": this.userObject.first_name + " " + this.userObject.last_name,
            "note": this.residentNotes,
            "created_at": date
        }
        this.residentService.saveNotes(residentNote).subscribe((user) => {
            this.allNotes = user;
            this.residentNotes = "";
            this.showLoader = false;
        });
    }
    editNote(notes) {
        this.note = notes
        this.noteUpdate = true;
        this.residentNotes = notes.note;
    }
    updateNotes() {
        this.showLoader = true;
        this.note.note = this.residentNotes;
        this.residentService.updateNotes(this.note).subscribe((user) => {
            this.residentNotes = "";
            this.allNotes = user;
            this.showLoader = false;
            this.noteUpdate = false;
        });
    }
    openTaskDetail(row) {
        localStorage.setItem('task', JSON.stringify(row));
        this.router.navigate(['/tasks/' + 1 + '/view']);
    }
    deleteNote(note) {
        this.showLoader = true;
        this.residentService.deleteNotes(note).subscribe((user) => {
            this.residentNotes = "";
            this.allNotes = user;
            this.showLoader = false;
        });
    }
    cancelNotes() {
        this.noteUpdate = false;
        this.residentNotes = "";
    }
}

