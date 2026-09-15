import { Component } from '@angular/core';
import { JustificativaReaberturaService } from './reabertura.service';
import { JustificativaListComponent } from './justificativa-list.component';


@Component({
    standalone: true,
    imports: [JustificativaListComponent],
    template: `
      <app-justificativa-list
        titulo="Justificativa de Reabertura"
        [service]="service">
      </app-justificativa-list>
    `
  })
  export class JustificativaReaberturaPageComponent {
    constructor(public service: JustificativaReaberturaService) {}
  }
  