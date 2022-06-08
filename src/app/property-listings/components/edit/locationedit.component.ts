import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { find } from 'rxjs/operators';
import { LocationService } from '../../services/location.service';

@Component({
    selector: 'app-location-edit',
    templateUrl: './locationedit.component.html',
    styleUrls: ['./locationedit.component.css']
})

export class LocationEditComponent implements OnInit {
    @ViewChild('form') locationForm: NgForm;
    @ViewChild('enabSel') enableSel: MatSelect;
    @ViewChild('enabDay') enableDay: MatSelect;
    showLoader = false;
    isError = false;
    allselectedService = false;
    allselectedDay = false;
    alert = {};
    location = {
        address_city: '',
        address_line1: '',
        address_line2: '',
        address_zip: '',
        cutt_off_time:'',
        set_up_time:'',
        asst_property_manager: '',
        building_id: null,
        front_desk_concierge: '',
        leasing_manager: '',
        leasing_team: '',
        property_code: '',
        property_name: '',
        property_email: '',
        property_manager: '',
        property_phone: '',
        management_company: '',
        region: '',
        service_day: [],
        fitness_package_1: '',
        fitness_package_2: '',
        fitness_service: ''
    };
    services = [];
    services_enable = [];
    services_enable_old = [];
    fitness_services = [];
    fitness_service = [];
    allRestrictedServices = [];
    times =[{time:'12 AM',value:'0'},{time:'1 AM',value:'1'},{time:'2 AM',value:'2'},{time:'3 AM',value:'3'},{time:'4 AM',value:'4'},{time:'5 AM',value:'5'},
    {time:'6 AM',value:'6'},{time:'7 AM',value:'7'},{time:'8 AM',value:'8'},{time:'9 AM',value:'9'},{time:'10 AM',value:'10'},
    {time:'11 AM',value:'11'},{time:'12 PM',value:'12'},{time:'1 PM',value:'13'},{time:'2 PM',value:'14'},{time:'3 PM',value:'15'},
    {time:'4 PM',value:'16'},{time:'5 PM',value:'17'},{time:'6 PM',value:'18'},{time:'7 PM',value:'19'},{time:'8 PM',value:'20'},
    {time:'9 PM',value:'21'},{time:'10 PM',value:'22'},{time:'11 PM',value:'23'}]
    alertStatus = { 'display': 'none' };
    constructor(private service: LocationService, private route: ActivatedRoute, private router: Router, public snackBar: MatSnackBar) { }
    ngOnInit() {
      $('.page-title').text('Edit Property');
      const id = this.route.snapshot.params.id;
        this.service.getLocation(id).subscribe((response: any) => {
            console.log(response);
            this.location = {...response,property_phone:response.property_phone.replace("+1","")};
            this.location.service_day = response.service_day.split(',');
            let sdays = ['1','2','3','4','5','6','7'];
            let findEvery = sdays.every(item => this.location.service_day.find(ite=> ite==item));
            if(findEvery){
                this.enableDay.options.forEach((item: MatOption) => {
                    
                      item.select();
                  });
            }
            // this.fitness_service = this.fitness_services.split(',');
            //     if(response.fitness_package_1!="true"){
            //         this.fitness_service.splice(0,1);
            //     }
            //     if(response.fitness_package_2!="true"){
            //         this.fitness_service.splice(1,1);
            //     }

            console.log(this.location.service_day);
        });
        this.getAllServices();

    }

    getAllServices() {

        this.service.getAllServices().subscribe((response: any) => {
            console.log(response);
            response.map((item, index) => {
                this.services.push({ value: index, service: item.service_name, id: item.id, type: item.service_type });
            });
            console.log(this.services);
            
            this.getRestrictedServices();
        });

    }


    onChange(){
        this.allselectedService=false;
        this.enableSel.options.forEach((item: MatOption) => {
          if (item.value == 'All')
            item.deselect()
        });
    }
    onChangeDay(){
        this.allselectedDay=false;
        this.enableDay.options.forEach((item: MatOption) => {
          if (item.value == 'All')
            item.deselect()
        });
    }
    toggleAllSelection() {
        this.allselectedService = !this.allselectedService;  // to control select-unselect
    
        if (this.allselectedService) {
          this.enableSel.options.forEach((item: MatOption) => item.select());
          
        } else {
          this.enableSel.options.forEach((item: MatOption) => { item.deselect() });
        }
        console.log(this.fitness_service);
        console.log(this.enableSel);
    
    }
    toggleAllSelectionDay() {
        this.allselectedDay = !this.allselectedDay;  // to control select-unselect
    
        if (this.allselectedDay) {
          this.enableDay.options.forEach((item: MatOption) => item.select());
            // const index = this.selectedDay.indexOf("All");
            // this.selectedDay.splice(index,1);
        } else {
          this.enableDay.options.forEach((item: MatOption) => { item.deselect() });
        }
        // console.log(this.selectedDay);
        console.log(this.enableDay);
    
    }

    getRestrictedServices() {

        var enableService = "";
        this.service.getAllRestrictedService().subscribe((response: any) => {
            var findallRestrictedService = response.filter(item => item.criteria == this.location.property_code);
            console.log(findallRestrictedService);
            this.allRestrictedServices = findallRestrictedService;
            this.services.map(itemR => {
                var findRestrictedService = findallRestrictedService.find(item => itemR.id == item.service_id);
                if (findRestrictedService == undefined)
                    if (enableService.length == 0)
                        enableService = itemR.id.toString();
                    else
                        enableService = enableService + ',' + itemR.id.toString();

            })
            this.services_enable = enableService.split(',');
            let findEvery = this.services.every(item => this.services_enable.find(ite=>ite==item.id))
            if(findEvery){
                this.enableSel.options.forEach((item: MatOption) => {
                      item.select()
                  });
            }
            this.services_enable_old = this.services_enable;
            console.log(this.services_enable);
            console.log(enableService);


        });
    }

    onSubmit() {

        this.showLoader = true;
        var alc = false;
        var enableService = [];
        var allServicesUnRestricted = this.locationForm.value.services;
        this.locationForm.value.address_city = jQuery('#city_places').val();
        this.locationForm.value.address_line1 = jQuery('#adrs1_places').val();
        this.locationForm.value.address_line2 = jQuery('#adrs2_places').val();
        var findfitness1 = allServicesUnRestricted.find(item => item == "22");
        var findfitness2 = allServicesUnRestricted.find(item => item == "23");
        console.log(allServicesUnRestricted);
        console.log(this.locationForm.value);
        console.log(findfitness1);
        console.log(findfitness2);
        let phone = "+1"+this.locationForm.value.property_phone;

        allServicesUnRestricted.map(item=> {
            var findMatch = this.services.find(it=> it.id.toString()==item);
                if(findMatch){
                    
                        enableService.push(findMatch);
                    
                }
        })
        var findAlc = enableService.find(item => (item.type=="mainService"&& item.service!=="A LA CARTE"&& item.service!=="FITNESS SERVICE RESIDENT PAID"&&item.service!=="FITNESS SERVICE PROPERTY PAID")||item.type=="errandService"||item.type=="laundryService");
                if(findAlc==undefined)
                    alc= true;
                else
                    alc=false;
        console.log(alc);
        
        delete this.locationForm.value.services;


        this.service.updateLocation({building_id: this.location.building_id, ...this.locationForm.value, address_line2:this.location.address_line2,property_phone:phone,fitness_package_1: findfitness1!=undefined?"true":"false", fitness_package_2: findfitness2!=undefined?"true":"false", service_day: this.location.service_day.toString(), alc_building:alc}).subscribe((response) => {
            this.showLoader = false;
            // this.alert = {
            //     message:  'Edit successfully',
            //     type: 'success'
            // };
            // this.alertStatus = {'display': 'block'};
            if (response) {
                console.log(response);
                if (allServicesUnRestricted.length > this.services_enable_old.length) {
                    console.log('enabled');
                    var unrestricServiceID=[];
                    allServicesUnRestricted.map(itemR => {
                        var findNewService = this.services_enable_old.find(item => item == itemR);
                        
                        if (findNewService==undefined){
                            unrestricServiceID.push(itemR);
                        }
                    });
                    console.log("unrestricServiceID");
                    console.log(unrestricServiceID);
                    unrestricServiceID.map(itemR=>{
                        var unrestricServiceDeleteID = this.allRestrictedServices.find(item => item.service_id.toString() == itemR);
                        console.log(unrestricServiceDeleteID);
                        if(unrestricServiceDeleteID)
                        this.service.deleteRestrictionS(unrestricServiceDeleteID.id).subscribe(res => {
        
                        });
                    });
        
                } else if (allServicesUnRestricted.length < this.services_enable_old.length) {
                    console.log('restrict');
                    var restricServiceID=[];
                    this.services_enable_old.map(itemR => {
                        var findNewService = allServicesUnRestricted.find(item => item == itemR);
                        if (findNewService == undefined)
                            restricServiceID.push(itemR);
                    });
                    console.log(restricServiceID);
                    restricServiceID.map(itemR=>{
                        var data = {
                            'service_id': itemR,
                            'service_restriction_type_id': '3',
                            'criteria': this.locationForm.value.property_code
                        }
                        this.service.createRestrictedS(data).subscribe(res => {
                            console.log(res);
        
                        });
                    });
        
                }

                this.openSnackBar( 'Updated successfully', '');
            } else {
                this.isError = true;
            }
        });

    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 5000
        });
        this.router.navigate(['/properties/']).then(()=>{
            setTimeout(() => {
                console.log("Hello from setTimeout");
                window.location.reload();
             }, 2000);
        });
    }
    btnClick() {
        this.router.navigate(['/locations']);
    }

}
