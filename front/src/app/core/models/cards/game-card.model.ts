import { CardBaseInterface } from './card.interface';
import { CardModelBase } from './card-base.model';

export class GameCardModel extends CardModelBase<GameCardModel> {
  constructor(card: CardBaseInterface<GameCardModel>) {
    super(card);
  }
}
