
@Component({ selector: 'app-problems-list', templateUrl: './problems-list.component.html' })
export class ProblemsListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: ProblemsService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
