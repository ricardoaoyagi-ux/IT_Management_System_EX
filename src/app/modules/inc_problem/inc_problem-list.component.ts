
@Component({ selector: 'app-inc_problem-list', templateUrl: './inc_problem-list.component.html' })
export class Inc_problemListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: Inc_problemService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
