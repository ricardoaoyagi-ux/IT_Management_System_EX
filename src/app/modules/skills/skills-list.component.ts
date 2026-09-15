
@Component({ selector: 'app-skills-list', templateUrl: './skills-list.component.html' })
export class SkillsListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: SkillsService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
