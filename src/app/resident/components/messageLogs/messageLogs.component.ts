import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ResidentService} from '../../services/resident.service';
import { MatDialog } from '@angular/material/dialog';
import {MailComponent} from '../../../common/component/mail.component';
import {SMSComponent} from '../../../common/component/sms.component';
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
    selector: 'app-location-edit',
    templateUrl: './messageLogs.component.html',
    styleUrls: ['./messageLogs.component.css']
})

export class MessageLogsComponent implements OnInit {

    @ViewChild('form') profileForm: NgForm;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    displayedColumns = ['id', 'resident_name', 'phone', 'message', 'status', 'date'];
    dataSource;
    user_id;
    allMessagesLogs = [];
    loader = true;
    name='';
    constructor(public dialog: MatDialog,private service: AuthService, private route: ActivatedRoute , private router: Router, breakpointObserver: BreakpointObserver ) {
        this.user_id = this.route.snapshot.params.id;
        this.name = localStorage.getItem('messageUser');
        breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {

            this.displayedColumns = result.matches ?
                ['resident_name', 'phone', 'message', 'status', 'date'] :
                ['resident_name', 'phone', 'message', 'status', 'date'];

        });
        this.getMessageLogs();
    }
    ngOnInit() {

        }
        getPhone = function(phone){
            if(phone!=null){
                phone = phone.replace("+1","");
                phone = phone.replace("+92","");
                return phone.replace(/^(\d{3})(\d{3})/, "$1-$2-");
                }
                return "N/A";
        };
    getMessageLogs() {
        this.service.getMessageLogs(this.user_id).subscribe(response => {
            this.allMessagesLogs = response;
            this.dataSource = new MatTableDataSource<any>(this.allMessagesLogs);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.loader=false;
        },err=>{
            this.dataSource = new MatTableDataSource<any>(this.allMessagesLogs);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.loader=false;
        });
    }
}

