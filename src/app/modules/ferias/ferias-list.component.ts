
@Component({ selector: 'app-ferias-list', templateUrl: './ferias-list.component.html' })
export class FeriasListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: FeriasService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
