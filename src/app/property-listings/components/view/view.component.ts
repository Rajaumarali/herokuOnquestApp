import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  showLoader = false;
  task_id = '';
  taskDetail: any = {};
  services = [];
  task: any = {};
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
    service_day: '',
    fitness_package_1: '',
    fitness_package_2: '',
    fitness_service: ''
};
  allRestrictedServices = [];
  services_enable: any;
  services_enable_old = [];
  constructor(private service: LocationService, public dialog: MatDialog, private router: Router  , private route: ActivatedRoute) { }
  ngOnInit() {
    $('.page-title').text('View Property');
    this.showLoader = true;
    this.task_id = this.route.snapshot.params.id;
    // this.taskDetail = JSON.parse(localStorage.getItem('tasklist'))[this.task_id];
    this.taskDetail = JSON.parse(localStorage.getItem('task'));
    this.service.getLocation(this.taskDetail.property_code).subscribe((response: any) => {
        this.location = response
        this.getAllServices();
    });
    var sDays = this.taskDetail.service_day.split(",");
    var day ="";
    sDays.map(item=>{
      if(item==1)
        day = day+"Monday, ";
      else if(item==2)
        day = day+"Tuesday, ";
      else if(item==3)
        day = day+"Wednesday, ";
      else if(item==4)
        day = day+"Thursday, ";
      else if(item==5)
        day = day+"Friday, ";
      else if(item==6)
        day = day+"Saturday, ";
      else if(item==7)
        day = day+"Sunday";
    })
    this.taskDetail.service_day = day.replace(/,\s*$/, "");
    console.log(JSON.parse(localStorage.getItem('task')));
    
  }
  getPhone = function(phone){
    if(phone!=null){
        phone = phone.replace("+1","");
        phone = phone.replace("+92","");
        return phone.replace(/^(\d{3})(\d{3})/, "$1-$2-");
        }
        return "N/A";
};

  editProperty(propCode){
    this.router.navigate(['/properties/' + propCode + '/edit']);
  }

  getAllServices() {

    this.service.getAllServices().subscribe((response: any) => {
        response.map((item, index) => {
            this.services.push({ value: index, service: item.service_name, id: item.id, type: item.service_type });
        });
        this.getRestrictedServices();
    });

}

  getRestrictedServices() {

    var enableService = [];
    this.service.getAllRestrictedService().subscribe((response: any) => {
        var findallRestrictedService = response.filter(item => item.criteria == this.location.property_code);
        this.allRestrictedServices = findallRestrictedService;
        this.services.map(itemR => {
            var findRestrictedService = findallRestrictedService.find(item => itemR.id == item.service_id);
            if (findRestrictedService == undefined)
                    enableService.push(itemR.service);

        })
        this.services_enable = enableService.join(', ');
        this.services_enable_old = this.services_enable;
        this.showLoader = false;

    });
}
  
  timeFormat = (v) => {
    var ap = v < 12 || v == 24 ? "AM" : "PM"; // Set AM/PM
    var t = v % 12 || 12;
    return t + " " + ap;
  };
}

