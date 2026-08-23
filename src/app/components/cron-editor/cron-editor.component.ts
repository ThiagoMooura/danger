import {
  Component,
  OnInit,
  signal,
  computed,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import cronstrue from 'cronstrue/i18n';
import { toEnglishCron, toNumericCron } from './cron-translation';

interface CronField {
  id: string;
  label: string;
  shortLabel: string;
  value: string;
  min: number;
  max: number;
  examples: string[];
}

interface CronPreset {
  label: string;
  expr: string;
}

@Component({
  selector: 'app-cron-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cron-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CronEditorComponent implements OnInit, AfterViewInit {
  @ViewChildren('cronInput') cronInputs!: QueryList<ElementRef<HTMLInputElement>>;

  // ── Estado ──────────────────────────────────────────────────────────────────
  readonly fields = signal<CronField[]>([
    { id: 'cron-minute', label: 'Minuto',        shortLabel: 'min',  value: '*', min: 0, max: 59, examples: ['0-59', '*/5', '0,30', '15'] },
    { id: 'cron-hour',   label: 'Hora',           shortLabel: 'hora', value: '*', min: 0, max: 23, examples: ['0-23', '*/2', '8-18', '9'] },
    { id: 'cron-dom',    label: 'Dia do mês',     shortLabel: 'dia',  value: '*', min: 1, max: 31, examples: ['1-31', '*/2', '1,15', '1'] },
    { id: 'cron-month',  label: 'Mês',            shortLabel: 'mês',  value: '*', min: 1, max: 12, examples: ['1-12', 'jan', 'abr,out', 'jan-jun'] },
    { id: 'cron-dow',    label: 'Dia da semana',  shortLabel: 'sem',  value: '*', min: 0, max: 6,  examples: ['0-6', 'seg-sex', 'dom,sab', 'qua'] },
  ]);

  readonly copyState = signal<'idle' | 'copied'>('idle');
  readonly announceMessage = signal('');
  readonly focusedIndex = signal<number | null>(null);
  readonly activeHint = signal('');

  // ── Computeds ───────────────────────────────────────────────────────────────

  /** Expressão normalizada com valores numéricos (exibição e cópia) */
  readonly cronExpression = computed(() =>
    toNumericCron(this.fields().map(f => f.value))
  );

  /** Expressão traduzida PT→EN para passar ao cronstrue */
  readonly cronExpressionEn = computed(() =>
    toEnglishCron(this.fields().map(f => f.value))
  );

  readonly descriptionResult = computed(() => {
    try {
      const raw = cronstrue.toString(this.cronExpressionEn(), {
        locale: 'pt_BR',
        use24HourTimeFormat: true,
      });
      return { ok: true, text: raw.replace('da hora', 'de cada hora') };
    } catch {
      return { ok: false, text: 'Expressão inválida — verifique os campos acima' };
    }
  });

  readonly isValid   = computed(() => this.descriptionResult().ok);
  readonly description = computed(() => this.descriptionResult().text);
  readonly copyLabel = computed(() => this.copyState() === 'copied' ? 'Copiado!' : 'Copiar');

  readonly presets: CronPreset[] = [
    { label: 'A cada minuto',  expr: '* * * * *'    },
    { label: 'A cada 5 min',   expr: '*/5 * * * *'  },
    { label: 'A cada 15 min',  expr: '*/15 * * * *' },
    { label: 'A cada hora',    expr: '0 * * * *'    },
    { label: 'A cada 6 horas', expr: '0 */6 * * *'  },
    { label: 'Meia-noite',     expr: '0 0 * * *'    },
    { label: 'Seg-Sex 9h',     expr: '0 9 * * seg-sex' },
    { label: 'Todo dia 1°',    expr: '0 0 1 * *'    },
    { label: 'Todo domingo',   expr: '0 0 * * dom'  },
  ];

  // ── Lifecycle ────────────────────────────────────────────────────────────────
  ngOnInit(): void {}
  ngAfterViewInit(): void {}

  // ── Handlers ─────────────────────────────────────────────────────────────────
  onInput(index: number, value: string): void {
    this.updateField(index, value);
  }

  onFocus(field: CronField, index: number): void {
    const ex = field.examples[Math.floor(Math.random() * field.examples.length)];
    this.focusedIndex.set(index);
    this.activeHint.set(`Exemplo: ${ex}`);
  }

  onBlur(_field: CronField): void {
    this.focusedIndex.set(null);
    this.activeHint.set('');
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
        this.nudge(index, 1);
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.nudge(index, -1);
        break;
    }
  }

  applyPreset(preset: CronPreset): void {
    const parts = preset.expr.split(' ');
    this.fields.update(fields =>
      fields.map((f, i) => ({ ...f, value: parts[i] ?? '*' }))
    );
    this.announceMessage.set(`Preset aplicado: ${preset.label}. ${this.description()}`);
    setTimeout(() => {
      this.cronInputs.first?.nativeElement.focus();
      setTimeout(() => this.announceMessage.set(''), 2000);
    }, 0);
  }

  async copyExpression(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.cronExpression());
      this.copyState.set('copied');
      this.announceMessage.set('Expressão copiada para a área de transferência');
      setTimeout(() => {
        this.copyState.set('idle');
        this.announceMessage.set('');
      }, 1800);
    } catch {}
  }

  trackByField(_: number, field: CronField): string {
    return field.id;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  private updateField(index: number, value: string): void {
    this.fields.update(fields =>
      fields.map((f, i) => i === index ? { ...f, value } : f)
    );
  }

  private nudge(index: number, dir: 1 | -1): void {
    const field = this.fields()[index];
    const v = field.value.trim();
    let newVal: string;

    if (/^\d+$/.test(v)) {
      const n = Math.max(field.min, Math.min(parseInt(v, 10) + dir, field.max));
      newVal = String(n);
    } else if (v === '*') {
      newVal = String(dir > 0 ? field.min : field.max);
    } else {
      return;
    }

    this.updateField(index, newVal);
  }
}