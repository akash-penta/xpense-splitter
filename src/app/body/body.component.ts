import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Response } from "@angular/http";
import { ServerService } from '../server.service';
import { EachPerson } from '../utils/EachPerson';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  inputDataForm: FormGroup;
  data: EachPerson[] = [];
  lenData: number = 0;
  report: any[] = [];
  reportWRToForm: FormGroup;
  loading: boolean = false;
  total_amount: number = 0;
  amount_per_head: any = 0;

  constructor(private serverService: ServerService) { }

  ngOnInit() {
    this.inputDataForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, this.validateAmount])
    });
    if(sessionStorage.getItem("data")) {
      let localdata: any[] = JSON.parse(sessionStorage.getItem("data"));
      for(let i=0;i<localdata.length;i++){
        this.data[this.lenData++]=new EachPerson(localdata[i].name,localdata[i].amount);
      }
    }
    //this.data[this.lenData++]=new EachPerson("akash",1000);
    //this.data[this.lenData++]=new EachPerson("santosh",100);
    //this.data[this.lenData++]=new EachPerson("lochana",500);
    //this.onGetReport()
  }
  validateAmount(control: FormControl) {
    let AMOUNT_REG = /^(-)?\d+(\.\d{1,2})?$/;
    return AMOUNT_REG.test(control.value) ? null : {
      amountInvalid: {
        message: "Please enter valid amount"
      }
    };
  }
  onInputSubmit() {
    if(this.inputDataForm.valid) {
      let flag=true;
      for(let i=0;i<this.lenData;i++) {
        if(this.data[i].getName().toLowerCase()==this.inputDataForm.value.name.toLowerCase()) {
          this.data[i].setAmount(Number(this.inputDataForm.value.amount));
          flag=false;
          break;
        }
      }
      if(flag) {
        this.data[this.lenData]=new EachPerson(
          this.inputDataForm.value.name,
          Number(this.inputDataForm.value.amount)
        );
        this.lenData++;
      }
      sessionStorage.setItem("data",JSON.stringify(this.data));
      this.inputDataForm.reset();
    }
  }
  onDelete(name: string) {
    this.data.splice(this.data.findIndex(d => d.name === name),1);
    this.lenData--;
    sessionStorage.setItem("data",JSON.stringify(this.data));
  }
  onGetReport() {
    this.loading = true;
    this.serverService.getReport(this.data)
      .subscribe(
        (response: Response) => {
          this.report = response.json();
          this.loading = false;
        },
        (error) => console.log(error)
      )
    this.reportWRToForm = new FormGroup({
      'reportWRTo': new FormControl(this.data[0].getName())
    });
    this.total_amount = 0;
    for(let i=0; i<this.lenData; i++) {
      this.total_amount += this.data[i].amount;
    }
    this.amount_per_head = (this.total_amount/(this.lenData)).toFixed(2);
  }
}
