
@Component({ selector: 'app-tip_problem-list', templateUrl: './tip_problem-list.component.html' })
export class Tip_problemListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: Tip_problemService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
