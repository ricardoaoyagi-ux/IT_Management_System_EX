
@Component({ selector: 'app-incidente-list', templateUrl: './incidente-list.component.html' })
export class IncidenteListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: IncidenteService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
