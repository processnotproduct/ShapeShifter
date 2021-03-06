import * as actions from './actions';
import {
  ActionMode,
  ActionSource,
  Hover,
  Selection,
  SelectionType,
} from 'app/scripts/model/actionmode';
import * as _ from 'lodash';

export interface State {
  readonly blockId: string;
  readonly mode: ActionMode;
  readonly hover: Hover;
  readonly selections: ReadonlyArray<Selection>;
  readonly pairedSubPaths: Set<number>;
  readonly unpairedSubPath: { source: ActionSource; subIdx: number; };
}

export function buildInitialState() {
  return {
    blockId: undefined,
    mode: ActionMode.None,
    hover: undefined,
    selections: [],
    // TODO: reset this stuff after mode switches
    pairedSubPaths: new Set<number>(),
    unpairedSubPath: undefined,
  } as State;
}

export function reducer(state = buildInitialState(), action: actions.Actions) {
  switch (action.type) {

    // Set the currently active block ID, enabling action mode.
    case actions.START_ACTION_MODE: {
      const { blockId } = action.payload;
      return { ...buildInitialState(), blockId, mode: ActionMode.Selection };
    }

    // Set the app mode during action mode.
    case actions.SET_ACTION_MODE: {
      const { mode } = action.payload;
      if (mode === ActionMode.None) {
        return buildInitialState();
      }
      let { selections } = state;
      if (mode === ActionMode.Selection && mode !== state.mode) {
        // Clear selections when switching back to selection mode.
        selections = [];
      }
      return { ...state, mode, selections };
    }

    // Set the hover mode during action mode.
    case actions.SET_ACTION_MODE_HOVER: {
      const { hover } = action.payload;
      return { ...state, hover };
    }

    // Set the path selections during action mode.
    case actions.SET_ACTION_MODE_SELECTIONS: {
      const { selections } = action.payload;
      return { ...state, selections };
    }

    // Toggle a subpath selection.
    case actions.TOGGLE_SUBPATH_SELECTION: {
      const { source, subIdx } = action.payload;
      let selections = state.selections.slice();
      _.remove(selections, s => s.type !== SelectionType.SubPath && s.source !== source);
      selections = toggleSelections(
        selections,
        [{ type: SelectionType.SubPath, source, subIdx }],
        false);
      return { ...state, selections };
    }

    // Toggle a segment selection.
    case actions.TOGGLE_SEGMENT_SELECTIONS: {
      const { source, segments } = action.payload;
      let selections = state.selections.slice();
      _.remove(selections, s => s.type !== SelectionType.Segment);
      selections = toggleSelections(
        selections,
        segments.map(segment => {
          const { subIdx, cmdIdx } = segment;
          return { type: SelectionType.Segment, source, subIdx, cmdIdx };
        }),
        false);
      return { ...state, selections };
    }

    // Toggle a point selection.
    case actions.TOGGLE_POINT_SELECTION: {
      const { source, subIdx, cmdIdx, appendToList } = action.payload;
      let selections = state.selections.slice();
      _.remove(selections, s => s.type !== SelectionType.Point && s.source !== source);
      selections = toggleSelections(
        selections,
        [{ type: SelectionType.Point, source, subIdx, cmdIdx }],
        appendToList,
      );
      return { ...state, selections };
    }
  }
  return state;
}

/**
 * Toggles the specified shape shifter selections. If a selection exists, all selections
 * will be removed from the list. Otherwise, they will be added to the list of selections.
 * By default, all other selections from the list will be cleared.
 */
function toggleSelections(
  currentSelections: Selection[],
  newSelections: Selection[],
  appendToList = false,
) {
  const matchingSelections = _.remove(currentSelections, currSel => {
    // Remove any selections that are equal to a new selection.
    return newSelections.some(newSel => _.isEqual(newSel, currSel));
  });
  if (!matchingSelections.length) {
    // If no selections were removed, then add all of the selections to the list.
    currentSelections.push(...newSelections);
  }
  if (!appendToList) {
    // If we aren't appending multiple selections at a time, then clear
    // any previous selections from the list.
    _.remove(currentSelections, currSel => {
      return newSelections.every(newSel => !_.isEqual(currSel, newSel));
    });
  }
  return currentSelections;
}
