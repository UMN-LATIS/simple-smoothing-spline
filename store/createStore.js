const __INIT__ = "__INIT__";

export function createStore(rootReducer) {
  let state = rootReducer(undefined, { type: __INIT__ });
  let listeners = [];
  return {
    getState: () => state,

    dispatch: (action) => {
      state = rootReducer(state, action);
      // trigger any listeners
      listeners.forEach((listener) => listener(state));
    },

    subscribe: (listener) => {
      listeners = [...listeners, listener];
      return function unsubscribe() {
        // remove this listener from listeners
        listeners = listeners.filter((l) => l !== listener);
      };
    },
  };
}
