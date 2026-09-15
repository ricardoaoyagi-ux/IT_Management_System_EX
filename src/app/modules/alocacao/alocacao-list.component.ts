
@Component({ selector: 'app-alocacao-list', templateUrl: './alocacao-list.component.html' })
export class AlocacaoListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: AlocacaoService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
