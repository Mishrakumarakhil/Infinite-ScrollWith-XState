import { createMachine, assign } from "xstate";

export const galleryMachine = createMachine({
  id: "gallery",
  initial: "idle",
  context: {
    data: [],
    page: 1,
    loading: false,
    searchTerm: "",
    filteredData: [],
  },

  states: {
    idle: {
      on: {
        FETCH: "loading",
        INPUT: {
          actions: "updateInputValue",
        },

        FILTER: {
          actions: "updateFilterData",
        },
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
              data: (context, event) => {
                return [...context.data, ...event.data.nodes];
              },
              page: (context) =>
                context?.data?.nodes?.length == 0
                  ? context.page
                  : context.page + 1,
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
        INPUT: {
          actions: "updateInputValue",
        },
        FILTER: {
          actions: "updateFilterData",
        },
      },
    },
    failure: {
      on: {
        RETRY: "loading",
        INPUT: {
          actions: "updateInputValue",
        },
        FILTER: {
          actions: "updateFilterData",
        },
      },
    },
  },
  predictableActionArguments: true,
});
