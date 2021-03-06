import * as actions from './actions';
import {
  LayerUtil,
  VectorLayer,
} from 'app/scripts/model/layers';
import * as _ from 'lodash';

export interface State {
  readonly vectorLayer: VectorLayer;
  readonly selectedLayerIds: Set<string>;
  readonly collapsedLayerIds: Set<string>;
  readonly hiddenLayerIds: Set<string>;
}

export function buildInitialState() {
  return {
    vectorLayer: new VectorLayer(),
    selectedLayerIds: new Set(),
    collapsedLayerIds: new Set(),
    hiddenLayerIds: new Set(),
  } as State;
}

export function reducer(state = buildInitialState(), action: actions.Actions) {
  switch (action.type) {

    // Import vector layers into the tree.
    case actions.IMPORT_VECTOR_LAYERS: {
      const importedVls = action.payload.vectorLayers.slice();
      if (!importedVls.length) {
        return state;
      }
      const { vectorLayer } = state;
      let vectorLayers = [vectorLayer];
      if (!vectorLayer.children.length) {
        // Simply replace the empty vector layer rather than merging with it.
        const vl = importedVls[0].clone();
        vl.name = vectorLayer.name;
        importedVls[0] = vl;
        vectorLayers = [];
      }
      const newVectorLayers = [...vectorLayers, ...importedVls];
      if (newVectorLayers.length === 1) {
        return { ...state, vectorLayer: newVectorLayers[0] };
      } else {
        return { ...state, vectorLayer: newVectorLayers.reduce(LayerUtil.mergeVectorLayers) };
      }
    }

    // Add a layer to the tree.
    case actions.ADD_LAYER: {
      // TODO: add the layer below the currently selected layer, if one exists
      const { layer } = action.payload;
      const vectorLayer = state.vectorLayer.clone();
      vectorLayer.children = vectorLayer.children.concat([layer]);
      return { ...state, vectorLayer };
    }

    // Expand/collapse a layer.
    case actions.TOGGLE_LAYER_EXPANSION: {
      const { layerId, recursive } = action.payload;
      const layerIds = new Set([layerId]);
      if (recursive) {
        const layer = state.vectorLayer.findLayerById(layerId);
        if (layer) {
          layer.walk(l => layerIds.add(l.id));
        }
      }
      const collapsedLayerIds = new Set(state.collapsedLayerIds);
      if (collapsedLayerIds.has(layerId)) {
        layerIds.forEach(id => collapsedLayerIds.delete(id));
      } else {
        layerIds.forEach(id => collapsedLayerIds.add(id));
      }
      return { ...state, collapsedLayerIds };
    }

    // Show/hide a layer.
    case actions.TOGGLE_LAYER_VISIBILITY: {
      const { layerId } = action.payload;
      const hiddenLayerIds = new Set(state.hiddenLayerIds);
      if (hiddenLayerIds.has(layerId)) {
        hiddenLayerIds.delete(layerId);
      } else {
        hiddenLayerIds.add(layerId);
      }
      return { ...state, hiddenLayerIds };
    }

    // Replace a layer.
    case actions.REPLACE_LAYER: {
      const replacementLayer = action.payload.layer;
      const vectorLayer = LayerUtil.replaceLayerInTree(state.vectorLayer, replacementLayer);
      return { ...state, vectorLayer };
    }

    // Select a layer.
    case actions.SELECT_LAYER: {
      const { layerId, shouldToggle, clearExisting } = action.payload;
      return selectLayerId(state, layerId, shouldToggle, clearExisting);
    }

    // Delete all selected layers.
    case actions.DELETE_SELECTED_MODELS: {
      return deleteSelectedLayers(state);
    }

    case actions.CLEAR_LAYER_SELECTIONS:
    case actions.SELECT_ANIMATION:
    case actions.SELECT_BLOCK:
    case actions.ADD_BLOCK: {
      return { ...state, selectedLayerIds: new Set() };
    }
  }
  return state;
}

function selectLayerId(
  state: State,
  layerId: string,
  shouldToggle: boolean,
  clearExisting: boolean,
) {
  const selectedLayerIds = new Set(state.selectedLayerIds);
  if (clearExisting) {
    selectedLayerIds.forEach(id => {
      if (id !== layerId) {
        selectedLayerIds.delete(id);
      }
    });
  }
  if (shouldToggle && selectedLayerIds.has(layerId)) {
    selectedLayerIds.delete(layerId);
  } else {
    selectedLayerIds.add(layerId);
  }
  return { ...state, selectedLayerIds };
}

function deleteSelectedLayers(state: State) {
  let { vectorLayer } = state;
  const collapsedLayerIds = new Set(state.collapsedLayerIds);
  const hiddenLayerIds = new Set(state.hiddenLayerIds);
  if (state.selectedLayerIds.has(vectorLayer.id)) {
    vectorLayer = new VectorLayer();
    collapsedLayerIds.clear();
    hiddenLayerIds.clear();
  } else {
    state.selectedLayerIds.forEach(layerId => {
      vectorLayer = LayerUtil.removeLayerFromTree(vectorLayer, layerId);
      collapsedLayerIds.delete(layerId);
      hiddenLayerIds.delete(layerId);
    });
  }
  return {
    ...state,
    vectorLayer,
    selectedLayerIds: new Set(),
    collapsedLayerIds,
    hiddenLayerIds,
  };
}
