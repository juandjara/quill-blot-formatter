// @flow

import Quill from 'quill';
import { Aligner } from './Aligner';
import type { Alignment } from './Alignment';

const Parchment = Quill.imports.parchment;
export const DEFAULT_ALIGNMENTS = {
  left: 'left',
  center: 'center',
  right: 'right',
};
const DEFAULT_ICONS = {
  [DEFAULT_ALIGNMENTS.left]: `
    <svg viewbox="0 0 18 18">
      <line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line>
      <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line>
      <line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line>
    </svg>`,
  [DEFAULT_ALIGNMENTS.center]: `
    <svg viewbox="0 0 18 18">
       <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
      <line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"></line>
      <line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"></line>
    </svg>`,
  [DEFAULT_ALIGNMENTS.right]: `
    <svg viewbox="0 0 18 18">
      <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
      <line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"></line>
      <line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"></line>
    </svg>`,
};

export default class DefaultAligner implements Aligner {
  alignments: { [string]: Alignment };
  floatStyle: any;
  marginStyle: any;
  displayStyle: any;
  alignAttribute: any;
  applyStyle: boolean;

  constructor(applyStyle: boolean, alignAttribute: string) {
    this.applyStyle = applyStyle;
    this.floatStyle = new Parchment.Attributor.Style('float', 'float');
    this.marginStyle = new Parchment.Attributor.Style('margin', 'margin');
    this.displayStyle = new Parchment.Attributor.Style('display', 'display');
    this.alignAttribute = new Parchment.Attributor.Attribute(alignAttribute, alignAttribute);
    this.alignments = {
      [DEFAULT_ALIGNMENTS.left]: {
        name: DEFAULT_ALIGNMENTS.left,
        icon: DEFAULT_ICONS[DEFAULT_ALIGNMENTS.left],
        apply: (el: HTMLElement) => {
          this.setAlignment(el, DEFAULT_ALIGNMENTS.left);
          this.setStyle(el, 'inline', 'left', '0 1em 1em 0');
        },
      },
      [DEFAULT_ALIGNMENTS.center]: {
        name: DEFAULT_ALIGNMENTS.center,
        icon: DEFAULT_ICONS[DEFAULT_ALIGNMENTS.center],
        apply: (el: HTMLElement) => {
          this.setAlignment(el, DEFAULT_ALIGNMENTS.center);
          this.setStyle(el, 'block', null, 'auto');
        },
      },
      [DEFAULT_ALIGNMENTS.right]: {
        name: DEFAULT_ALIGNMENTS.right,
        icon: DEFAULT_ICONS[DEFAULT_ALIGNMENTS.right],
        apply: (el: HTMLElement) => {
          this.setAlignment(el, DEFAULT_ALIGNMENTS.right);
          this.setStyle(el, 'inline', 'right', '0 0 1em 1em');
        },
      },
    };
  }

  getAlignments(): Alignment[] {
    return Object.keys(this.alignments).map(k => this.alignments[k]);
  }

  getCurrentAlignment(el: HTMLElement): ?Alignment {
    let alignment = null;

    this.getAlignments().forEach((candidate: Alignment) => {
      if (alignment !== null) {
        return;
      }

      if (this.isAligned(el, candidate)) {
        alignment = candidate;
      }
    });

    return alignment;
  }

  clear(el: HTMLElement): void {
    this.clearData(el);
    this.clearStyles(el);
  }

  clearData(el: HTMLElement): void {
    this.alignAttribute.remove(el);
  }

  clearStyles(el: HTMLElement): void {
    if (this.applyStyle) {
      this.floatStyle.remove(el);
      this.displayStyle.remove(el);
      this.marginStyle.remove(el);
    }
  }

  setAlignment(el: HTMLElement, value: string) {
    this.alignAttribute.add(el, value);
  }

  setStyle(el: HTMLElement, display: string, float: ?string, margin: string) {
    if (this.applyStyle) {
      this.displayStyle.add(el, display);
      this.marginStyle.add(el, margin);

      if (float) {
        this.floatStyle.add(el, float);
      } else {
        this.floatStyle.remove(el);
      }
    }
  }

  isAligned(el: HTMLElement, alignment: Alignment): boolean {
    return this.alignAttribute.value(el) === alignment.name;
  }
}
