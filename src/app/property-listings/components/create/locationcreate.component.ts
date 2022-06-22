import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import {CustomValidators} from "ngx-custom-validators";
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { NgForm } from '@angular/forms';
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
@Component({
    selector: 'app-location-create',
    templateUrl: './locationcreate.component.html',
    styleUrls: ['./locationcreate.component.css']
})

export class LocationCreateComponent implements OnInit {
    @ViewChild('form') userForm: NgForm;
    @ViewChild("placesRef") placesRef : GooglePlaceDirective;
    @ViewChild('enabSel') enableSel: MatSelect;
    @ViewChild('enabDay') enableDay: MatSelect;
    public form: FormGroup;
    showLoader = false;
    isError = false;
    alert = {};
    alertStatus = {'display': 'none'};
    times =[{time:'12 AM',value:'0'},{time:'1 AM',value:'1'},{time:'2 AM',value:'2'},{time:'3 AM',value:'3'},{time:'4 AM',value:'4'},{time:'5 AM',value:'5'},
    {time:'6 AM',value:'6'},{time:'7 AM',value:'7'},{time:'8 AM',value:'8'},{time:'9 AM',value:'9'},{time:'10 AM',value:'10'},
    {time:'11 AM',value:'11'},{time:'12 PM',value:'12'},{time:'1 PM',value:'13'},{time:'2 PM',value:'14'},{time:'3 PM',value:'15'},
    {time:'4 PM',value:'16'},{time:'5 PM',value:'17'},{time:'6 PM',value:'18'},{time:'7 PM',value:'19'},{time:'8 PM',value:'20'},
    {time:'9 PM',value:'21'},{time:'10 PM',value:'22'},{time:'11 PM',value:'23'}]
    selectedDay = [];
    fitness_service=[];
    allselectedService = false;
    allselectedDay = false;
    selectedServices='';
    constructor(private fb: FormBuilder , private service: LocationService, private router: Router) { }
    ngOnInit() {
      $('.page-title').text('Create Property');
      this.getAllServices();
        this.form = this.fb.group({
            property_name: [
                null,
                Validators.compose([
                    Validators.required,
                ])
            ],
            property_phone: [
                null
            ],
            property_email: [
                null
            ],
            property_manager: [
                null
            ],
            asst_property_manager: [
                null
            ],
            leasing_manager: [
                null
            ],
            leasing_team: [
                null
            ],
            front_desk_concierge: [
                null
            ],
            property_code: [
                null,
                Validators.compose([
                    Validators.required,
                ])
            ],
            management_company: [
                null,
                Validators.compose([
                    Validators.required,
                ])
            ],
            address_line1: [
                null,
                Validators.compose([
                    Validators.required,
                ])
            ],
            address_line2: [
                null,
            ],
            address_city: [
                null,
                Validators.compose([
                    Validators.required,
                ])
            ],
            address_zip: [
                null,
                Validators.compose([
                    Validators.required,
                ])
            ],
            service_day: [
                null
            ],
            fitness_service: [
                null
            ],
            region: [
                null
            ],
            cutt_off_time:[
                null,
                Validators.compose([
                    Validators.required,
                ])
            ],
            set_up_time:[
                null,
                Validators.compose([
                    Validators.required,
                ])
            ]


        });
    }
    getAllServices() {
        this.service.getAllServices().subscribe((response: any) => {
            response.map((item,index)=>{
                this.fitness_service.push({value:index,service:item.service_name,id:item.id, type: item.service_type});
            });
        });
    }
    cityChange(address: Address){
        console.log(address);
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
    }
    toggleAllSelectionDay() {
        this.allselectedDay = !this.allselectedDay;  // to control select-unselect
    
        if (this.allselectedDay) {
          this.enableDay.options.forEach((item: MatOption) => item.select());
            const index = this.selectedDay.indexOf("All");
            this.selectedDay.splice(index,1);
        } else {
          this.enableDay.options.forEach((item: MatOption) => { item.deselect() });
        }
    }
    onSubmit () {
        this.showLoader=true;
        let formData = this.form.value;
        this.form.value.address_city = jQuery('#city_places').val();
        this.form.value.address_line1 = jQuery('#adrs1_places').val();
        this.form.value.address_line2 = jQuery('#adrs2_places').val();
        let phone = "+1"+this.form.value.property_phone;
        var fitness = undefined;
        var restrictedService = [];
        var enabledService = [];
        var findFitness1 = undefined;
        var findFitness2 = undefined;
        var alc = false;
        fitness = this.form.value.fitness_service;
    
        if(fitness){
            findFitness1 = fitness?.find(item => item.id==22);
            findFitness2 = fitness?.find(item => item.id==23);
        }

        delete this.form.value.fitness_service;
         if(fitness!=undefined){

                    this.fitness_service.map((item,index)=> {
                        var findMatch = fitness?.find(item => item==index.toString());
                        if(findMatch==undefined){
                            restrictedService.push(item);
                        }else{
                            enabledService.push(item);
                        }
                    });
                }else{
                    restrictedService = this.fitness_service;
                }
                var findAlc = enabledService.find(item => (item.type=="mainService"&& item.service!=="A LA CARTE"&& item.service!=="FITNESS SERVICE RESIDENT PAID"&&item.service!=="FITNESS SERVICE PROPERTY PAID")||item.type=="errandService"||item.type=="laundryService");
                if(findAlc==undefined)
                    alc= true;
                else
                    alc=false;
                
                
                this.service.createLocation({...this.form.value,address_line2:'',property_phone:phone , alc_building:alc,service_day: this.selectedDay.toString(),fitness_package_1: findFitness1!=undefined?"true":"false",fitness_package_2: findFitness2!=undefined?"true":"false"}).subscribe((response) => {
            
            if(response[0]){
                // if(fitness!=undefined){                    
                //     this.fitness_service.map((item,index)=> {
                //         var findMatch = fitness.find(item => item==index.toString());
                //         if(findMatch==undefined){
                //             restrictedService.push(item);
                //         }
                //     });
                // }else{
                //     restrictedService = this.fitness_service;
                // }

                restrictedService.map(item=> {
                    var data = {
                        'service_id': item.id,
                        'service_restriction_type_id': '3',
                        'criteria' : this.form.value.property_code
                    }
                    this.service.createRestrictedS(data).subscribe(res=>{
                        console.log(res);
                        
                    });
                    
                });

                this.showLoader = false;
                this.alert = {
                    message:  'Created successfully',
                    type: 'success'
                };
                this.alertStatus = {'display': 'block'};
                this.router.navigate(['/properties']).then(()=>{
                    setTimeout(() => {
                        window.location.reload();
                     }, 2000);
                });
            }
        });
    }

}
