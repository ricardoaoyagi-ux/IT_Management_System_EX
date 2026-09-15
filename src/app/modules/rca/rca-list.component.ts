
@Component({ selector: 'app-rca-list', templateUrl: './rca-list.component.html' })
export class RcaListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: RcaService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
