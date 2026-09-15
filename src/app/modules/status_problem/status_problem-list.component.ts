
@Component({ selector: 'app-status_problem-list', templateUrl: './status_problem-list.component.html' })
export class Status_problemListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: Status_problemService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
