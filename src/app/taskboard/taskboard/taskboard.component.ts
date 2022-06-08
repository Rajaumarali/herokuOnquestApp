/* tslint:disable:max-line-length */
import { Component } from '@angular/core';
import { DragulaService } from  'ng2-dragula';;
import { Subscription } from 'rxjs';
import { TaskboardService } from "../services/taskboard.service";
interface Tasks {
  title: string;
  description: string;
  class?: string;
}

interface Taskboard {
  title: string;
  tasks: Tasks[];
  class?: string;
}

@Component({
  selector: 'app-taskboard',
  templateUrl: './taskboard.component.html',
  styleUrls: ['./taskboard.component.scss']
})
export class TaskboardComponent {
  BAG = "task-group";
  subs = new Subscription();
  taskboard: Taskboard[]
  data:any;
  property_code:any;
  captainList:any;
  allresidents:any;
  // taskboard: Taskboard[] = [
  //   {
  //     title: 'To Dos',
  //     class: 'todos',
  //     tasks: [
  //       {
  //         title: 'Launch new template',
  //         description: 'Integer posuere erat a ante venenatis dapibus posuere.'
  //       },
  //       {
  //         title: 'Book a Ticket',
  //         description: 'Blandit tempus porttitor aasfs.'
  //       },
  //       {
  //         title: 'Task review',
  //         description:
  //           'Lorem Ipsum, dapibus ac facilisis in, egestas eget quam. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
  //         class: 'task-status-info'
  //       }
  //     ]
  //   },
  //   {
  //     title: 'In Progress',
  //     class: 'inprogress',
  //     tasks: [
  //       {
  //         title: 'Website Design',
  //         description: 'Integer posuere erat a ante venenatis dapibus posuere.'
  //       },
  //       {
  //         title: 'Angular 5 material',
  //         description:
  //           'Lorem Ipsum, dapibus ac facilisis in, egestas eget quam. Integer posuere erat aassg.',
  //         class: 'task-status-danger'
  //       },
  //       {
  //         title: 'Horizontal Layoutbug',
  //         description: 'Lorem Ipsum, dapibus ac facilisis in',
  //         class: 'task-status-info'
  //       },
  //       {
  //         title: 'Error --prod',
  //         description: 'Lorem Ipsum, dapibus ac facilisis.'
  //       },
  //       {
  //         title: 'Update to angular5',
  //         description:
  //           'Dapibus ac facilisis in, egestas eget quam. Integer posuere erat aassg.'
  //       },
  //       {
  //         title: 'Give quatation',
  //         description:
  //           'Commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.',
  //         class: 'task-status-warning'
  //       }
  //     ]
  //   },
  //   {
  //     title: 'Completed',
  //     class: 'completed',
  //     tasks: [
  //       {
  //         title: 'Design work',
  //         description:
  //           'Commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.'
  //       },
  //       {
  //         title: 'Meeting with team',
  //         description: 'Dapibus ac facilisis in, egestas eget quam.',
  //         class: 'task-status-success'
  //       },
  //       {
  //         title: 'Material Pro angular',
  //         description: 'We have finished working on MaterialPro'
  //       },
  //       {
  //         title: 'Admin wrap converted',
  //         description: 'We have finished working.'
  //       },
  //       {
  //         title: 'Learning Angular 5',
  //         description: 'Task is now completed to learn angular5',
  //         class: 'task-status-success'
  //       }
  //     ]
  //   },
  // ];

  constructor(private dragulaService: DragulaService, private service: TaskboardService,){
    var url = window.location.href;
    this.property_code = url.split("/").pop();
    this.subs.add(dragulaService.dropModel(this.BAG)
      .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
        if(item.meet_greet_status != 'completed'){
          this.getResident(item.user_id, 'completed');
          item.meet_greet_status = "completed";
        }else{
          this.getResident(item.user_id, 'todo');
          item.meet_greet_status = "todo";
        }
      })
    );
    this.subs.add(dragulaService.removeModel(this.BAG)
      .subscribe(({ el, source, item, sourceModel }) => {
    
      })
    );
    this.getAllCaptains();
  }

  getAllCaptains(){
    this.service.getAllUsers({
      'user_type': 'captain',
      'property_code': this.property_code
  }).subscribe((data: any) => {
    this.captainList = data;
    this.getAllResidents();
  });
  }


  getAllResidents(){
    this.taskboard = [
      {
        title: 'To Dos',
        class: 'todos',
        tasks: []
      },
      {
        title: 'Completed',
        class: 'completed',
        tasks: []
      },];
      //get location all residents and meet and greets date and time
    this.service.getAllUsers({
              'user_type': 'resident',
              'property_code': this.property_code
          }).subscribe((data: any) => {
            this.allresidents = data;
             data.forEach(ele => {
               if(ele.meet_greet_status == '' || ele.meet_greet_status == null || ele.meet_greet_status == 'todo'){
                this.data = {
                     first_name: ele.first_name,
                     last_name: ele.last_name,
                     phone: ele.phone,
                     assigned_captain: this.getCaptainName(ele.assigned_captain_id),
                     property_name: ele.property_name,
                     meet_greet_status: ele.meet_greet_status,
                     meet_greet_date_time: ele.meet_greet_date_time,
                     user_id: ele.user_id
                    }
                    this.taskboard[0].tasks.push(this.data);
               }else{
                this.data = {
                     first_name: ele.first_name,
                     last_name: ele.last_name,
                     phone: ele.phone,
                     assigned_captain: this.getCaptainName(ele.assigned_captain_id),
                     property_name: ele.property_name,
                     meet_greet_status: ele.meet_greet_status,
                     meet_greet_date_time: ele.meet_greet_date_time,
                     user_id: ele.user_id
                    }
                    this.taskboard[1].tasks.push(this.data);
               }
             });
          });
  }

  getCaptainName(cpatainId){
    let captain = this.captainList.filter((user) => {
      return user.user_id == cpatainId;  
    });
    if(captain.length != 0){
      return captain[0].first_name;
    }else{
      return "Not assigned any captain yet!";
    }
  }

  getResident(residentId, meet_greet_status){
    let resident = this.allresidents.filter((user) => {
      return user.user_id == residentId;  
    });
    resident[0].meet_greet_status = meet_greet_status;
    this.service.updateProfile(resident[0]).subscribe((data: any) => {
  });

  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  addClass(event, data) {  }
  removeClass(event, data) {  }
}
