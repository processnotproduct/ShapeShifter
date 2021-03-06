import { DeleteSelectedModels } from '../common/actions';
import {
  ClearLayerSelections,
  SelectLayer,
} from '../layers/actions';
import { Action } from '@ngrx/store';
import { Layer } from 'app/scripts/model/layers';
import { Animation, AnimationBlock } from 'app/scripts/model/timeline';

export const ADD_ANIMATION = '__timeline__ADD_ANIMATION';
export const ACTIVATE_ANIMATION = '__timeline__ACTIVATE_ANIMATION';
export const REPLACE_ANIMATIONS = '__timeline__REPLACE_ANIMATIONS';
export const SELECT_ANIMATION = '__timeline__SELECT_ANIMATION';
export const ADD_BLOCK = '__timeline__ADD_BLOCK';
export const REPLACE_BLOCKS = '__timeline__REPLACE_BLOCKS';
export const SELECT_BLOCK = '__timeline__SELECT_BLOCK';
export { CLEAR_LAYER_SELECTIONS, SELECT_LAYER } from '../layers/actions';
export { DELETE_SELECTED_MODELS } from '../common/actions';

export class AddAnimation implements Action {
  readonly type = ADD_ANIMATION;
  readonly payload: { animation: Animation };
  constructor(animation: Animation) {
    this.payload = { animation };
  }
}

export class ActivateAnimation implements Action {
  readonly type = ACTIVATE_ANIMATION;
  readonly payload: { animationId: string };
  constructor(animationId: string) {
    this.payload = { animationId };
  }
}

export class ReplaceAnimations implements Action {
  readonly type = REPLACE_ANIMATIONS;
  readonly payload: { animations: ReadonlyArray<Animation> };
  constructor(animations: ReadonlyArray<Animation>) {
    this.payload = { animations };
  }
}

export class SelectAnimation implements Action {
  readonly type = SELECT_ANIMATION;
  readonly payload: { animationId: string, clearExisting: boolean };
  constructor(animationId: string, clearExisting = false) {
    this.payload = { animationId, clearExisting };
  }
}

export class AddBlock implements Action {
  readonly type = ADD_BLOCK;
  readonly payload: {
    layer: Layer,
    propertyName: string,
    fromValue: any,
    toValue: any,
    activeTime: number,
  };
  constructor(
    layer: Layer,
    propertyName: string,
    fromValue: any,
    toValue: any,
    activeTime: number,
  ) {
    this.payload = { layer, propertyName, fromValue, toValue, activeTime };
  }
}

export class ReplaceBlocks implements Action {
  readonly type = REPLACE_BLOCKS;
  readonly payload: { blocks: ReadonlyArray<AnimationBlock> };
  constructor(blocks: ReadonlyArray<AnimationBlock>) {
    this.payload = { blocks };
  }
}

export class SelectBlock implements Action {
  readonly type = SELECT_BLOCK;
  readonly payload: { blockId: string, clearExisting: boolean };
  constructor(blockId: string, clearExisting = true) {
    this.payload = { blockId, clearExisting };
  }
}

export type Actions =
  AddAnimation
  | ActivateAnimation
  | ReplaceAnimations
  | SelectAnimation
  | AddBlock
  | ReplaceBlocks
  | SelectBlock
  | ClearLayerSelections
  | SelectLayer
  | DeleteSelectedModels;
