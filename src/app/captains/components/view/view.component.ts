import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CaptainsService} from '../../services/captains.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  @ViewChild('form') profileForm: NgForm;
  isError = false;
  showLoader = false;
  fileData: File = null;
  previewUrl: any = null;
  uploadedFilePath: string = null;
  user_id = null;
  alert = {};
  userService = [];
  user:any = [];
  constructor(private route: ActivatedRoute , private router: Router ,private captainsService: CaptainsService) {}
  ngOnInit() {
    $('.page-title').text('View Captain');
    this.user_id = this.route.snapshot.params.id;
    this.captainsService.getAllLocations().subscribe(resBuild=>{
    this.captainsService.getUserProfile(this.user_id).subscribe((response) => {
      this.user = response;
      let findReg = resBuild.find(item=> {
        var additionaBuild: any;
          var findAddBuild = undefined;
          if (response.additional_building !== null && response.additional_building !== "null" && response.additional_building !== "") {
            
            additionaBuild = response.additional_building.split(",");
            findAddBuild = additionaBuild.find(ite => ite==item.property_code)
          }
          if ( item.property_code==response.building_id || findAddBuild)
            return item;
      })
      this.user = {...this.user, region: findReg.region}
      console.log(this.user);
    });
  })
    this.captainsService.getServiceByUserId(this.user_id).subscribe((response) => {
      let index = 0;
      for (let i = 0; i < response.length; i++) {

        if ((typeof response[i].service === 'undefined') || response[i].service.length == 0) {
          delete response[i];
        } else {
          this.userService[index] = response[i];
          index++;
        }
      }
      console.log(this.userService);
    });
  }
  getPhone = function(phone){
    if(phone!=null){
    phone = phone.replace("+1","");
    phone = phone.replace("+92","");
    return phone.replace(/^(\d{3})(\d{3})/, "$1-$2-");
    }
    return "N/A";
  };
  parseJson(jsonString) {
    return JSON.parse(jsonString);
  }
  editResident(){
    this.router.navigate(['/captains/' + this.user_id + '/edit']);
  }
}
