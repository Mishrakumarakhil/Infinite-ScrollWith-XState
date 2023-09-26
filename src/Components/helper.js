import { assign } from "xstate";
import axios from "axios";
const API_URL = "app-api/v1/photo-gallery-feed-page/page";

//  actions

export const actions = {
  filterDataByTitle: assign({
    data: (context) => {
      const { data } = context;
      const searchTerm = context.searchTerm;

      if (!searchTerm) {
        return data;
      }
      // Filter data based on the title containing the search term.
      return data.filter((item) =>
        item.node.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  }),
  startLoading: assign({
    loading: true,
  }),
  stopLoading: assign({
    loading: false,
  }),
  updateInputValue: assign({
    searchTerm: (_, event) => {
      return event.value;
    },
  }),

  updateFilterData: assign({
    filteredData: (_, event) => {
      return event.filteredData;
    },
  }),
};

// Service

export const services = {
  fetchArticles: async (context) => {
    const { page } = context;
    try {
      const response = await axios.get(`${API_URL}/${page}`);
      const newArticles = response.data;
      if (newArticles?.nodes?.length === 0) {
        return Promise.reject("No more data available.");
      }
      return newArticles;
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
