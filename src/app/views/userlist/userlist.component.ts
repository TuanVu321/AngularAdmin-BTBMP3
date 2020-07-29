import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../services/admin.service";
import {User} from "../../interface/user";
import {Observable} from "rxjs";
import {Statistic} from "./Statistic";
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
})
export class UserlistComponent implements OnInit {
  constructor(private adminService: AdminService) { }

  userList: Observable<User[]>;

  ngOnInit() {
    this.getInformationServer();
    this.reloadData();
  }

  onSubmitDelete(userId: number): void {
    this.adminService.deleteUser(userId).subscribe(
    result => {
      this.reloadData();
    },
      error => console.log(error)
    );
  }

  onSubmitBlock(userId: number) {
    this.adminService.blockUser(userId).subscribe(
      result => {},
      error => console.log(error)
    );
  }

  reloadData(): void {
    this.adminService.getAll().subscribe(
      result => {
        console.log("testing");
        this.userList = result;
      }
    );
  }

  title = 'myHighchart';

  data: Statistic[] = [];

  getInformationServer(): any {
    this.adminService.getInformationStatistic().subscribe(
      result => {
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result[i].length; j++) {
            if (j == 0) {
              this.data[i] = new Statistic();
              let formatDateStr = result[i][0].substr(0, 10);
              this.data[i].setName(formatDateStr);
            } else {
              this.data[i].data = [];
              this.data[i].data[0] = result[i][1];
            }
          }
        }
      }
    );
  }

  highcharts = null;
  chartOptions = {};

  enableChart() {
    console.log(this.data);

    this.highcharts = Highcharts;
    this.chartOptions = {
      chart: {
        type: "column"
      },
      title: {
        text: "Biểu Đồ Theo Dõi Số Lượng Người Đăng Kí Mới Theo Ngày"
      },
      xAxis:{
        categories:["Đơn Vị Theo Ngày"]
      },
      yAxis: {
        title:{
          text:"Số Lượng Người"
        }
      },
      series: this.data
    };
  }
}

