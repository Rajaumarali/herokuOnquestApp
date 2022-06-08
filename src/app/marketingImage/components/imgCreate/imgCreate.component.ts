import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MarketingImageService} from '../../services/marketingImage.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-serviceedit',
  templateUrl: './imgCreate.component.html',
  styleUrls: ['./imgCreate.component.css']
})
export class ImgCreateComponent implements OnInit {
  @ViewChild('form') imageForm: NgForm;
  @ViewChild('mySel') skillSel: MatSelect;
  showLoader = false;
  isError = false;
  fileData: File = null;
  previewUrl: any = null;
  selectedProperty=[];
  uploadedFilePath: string = null;
  alert = {};
  userType;
  selectedBuilding:any;
  properties: any
  allselected = false;
  constructor(private service: MarketingImageService, private route: ActivatedRoute, private router: Router, public snackBar: MatSnackBar) { 
    $('.page-title').text('Add New Marketing Image');
    this.userType = JSON.parse(localStorage.getItem("user")).user_type_id;
  this.getAllProperties();
  }
  ngOnInit() {}
  onSubmit() {
    this.showLoader = true;
    if (this.fileData) {
      const formData = new FormData();
      formData.append('uploaded_file', this.fileData);
      this.service.uploadImage(formData)
          .subscribe((res) => {
            if (res) {
              this.uploadedFilePath = res.imageUrl;
              const data = {
                ...this.imageForm.value,
                image_url: this.uploadedFilePath,
                property_code: String(this.imageForm.value.property_code)
              };
              this.updateImage(data);
            }
          });
    } else {
      const data = {
        ...this.imageForm.value,
        property_code: String(this.imageForm.value.property_code)
      };
      this.updateImage(data);
    }
  }
  onChange(){
    this.skillSel.options.forEach((item: MatOption) => {
      if (item.value == 'All')
        item.deselect()
    });
  }
  toggleAllSelection() {
    this.allselected = !this.allselected;  // to control select-unselect

    if (this.allselected) {
      this.skillSel.options.forEach((item: MatOption) => item.select());
      const index = this.imageForm.value.property_code.indexOf('All');

      this.imageForm.value.property_code.splice(index, 1);
      this.selectedProperty= this.imageForm.value.property_code;
      
    } else {
      this.skillSel.options.forEach((item: MatOption) => { item.deselect() });
    }
    // this.skillSel.close();
    console.log(this.imageForm.value.property_code);
    console.log(this.skillSel);

  }
  updateImage(data) {
    this.service.addNewImg(data).subscribe((response  ) => {
      this.showLoader = false;
      this.openSnackBar( 'Added successfully', '');
    });
  }
  getAllProperties() {
    this.service.getAllProp().subscribe((response  ) => {
      console.log(response);
      if(this.userType=='6'){
        let region = JSON.parse(localStorage.getItem("user")).user_region;
        this.properties = response.filter(item => item.region==region);
      }else
     this.properties = response;
    });
  }
  openGallery(){
    $(".form-control.b-b").click();
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
