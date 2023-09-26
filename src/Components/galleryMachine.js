import { createMachine, assign } from "xstate";

export const galleryMachine = createMachine({
  id: "gallery",
  initial: "idle",
  //states object 
  context: {
    data: [],
    page: 1,
    loading: false,
  },
  //
  states: {
    idle: {
      on: {
        FETCH: "loading",
      },
    },


    loading: {
        entry: "startLoading",
        invoke: {
          src: "fetchArticles",
          onDone: {
            target: "success",
            actions: [
              assign({
                data: (context, event) => [...context.data, ...event.data.nodes],
                page: (context) => context.page + 1,
              }),
              "stopLoading",
            ],
          },
          onError: {
            target: "failure",
            actions: ["stopLoading"],
          },
        },
      },

    success: {
      entry: "filterDataByTitle",
      on: {
        FETCH: "loading",
      },
    },
    failure: {
      on: {
        RETRY: "loading",
      },
    },
  },
});
