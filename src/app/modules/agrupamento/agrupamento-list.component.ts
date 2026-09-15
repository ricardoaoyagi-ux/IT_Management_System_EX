
@Component({ selector: 'app-agrupamento-list', templateUrl: './agrupamento-list.component.html' })
export class AgrupamentoListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: AgrupamentoService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
