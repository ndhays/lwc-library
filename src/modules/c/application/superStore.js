import ReduxToolkit from './reduxToolkit';
const { configureStore, combineReducers, createSlice, createSelector } = ReduxToolkit.default;


/* MIDDLEWARE */
const basicLogger = (store) => (next) => (action) => {
  console.log("Action:", action);
  const result = next(action);
  console.log("State:", store.getState());
  return result;
};

/* SUPERSTORE */
export default class SuperStore {

  // static createAction = createAction;
  static createSelector = createSelector;

  _actions = {};
  actions = () => this._actions;
  
  _store;
  getStore = () => this._store;

  createSlice = (slice) => {
    this.addSlice(slice);
    return this._actions[slice.name];
  };
  
  _selectors = {};
  selectors = () => this._selectors;

  registerSelector = (name, ...inputSelectors) => {
    const selector = createSelector(inputSelectors);
    this._selectors[name] = selector;
  };

  constructor() {
    this._store = configureStore({
      reducer: {},
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(basicLogger),
    });
    this.slices = {};
  }

  addSlice(sliceOrSlices) {
    const slices = [].concat(sliceOrSlices);
    slices.forEach((slice) => {
      if (this.slices[slice.name]) {
        throw new Error(`Slice ${slice.name} already exists`);
      }
      this.slices[slice.name] = slice;
    });    
    this._setupStore();
  }

  addSliceIfNotExists(sliceNameOrNames) {
    const sliceNames = [].concat(sliceNameOrNames);
    sliceNames.forEach((sliceName) => {
      if (!this.slices[sliceName]) {
        this.addSlice(this.genericSlice(sliceName));
      }
    });
  }

  genericSlice(sliceName) {
    return {
      name: sliceName,
      initialState: {},
      reducers: {
        update: (state, action) => {
          Object.assign(state, action.payload);
        },
      }
    };
  }

  removeSlice(slice) {
    if (!this.slices[slice.name]) {
      throw new Error(`Slice ${slice.name} does not exist`);
    }
    delete this.slices[slice.name];
    delete this._actions[slice.name]; // delete actions
    this._setupStore();
  }

  subscribeToSelector(selectorFn) {

  }

  _setupStore() {
    const reducers = {};
    Object.values(this.slices).forEach((slice) => {
      const { actions, reducer } = createSlice(slice);
      reducers[slice.name] = reducer;
      // create simple actions
      const simpleActions = {};
      Object.keys(slice.reducers).forEach((reducerName) => {
        simpleActions[reducerName] = (payload) => {
          const action = actions[reducerName](payload);
          return this._store.dispatch(action);
        };
      });
      this._actions[slice.name] = simpleActions;
    });
    this._store.replaceReducer(
      combineReducers(reducers)
    );
  }
}