const fs = require('fs');
const path = require('path');

const config = require('./crud-config.json');
const base = 'src/app/modules';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

config.forEach(table => {
  const name = table.name;
  const className = capitalize(name);
  const dir = path.join(base, name);

  fs.mkdirSync(dir, { recursive: true });

  // MODEL
  fs.writeFileSync(`${dir}/${name}.model.ts`, `
export interface ${className} {
  id: number;
${table.fields.map(f => `  ${f.name}: ${f.type};`).join('\n')}
}
`);

  // SERVICE
  fs.writeFileSync(`${dir}/${name}.service.ts`, `
@Injectable({ providedIn: 'root' })
export class ${className}Service {
  private api = '/api/${name}';
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<any[]>(this.api); }
  getById(id: number) { return this.http.get<any>(\`\${this.api}/\${id}\`); }
  create(data: any) { return this.http.post(this.api, data); }
  update(id: number, data: any) { return this.http.put(\`\${this.api}/\${id}\`, data); }
  delete(id: number) { return this.http.delete(\`\${this.api}/\${id}\`); }
}
`);

  // COMPONENTS
  fs.writeFileSync(`${dir}/${name}-list.component.ts`, `
@Component({ selector: 'app-${name}-list', templateUrl: './${name}-list.component.html' })
export class ${className}ListComponent implements OnInit {
  data: any[] = [];
  constructor(private service: ${className}Service) {}
  ngOnInit() { this.service.getAll().subscribe(r => this.data = r); }
}
`);

  fs.writeFileSync(`${dir}/${name}-form.component.ts`, `
@Component({ selector: 'app-${name}-form', templateUrl: './${name}-form.component.html' })
export class ${className}FormComponent {}
`);
});

console.log('✔ CRUD gerado com sucesso');
