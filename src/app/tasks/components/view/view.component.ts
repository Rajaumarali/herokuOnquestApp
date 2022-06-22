import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../resident/services/auth.service';
import { GrocerylistComponent } from '../../../common/component/grocerylist.component';
import { CompleteTaskPopup } from '../../../common/component/completetaskpopup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentFormPopup } from '../../../common/component/paymentformpopup.component';
import { send } from 'process';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  @ViewChild('form') profileForm: NgForm;
  paginator: MatPaginator;
  sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  displayedColumns = ['id', 'name', 'quantity', 'image', 'comment', 'created_at'];
  dataSource;
  showLoader = false;
  task_id = '';
  taskDetail: any = {};
  task: any = {};
  allInvoices = [];
  userItem = [];
  paymentProfFound = false;
  allMessagesLogs = [];
  loader = false;
  userType;
  constructor(private dom: DomSanitizer, public dialog: MatDialog, private breakpointObserver: BreakpointObserver, private _location: Location, private router: Router, private taskService: TasksService, private route: ActivatedRoute, private service: AuthService, public snackBar: MatSnackBar) {
    this.userType = JSON.parse(localStorage.getItem("user"));
    breakpointObserver.observe(['(max-width: 1000px)']).subscribe(result => {

      this.displayedColumns = result.matches ?
        ['name', 'quantity', 'image', 'comment', 'created_at'] :
        ['name', 'quantity', 'image', 'comment', 'created_at'];

    });
  }
  ngOnInit() {
    $('.page-title').text('View Task');
    this.task_id = this.route.snapshot.params.id;
    // this.taskDetail = JSON.parse(localStorage.getItem('tasklist'))[this.task_id];
    this.taskDetail = JSON.parse(localStorage.getItem('task'));

    if (this.taskDetail.service_name == "GROCERY SHOPPING")
    this.service.getGroceryList(this.taskDetail.list_id).subscribe((resp: any) => {
      this.allMessagesLogs = resp.filter(item => item.item_type != 'userItem');
      this.userItem = resp.filter(item => item.item_type == 'userItem');
      if (this.userItem[0])
        if (this.userItem[0].image != '')
          this.userItem[0].image = JSON.parse(this.userItem[0].image);
      this.dataSource = new MatTableDataSource<any>(this.allMessagesLogs);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
      this.loader = false;

    });
    if (this.taskDetail.service_name == "GROCERY SHOPPING" || this.taskDetail.service_name == "FLOWER DELIVERY" || (this.taskDetail.service_name == "RX PICK-UP" && this.taskDetail.payment_required_for_pickup == "Yes")) {
      if (this.taskDetail.payment_invoice != '' && this.taskDetail.payment_invoice != null){
        
        this.taskDetail.payment_invoice = JSON.parse(this.taskDetail.payment_invoice);
      }

      this.taskService.getPayment({ user_id: this.taskDetail.user_id }).subscribe(res => {
        if (res) {
          this.paymentProfFound = true;
        }
      })
    }
    else
      this.paymentProfFound = true;
    // if(this.taskDetail.service_name=="GROCERY SHOPPING"){
    //     this.taskDetail.payment_invoice = JSON.parse(this.taskDetail.payment_invoice);
    // }

  }
  onChange() {
  }

  profile(userId) {
    this.router.navigate(['/residents/' + userId + '/view']);
  }
  openImage(image) {
    var modal = document.getElementById("myModal");
    var modalImg: any;
    modalImg = document.getElementById("img01");

    modal.style.display = "block";

    try {
      modalImg.src = JSON.parse(image);
    } catch {
      modalImg.src = image;
    }


  }
  closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }
  getPhone = function (phone) {
    if (phone != null) {
      phone = phone.replace("+1", "");
      phone = phone.replace("+92", "");
      return phone.replace(/^(\d{3})(\d{3})/, "$1-$2-");
    }
    return "N/A";
  };
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  finalSave = async (data) => {
    return new Promise((resolve, reject) => {
      var f = 0;
      for (var i = 0; i < data.fileCount; i++) {
        f++;
        const formData = new FormData();
        formData.append('uploaded_file', data.fileData[i]);
        this.service.uploadDP(formData)
          .subscribe((res) => {
            if (res) {

              if (res.message == "Image uploaded successfully.") {
                this.allInvoices.push(JSON.stringify(res.imageUrl));
                if (data.fileCount == f) {
                  resolve("");

                }
              }
            } else {
              reject()
            }
          });
      }
    });
  }

  goBack() {
    this._location.back();
  }

  saveImg = async (data, serv) => {
    await this.finalSave(data).then(res => {

      if (serv == "Grocery") {
        setTimeout(() => {
          let todayDate = new Date();

          let body = { completed_from:true, responsible_party: this.userType.first_name + ' ' + this.userType.last_name, total_amount: data.txt, service_completed_date: todayDate.toString().substring(0, 15), id: this.taskDetail.list_id, user_id: this.taskDetail.user_id, service_completed: "true", payment_invoice: JSON.stringify(this.allInvoices) }

          this.taskService.completeGrocery(body).subscribe(res => {
            if (res.status == "success") {
              this.showLoader = false;
              this.openSnackBar('Completed successfully', '', true);
            } else {
              this.showLoader = false;
            }

          });
        }, 2000);
      } else if (serv == "Flower") {
        setTimeout(() => {
          let todayDate = new Date();

          let body = { completed_from:true, responsible_party: this.userType.first_name + ' ' + this.userType.last_name, total_amount: data.txt, service_completed_date: todayDate.toString().substring(0, 15), id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_completed: "true", payment_invoice: JSON.stringify(this.allInvoices) }
          this.taskService.completeFlower(body).subscribe(res => {
            if (res.status == "success") {
              this.showLoader = false;
              this.openSnackBar('Completed successfully', '', true);
            } else {
              this.showLoader = false;
            }

          });
        }, 2000);
      }
      else if (serv == "RX") {
        setTimeout(() => {
          let todayDate = new Date();

          let body = { completed_from:true, responsible_party: this.userType.first_name + ' ' + this.userType.last_name, total_amount: data.txt, service_completed_date: todayDate.toString().substring(0, 15), id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_completed: "true", payment_invoice: JSON.stringify(this.allInvoices) }
        

          this.taskService.completeRxPay(body).subscribe(res => {
            if (res.status == "success") {
              this.showLoader = false;
              this.openSnackBar('Completed successfully', '', true);
            } else {
              this.showLoader = false;
            }

          });
        }, 2000);
      }
    });
  }

  complete() {
    if (this.taskDetail.service_name == "GROCERY SHOPPING") {
      // let body = {id: this.taskDetail.list_id, user_id: this.taskDetail.user_id, service_completed: "true"}
      // this.taskService.completeGrocery(body).subscribe(res=>{
      //   this.router.navigate(['/tasks/']);
      // });
      const dialogRef = this.dialog.open(PaymentFormPopup, {
        width: '400px',
        data: {}
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data !== "cancel") {
          this.showLoader = true;
          if (data.txt !== undefined && data.fileData !== null) {
            this.saveImg(data, "Grocery");
          }
          else {
            this.showLoader = false;
            this.openSnackBar("Please fill form", "", false);
          }
        }
      })
    }
    else if (this.taskDetail.service_name == "LAUNDRY PICK-UP") {
      const dialogRef = this.dialog.open(CompleteTaskPopup, {
        width: '400px',
        data: { showConfirmField: true, message: "complete this task" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == "COMPLETE") {
          this.showLoader = true;

          let todayDate = new Date();
          let body = { responsible_party: this.userType.first_name + ' ' + this.userType.last_name, id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_completed: "true", service_completed_date: todayDate.toString().substring(0, 15) }
          this.taskService.completeLaundryPickUp(body).subscribe(res => {
            if (res) {
              this.showLoader = false;
              this.openSnackBar('Completed successfully', '', true);
            }

          })
        }

      });
    } else if (this.taskDetail.service_name == "LAUNDRY DROP-OFF") {
      const dialogRef = this.dialog.open(CompleteTaskPopup, {
        width: '400px',
        data: { showConfirmField: true, message: "complete this task" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == "COMPLETE") {
          this.showLoader = true;

          let todayDate = new Date();
          let body = { responsible_party: this.userType.first_name + ' ' + this.userType.last_name, id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_completed: "true", service_completed_date: todayDate.toString().substring(0, 15) }
          this.taskService.completeLaundryDropOff(body).subscribe(res => {
            if (res) {
              this.showLoader = false;
              this.openSnackBar('Completed successfully', '', true);
            }

          })
        }

      });

    } else if (this.taskDetail.service_name == "PACKAGE PICK-UP") {
      const dialogRef = this.dialog.open(CompleteTaskPopup, {
        width: '400px',
        data: { showConfirmField: true, message: "complete this task" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == "COMPLETE") {
          this.showLoader = true;

          let todayDate = new Date();
          let body = { responsible_party: this.userType.first_name + ' ' + this.userType.last_name, id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_completed: "true", service_completed_date: todayDate.toString().substring(0, 15) }
          this.taskService.completePackage(body).subscribe(res => {
            if (res) {
              this.showLoader = false;
              this.openSnackBar('Completed successfully', '', true);
            }

          })
        }

      });
    } else if (this.taskDetail.service_name == "ONQUEST CLEAN") {
      const dialogRef = this.dialog.open(CompleteTaskPopup, {
        width: '400px',
        data: { showConfirmField: true, message: "complete this task" }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == "COMPLETE") {
          this.showLoader = true;

          let todayDate = new Date();
          let body = { responsible_party: this.userType.first_name + ' ' + this.userType.last_name, id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_completed: "true", service_completed_date: todayDate.toString().substring(0, 15) }
          this.taskService.completeOnQuestClean(body).subscribe(res => {
            if (res) {
              this.showLoader = false;
              this.openSnackBar('Completed successfully', '', true);
            }

          })
        }

      });

    } else if (this.taskDetail.service_name == "FLOWER DELIVERY") {
      const dialogRef = this.dialog.open(PaymentFormPopup, {
        width: '400px',
        data: {}
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data !== "cancel") {
          this.showLoader = true;
          if (data.txt !== undefined && data.fileData !== null) {

            this.saveImg(data, "Flower");
          }
          else {
            this.showLoader = false;
            this.openSnackBar("Please fill form", "", false);
          }

        }
      })

    } else if (this.taskDetail.service_name == "RX PICK-UP") {
      if (this.taskDetail.payment_required_for_pickup == "No") {
        const dialogRef = this.dialog.open(CompleteTaskPopup, {
          width: '400px',
          data: { showConfirmField: true, message: "complete this task." }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result == "COMPLETE") {
            this.showLoader = true;

            let todayDate = new Date();
            let body = { responsible_party: this.userType.first_name + ' ' + this.userType.last_name, id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_completed: "true", service_completed_date: todayDate.toString().substring(0, 15) }
            this.taskService.completeRx(body).subscribe(res => {
              if (res) {
                this.showLoader = false;
                this.openSnackBar('Completed successfully', '', true);
              }

            })
          }

        });
      } else {
        const dialogRef = this.dialog.open(PaymentFormPopup, {
          width: '400px',
          data: {}
        });
        dialogRef.afterClosed().subscribe(data => {
          if (data !== "cancel") {
            this.showLoader = true;

            if (data.txt !== undefined && data.fileData !== null) {

              this.saveImg(data, "RX");
            }
            else {
              this.openSnackBar("Please fill form", "", false);
              this.showLoader = false;
            }

          }
        })
      }
    }
  }

  cancel() {
    this.showLoader = true;

    const dialogRef = this.dialog.open(CompleteTaskPopup, {
      width: '400px',
      data: { showConfirmField: true, message: "cancel this task", confirmName: "CANCEL" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "CANCEL") {
        if (this.taskDetail.service_name == "GROCERY SHOPPING") {
        
          var body = { responsible_party: this.userType.first_name + ' ' + this.userType.last_name, id: this.taskDetail.list_id, user_id: this.taskDetail.user_id, service_enable: 'false' }
          this.taskService.completeGroceryService(body).subscribe(res => {
            if (res) {
              this.showLoader = false;
              this.openSnackBar('Cancelled successfully', '', true);
            } else {
              this.showLoader = false;
              this.openSnackBar('Error Occured. Please try again later', '', false);
            }
          })
        }
        else if (this.taskDetail.service_name == "FLOWER DELIVERY") {
          var body = { responsible_party: this.userType.first_name + ' ' + this.userType.last_name, id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_enable: 'false' }
          this.taskService.completeFlowerService(body).subscribe(res => {
            if (res) {
              this.showLoader = false;
              this.openSnackBar('Cancelled successfully', '', true);
            } else {
              this.showLoader = false;
              this.openSnackBar('Error Occured. Please try again later', '', false);
            }
          })
        } else if (this.taskDetail.service_name == "RX PICK-UP") {
          var body = { responsible_party: this.userType.first_name + ' ' + this.userType.last_name, id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_enable: 'false' }
          this.taskService.completeRx(body).subscribe(res => {
            if (res) {
              this.showLoader = false;
              this.openSnackBar('Cancelled successfully', '', true);
            } else {
              this.showLoader = false;
              this.openSnackBar('Error Occured. Please try again later', '', false);
            }
          })
        } else if (this.taskDetail.service_name == "ONQUEST CLEAN") {
          var body = { responsible_party: this.userType.first_name + ' ' + this.userType.last_name, id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_enable: 'false' }
          this.taskService.completeOnQuestClean(body).subscribe(res => {
            if (res) {
              this.showLoader = false;
              this.openSnackBar('Cancelled successfully', '', true);
            } else {
              this.showLoader = false;
              this.openSnackBar('Error Occured. Please try again later', '', false);
            }
          })
        } else if (this.taskDetail.service_name == "PACKAGE PICK-UP") {
          var body = { responsible_party: this.userType.first_name + ' ' + this.userType.last_name, id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_enable: 'false' }
          this.taskService.completePackage(body).subscribe(res => {
            if (res) {
              this.showLoader = false;
              this.openSnackBar('Cancelled successfully', '', true);
            } else {
              this.showLoader = false;
              this.openSnackBar('Error Occured. Please try again later', '', false);
            }
          })
        } else if (this.taskDetail.service_name == "LAUNDRY DROP-OFF") {
          var body = { responsible_party: this.userType.first_name + ' ' + this.userType.last_name, id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_enable: 'false' }
          this.taskService.completeLaundryDropOff(body).subscribe(res => {
            if (res) {
              this.showLoader = false;
              this.openSnackBar('Cancelled successfully', '', true);
            } else {
              this.showLoader = false;
              this.openSnackBar('Error Occured. Please try again later', '', false);
            }
          })
        } else if (this.taskDetail.service_name == "LAUNDRY PICK-UP") {
          var body = { responsible_party: this.userType.first_name + ' ' + this.userType.last_name, id: this.taskDetail.id, user_id: this.taskDetail.user_id, service_enable: 'false' }
          this.taskService.completeLaundryPickUp(body).subscribe(res => {
            if (res) {
              this.showLoader = false;
              this.openSnackBar('Cancelled successfully', '', true);
            } else {
              this.showLoader = false;
              this.openSnackBar('Error Occured. Please try again later', '', false);
            }
          })
        }
      } else {
        this.showLoader = false;

      }
    });

  }
  getImage(image) {
    try {
      return (this.dom.bypassSecurityTrustResourceUrl(JSON.parse(image)));
    } catch {
      return (this.dom.bypassSecurityTrustResourceUrl(image));

    }
  }
  openSnackBar(message: string, action: string, back) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
    if (back)
      this.router.navigate(['/tasks/']);
  }
  openList(): void {
    const dialogRef = this.dialog.open(GrocerylistComponent, {
      width: '80vw',
      data: { service: this.service, id: this.taskDetail.list_id }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}

