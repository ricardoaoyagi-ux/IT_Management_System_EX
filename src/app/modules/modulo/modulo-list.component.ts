
@Component({ selector: 'app-modulo-list', templateUrl: './modulo-list.component.html' })
export class ModuloListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: ModuloService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
