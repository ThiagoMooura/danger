import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
} from '@angular/core';import hljs from 'highlight.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import cronstrue from 'cronstrue/i18n';
import { CronEditorComponent } from '../cron-editor/cron-editor.component';

interface CronField {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  max: number;
  min: number;
  examples: string[];
  hint: string;
}
 
interface CronPreset {
  label: string;
  expr: string;
}

@Component({
  selector: 'app-deploy',
  standalone: true,
  templateUrl: './deploy.component.html',
  imports: [CommonModule, FormsModule, CronEditorComponent],
  styleUrls: ['./deploy.component.scss']
})

export class DeployComponent implements OnInit, AfterViewInit  {

  @ViewChildren('cronInput') cronInputs!: QueryList<ElementRef<HTMLInputElement>>;

  fields: CronField[] = [
    {
      id: 'minute',
      label: 'Minuto',
      value: '*',
      placeholder: '*',
      min: 0,
      max: 59,
      examples: ['0-59', '*/5', '0,30', '0-30'],
      hint: '',
    },
    {
      id: 'hour',
      label: 'Hora',
      value: '*',
      placeholder: '*',
      min: 0,
      max: 23,
      examples: ['0-23', '*/2', '8-18', '0,6,12,18'],
      hint: '',
    },
    {
      id: 'dayMonth',
      label: 'Dia do mês',
      value: '*',
      placeholder: '*',
      min: 1,
      max: 31,
      examples: ['1-31', '*/2', '1,15', '1-7'],
      hint: '',
    },
    {
      id: 'month',
      label: 'Mês',
      value: '*',
      placeholder: '*',
      min: 1,
      max: 12,
      examples: ['1-12', '*/3', '1,6,12', 'JAN,JUN'],
      hint: '',
    },
    {
      id: 'dayWeek',
      label: 'Dia da semana',
      value: '*',
      placeholder: '*',
      min: 0,
      max: 6,
      examples: ['0-6', '1-5', '0,6', 'MON-FRI'],
      hint: '',
    },
  ];

  presets: CronPreset[] = [
    { label: 'A cada minuto', expr: '* * * * *' },
    { label: 'A cada 5 min', expr: '*/5 * * * *' },
    { label: 'A cada 15 min', expr: '*/15 * * * *' },
    { label: 'A cada hora', expr: '0 * * * *' },
    { label: 'A cada 6 horas', expr: '0 */6 * * *' },
    { label: 'Meia-noite', expr: '0 0 * * *' },
    { label: 'Seg–Sex 9h', expr: '0 9 * * 1-5' },
    { label: 'Todo dia 1°', expr: '0 0 1 * *' },
    { label: 'Todo domingo', expr: '0 0 * * 0' },
  ];
 
  description = '';
  isValid = true;
  copyLabel = 'Copiar';
  copySuccess = false;

  code = `def criar_produto(nome, preco, quantidade):
  """Cria e retorna um dicionário representando um produto."""
  return {"nome": nome, "preco": float(preco), "quantidade": int(quantidade)}`;

  highlightedCode = '';

  ngOnInit(): void {
    this.updateDescription();
    this.highlightedCode = hljs.highlight(this.code, {
      language: 'python'
    }).value;
  }

  ngAfterViewInit(): void {}

  get cronExpression(): string {
    return this.fields.map((f) => f.value.trim() || '*').join(' ');
  }
 
  onInput(): void {
    this.updateDescription();
  }
 
  onFocus(field: CronField): void {
    const ex = field.examples[Math.floor(Math.random() * field.examples.length)];
    field.hint = `ex: ${ex}`;
  }
 
  onBlur(field: CronField): void {
    field.hint = '';
  }
 
  onKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    const inputs = this.cronInputs.toArray();
 
    switch (event.key) {
      case 'ArrowRight':
        if (input.selectionStart === input.value.length) {
          event.preventDefault();
          const next = inputs[(index + 1) % inputs.length];
          next.nativeElement.focus();
          next.nativeElement.select();
        }
        break;
 
      case 'ArrowLeft':
        if (input.selectionStart === 0) {
          event.preventDefault();
          const prev = inputs[(index + inputs.length - 1) % inputs.length];
          prev.nativeElement.focus();
          prev.nativeElement.select();
        }
        break;
 
      case 'ArrowUp':
        event.preventDefault();
        this.nudgeValue(index, 1);
        break;
 
      case 'ArrowDown':
        event.preventDefault();
        this.nudgeValue(index, -1);
        break;
    }
  }
 
  private nudgeValue(index: number, direction: 1 | -1): void {
    const field = this.fields[index];
    const v = field.value.trim();
 
    if (/^\d+$/.test(v)) {
      const n = Math.max(field.min, Math.min(parseInt(v, 10) + direction, field.max));
      field.value = String(n);
    } else if (v === '*') {
      field.value = String(direction > 0 ? field.min : field.max);
    }
 
    this.updateDescription();
  }
 
  applyPreset(expr: string): void {
    const parts = expr.split(' ');
    this.fields.forEach((f, i) => {
      f.value = parts[i] ?? '*';
    });
    this.updateDescription();
    setTimeout(() => this.cronInputs.first?.nativeElement.focus(), 0);
  }
 
  updateDescription(): void {
    try {
      const raw = cronstrue.toString(this.cronExpression, {
        locale: 'pt_BR',
        use24HourTimeFormat: true,
      });
      this.description = raw.replace('da hora', 'de cada hora');
      this.isValid = true;
    } catch {
      this.description = 'Expressão inválida — verifique os campos';
      this.isValid = false;
    }
  }
 
  async copyExpression(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.cronExpression);
      this.copySuccess = true;
      this.copyLabel = 'Copiado';
      setTimeout(() => {
        this.copySuccess = false;
        this.copyLabel = 'Copiar';
      }, 1800);
    } catch {
      // fallback silencioso
    }
  }
}