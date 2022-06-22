import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ServiceService} from '../../services/service.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-serviceedit',
  templateUrl: './serviceedit.component.html',
  styleUrls: ['./serviceedit.component.css']
})
export class ServiceeditComponent implements OnInit {
  @ViewChild('form') serviceForm: NgForm;
  showLoader = false;
  isError = false;
  fileData: File = null;
  previewUrl: any = null;
  uploadedFilePath: string = null;
  servicedata = {
    service_name: '',
    service_category:'',
    service_type: '',
    service_image: '',
    description:''
  };
  alert = {};
  constructor(private service: ServiceService, private route: ActivatedRoute, private router: Router,public snackBar: MatSnackBar) { }
  ngOnInit() {
    $('.page-title').text('Edit Service');
    const id = this.route.snapshot.params.id;
    this.service.getService(id).subscribe((response: any) => {
      this.servicedata = response;
      this.previewUrl = response.service_image;
    });
  }
  onSubmit () {

    if (this.fileData) {
      const formData = new FormData();
      formData.append('uploaded_file', this.fileData);
      this.service.Uploadimage(formData)
          .subscribe((res) => {
            if (res) {
              this.uploadedFilePath = res.imageUrl;
              const data = {
                ...this.servicedata,
                ...this.serviceForm.value,
                service_image: this.uploadedFilePath
              };
              this.saveService(data);
            }
          });
    } else {
      const data = {
        ...this.servicedata,
        ...this.serviceForm.value
      };
      this.saveService(data);
    }
  }
  openGallery(){
    $(".form-control.b-b").click();
  }
  showList(serv) {
    localStorage.setItem( 'serValue' , serv);
    this.router.navigate(['/restrictedservices']);
}
  createResService() {
    this.router.navigate(['/restrictedservices/create']);
  }
  saveService(data) {
    this.showLoader = true;
    this.service.serviceUpdate(data).subscribe((response  ) => {
      this.showLoader = false;
      this.openSnackBar( 'Updated Successfully', '');
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
      duration: 5000,
    });
    this.router.navigate(['/services/']);
  }

}
