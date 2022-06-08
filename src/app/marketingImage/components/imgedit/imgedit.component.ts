import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MarketingImageService} from '../../services/marketingImage.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-serviceedit',
  templateUrl: './imgedit.component.html',
  styleUrls: ['./imgedit.component.css']
})
export class ImgeditComponent implements OnInit {
  @ViewChild('form') imageForm: NgForm;
  @ViewChild('mySel') skillSel: MatSelect;
  showLoader = false;
  isError = false;
  fileData: File = null;
  previewUrl: any = null;
  uploadedFilePath: string = null;
  imageData = {
    marketing_image_id:'',
    image_url: '',
    title: '',
    status: '',
    property_code:[]
  };
  alert = {};
  properties: any;
  userType: any;
  allselected = false;
  constructor(private service: MarketingImageService, private route: ActivatedRoute, private router: Router, public snackBar: MatSnackBar) { 
    $('.page-title').text('Edit Marketing Image');
    this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
    this.getAllProperties();
  }
  ngOnInit() {
    
  }
  toggleAllSelection() {
    this.allselected = !this.allselected;  // to control select-unselect

    if (this.allselected) {
      this.skillSel.options.forEach((item: MatOption) => item.select());
      const index = this.imageForm.value.property_code.indexOf('All');

      this.imageForm.value.property_code.splice(index, 1);
      
    } else {
      this.skillSel.options.forEach((item: MatOption) => { item.deselect() });
    }
    // this.skillSel.close();
    console.log(this.imageForm.value.property_code);
    console.log(this.skillSel);

  }
  onSubmit () {

    this.showLoader = true;
    if (this.fileData) {
      const formData = new FormData();
      formData.append('uploaded_file', this.fileData);
      this.service.uploadImage(formData)
          .subscribe((res) => {
            if (res) {
              this.uploadedFilePath = res.imageUrl;
              const data = {
                marketing_image_id: this.imageData.marketing_image_id,
                ...this.imageForm.value,
                image_url: this.uploadedFilePath,
                property_code: String(this.imageData.property_code)
              };
              this.updateImage(data);
            }
          });
    } else {
      const data = {
        marketing_image_id: this.imageData.marketing_image_id,
        ...this.imageForm.value,
        property_code: String(this.imageData.property_code),
        image_url: this.previewUrl
      };
      this.updateImage(data);
    }
  }
  updateImage(data) {
    console.log(data);
    this.service.updateImage(data).subscribe((response  ) => {
      this.showLoader = false;
      this.openSnackBar( 'Updated Successfully', '');
    });
  }
  openGallery(){
    $(".form-control.b-b").click();
  }
  onChange(){
    this.skillSel.options.forEach((item: MatOption) => {
      if (item.value == 'All')
        item.deselect()
    });
  }
  getAllProperties() {
    this.service.getAllProp().subscribe((response  ) => {
      console.log(response);
      if(this.userType=="3"){
        var building = JSON.parse(localStorage.getItem("user")).building_id;
        var findProp = response.filter(item=> item.property_code==building)
            if(findProp){
                this.properties = findProp;
            }
      }else{
      this.properties = response;
      const id = this.route.snapshot.params.id;
    this.imageData.marketing_image_id = id;
    this.service.getImagebyId(id).subscribe((responseImage: any) => {
      this.imageData = responseImage;
        if (this.imageData.property_code != null) {
          this.imageData.property_code = responseImage.property_code.split(',');
          let findProp = this.properties.every(item => this.imageData.property_code.find(ite=> item.property_code==ite));
          if(findProp){
            this.imageData.property_code.push("All")
          }
          console.table(this.imageData.property_code);
        }
      console.log(this.imageData);
      this.previewUrl = responseImage.image_url;
    });
      }
    });
  }
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }
  btnClick() {
    this.router.navigate(['/services']);
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
    this.router.navigate(['/marketingImage/']);
  }

}
