
@Component({ selector: 'app-aplicacoes-list', templateUrl: './aplicacoes-list.component.html' })
export class AplicacoesListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: AplicacoesService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
