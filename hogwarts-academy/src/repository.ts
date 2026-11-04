import type { Wizard, Spell, NewWizard } from "./types";
import { Log, MeasureTime, ValidateSpellPower } from "./decorators";

export class Repository<T extends { id: number }> {
  private items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

export class WizardRepository extends Repository<Wizard> {
  // Exercice 1 : l'id est attribué ici, pas par l'appelant
  create(data: NewWizard): Wizard {
    const id = Math.max(0, ...this.getAll().map(w => w.id)) + 1;
    const wizard = { ...data, id } as Wizard;
    this.add(wizard);
    return wizard;
  }

  // Exercice 2 : filtrer par maison
  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter(wizard => wizard.house === house);
  }
}

export class SpellRepository extends Repository<Spell> {
  // Exercice 4 : refuse un sort dont la puissance est négative
  @ValidateSpellPower
  override add(spell: Spell): void {
    super.add(spell);
  }
}