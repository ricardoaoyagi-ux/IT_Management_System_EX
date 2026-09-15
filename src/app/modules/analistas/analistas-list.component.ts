
@Component({ selector: 'app-analistas-list', templateUrl: './analistas-list.component.html' })
export class AnalistasListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: AnalistasService) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
