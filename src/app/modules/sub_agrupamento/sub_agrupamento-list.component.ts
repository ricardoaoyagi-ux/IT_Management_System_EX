
@Component({ selector: 'app-sub_agrupamento-list', templateUrl: './sub_agrupamento-list.component.html' })
export class Sub_agrupamentoListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: Sub_agrupamentoService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
