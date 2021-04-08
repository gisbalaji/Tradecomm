import { Component, OnInit, ElementRef, HostListener, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from '../../service/authentication/authentication.service';
import { InvoiceDetailsRejectedComponent } from './invoice-details-rejected/invoice-details-rejected.component'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FinanceBiddingRejectedServices } from './finance-bidding-rejected-service'
import { FinanceBiddingService } from '../../service/finance_bidding/finance-bidding.service';
import { FINANCIERDASHBOARDCONSTANTS } from '../../shared/constants/constants';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-finance-bidding-rejected',
  templateUrl: './finance-bidding-rejected.component.html',
  styleUrls: ['./finance-bidding-rejected.component.scss']
})
export class FinanceBiddingRejectedComponent implements OnInit {
  @Input() InvoiceDetailsRejectedComponent: InvoiceDetailsRejectedComponent;
  ELEMENT_DATA1: any[];
  TextAreaDiv: boolean;
  FinancebiddingDetails: any;
  constructor(private fb: FormBuilder,public router: Router, public authenticationService: AuthenticationService,
    private modalService: BsModalService, private FinanceBiddingRejectedServices: FinanceBiddingRejectedServices, private FinanceBiddingService: FinanceBiddingService) { }

  dataSource;//data
  displayedColumns: string[] = [
    'BIDID',
    'Invoice Amount',
    'BIDing Amount',
    'offer Expires',
    'remark',
    'action'
  ]
  mobileScreen = false;
  end = false;
  start = true;
  currentPage = 0;
  pageCount = 1;
  limit = 7;
  isOpen = '';
  bidpanelOpenState = false;
  id = ""
  @ViewChild('accountList', { read: ElementRef })
  public accountList: ElementRef<any>;
  dashboardTooltip = FINANCIERDASHBOARDCONSTANTS;
  @HostListener('window:resize', ['$event'])
  modalRef: BsModalRef;
  isHover: boolean = false;
  Rejectform: FormGroup;
  rejectQustionOne = {
    subrejectQustionOne: [
      { name: 'Inv Discount Rate High',labelPosition:'before',formControlName:'Inv_Discount_Low'},
      { name: 'Annual Yield (Basis a360) Too High',labelPosition:'before',formControlName:'Annual_Yield'},
      { name: 'Fundable percentage Less',labelPosition:'before',formControlName:'Fundable_percentage_low'},
      { name: 'Funding Amount Less',labelPosition:'before',formControlName:'Funding_Amount_High' },
    ]
};
rejectQustionTwo = {
  subrejectQustionTwo: [
    { name: 'Net Amt payable (Base CCY) Low',labelPosition:'before',formControlName:'Net_payable'},
    { name: 'Repayment Date Less',labelPosition:'before',formControlName:'Repayment_Date'},
    { name: 'Off Exp date /time Less',labelPosition:'before',formControlName:'Off_date'},
    { name: 'Others',labelPosition:'before',formControlName:'Others'},
  ]
}
  ngOnInit() {
    if (window.innerWidth < 415) {
      this.mobileScreen = true;
    }
    this.buildform()
    this.FinanceBiddingRejectedServices.getInvoiceDetails().subscribe(resp => {
      console.log(resp);
      this.dataSource = new MatTableDataSource(resp);
    })
  }
  onResize() {
    if (window.innerWidth < 415) {
      this.mobileScreen = true;
    } else {
      this.mobileScreen = false;
    }
  }
  public scrollRight(): void {
    this.start = false;
    const scrollWidth =
      this.accountList.nativeElement.scrollWidth -
      this.accountList.nativeElement.clientWidth;

    if (scrollWidth === Math.round(this.accountList.nativeElement.scrollLeft)) {
      this.end = true;
    } else {
      this.accountList.nativeElement.scrollTo({
        left: this.accountList.nativeElement.scrollLeft + 150,
        behavior: 'smooth',
      });
    }
  }

  public scrollLeft(): void {
    this.end = false;
    if (this.accountList.nativeElement.scrollLeft === 0) {
      this.start = true;
    }
    this.accountList.nativeElement.scrollTo({
      left: this.accountList.nativeElement.scrollLeft - 150,
      behavior: 'smooth',
    });
  }

  isOpenHandle(isTrue) {
    this.isOpen = isTrue === 'inActive' ? 'active' : 'inActive';
  }
  navigateFinanceBidding() {
    this.router.navigateByUrl('/finance-bidding');
  }
  logout() {
    this.authenticationService.logout()
  }
  goHome() {
    this.router.navigateByUrl('/financier-dashboard');
  }
  navigateFinanceDetails(id, type) {
    this.router.navigateByUrl('/finance-bidding-rejected/' + type + '/' + id);
  }
  openModal(event,template,id) {
    this.FinanceBiddingRejectedServices.getInvDetailsLists_ForFinanceBidding(id).subscribe(resp => {
      if(resp){
        this.FinancebiddingDetails = resp
        this.TextAreaDiv = true;
        this.buildform()
      }
    })
    event.preventDefault();
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }
  buildform() {
    // this.Rejectform = this.fb.group({
    //   Inv_Discount_Low: [this.FinancebiddingDetails ? this.FinancebiddingDetails.Remarks.Inv_Discount_Low : false],
    //   Annual_Yield: [this.FinancebiddingDetails ? this.FinancebiddingDetails.Remarks.Annual_Yield : false],
    //   Fundable_percentage_low: [this.FinancebiddingDetails ? this.FinancebiddingDetails.Remarks.Fundable_percentage_low : false],
    //   Funding_Amount_High: [this.FinancebiddingDetails ? this.FinancebiddingDetails.Remarks.Funding_Amount_High : false],
    //   Net_payable: [this.FinancebiddingDetails ? this.FinancebiddingDetails.Remarks.Net_payable : false],
    //   Base_Amount: [this.FinancebiddingDetails ? this.FinancebiddingDetails.Remarks.Base_Amount : false],
    //   invoiceAmt: [this.FinancebiddingDetails ? this.FinancebiddingDetails.Remarks.invoiceAmt : false],
    //   Repayment_Date: [this.FinancebiddingDetails ? this.FinancebiddingDetails.Remarks.Repayment_Date : false],
    //   Funding_CCY: [this.FinancebiddingDetails ? this.FinancebiddingDetails.Remarks.Funding_CCY : false],
    //   Off_date:[this.FinancebiddingDetails ? this.FinancebiddingDetails.Remarks.Off_date : false],
    //   Others:[this.FinancebiddingDetails ? this.FinancebiddingDetails.Remarks.Others : false],
    //   OthersRemarks:[this.FinancebiddingDetails ? this.FinancebiddingDetails.Remarks.OthersRemarks : '']
    // })
    this.Rejectform = this.fb.group({
      Inv_Discount_Low: [false],
      Annual_Yield: [false],
      Fundable_percentage_low: [false],
      Funding_Amount_High: [false],
      Net_payable: [false],
      Base_Amount: [false],
      invoiceAmt: [false],
      Repayment_Date: [false],
      Funding_CCY: [false],
      Off_date:[false],
      Others:[false],
      OthersRemarks:['']
    })
  }
}


