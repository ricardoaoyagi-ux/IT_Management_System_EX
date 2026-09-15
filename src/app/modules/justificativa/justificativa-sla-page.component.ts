import { Component } from '@angular/core';
import { JustificativaSlaService } from './sla.service';
import { JustificativaListComponent } from './justificativa-list.component';

@Component({
  standalone: true,
  imports: [JustificativaListComponent],
  template: `
    <app-justificativa-list
      titulo="Justificativa de SLA"
      [service]="service">
    </app-justificativa-list>
  `
})
export class JustificativaSlaPageComponent {
  constructor(public service: JustificativaSlaService) {}
}
