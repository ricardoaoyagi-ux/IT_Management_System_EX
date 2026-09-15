
@Component({ selector: 'app-rates-list', templateUrl: './rates-list.component.html' })
export class RatesListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: RatesService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
