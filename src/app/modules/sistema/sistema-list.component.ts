
@Component({ selector: 'app-sistema-list', templateUrl: './sistema-list.component.html' })
export class SistemaListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: SistemaService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
