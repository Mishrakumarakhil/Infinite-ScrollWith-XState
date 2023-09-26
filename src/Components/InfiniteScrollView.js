import React, { useEffect } from "react";
import axios from "axios";
import { useMachine } from "@xstate/react";
import Card from "./Card";
import { galleryMachine } from "./galleryMachine";
import { assign } from "xstate";

const API_URL = "app-api/v1/photo-gallery-feed-page/page";

const actions = {
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

const services = {
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

const InfiniteScrollView = () => {
  const [state, send] = useMachine(galleryMachine, {
    actions,
    services,
  });

  const { loading, data, searchTerm, filteredData } = state.context;

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      if (!loading && state.matches("idle")) {
        send("FETCH");
      }
    }
  };

  //Mounting
  useEffect(() => {
    send("FETCH");
  }, []);

  // Infinfite Scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [send]);

  useEffect(() => {
    const filteredData = data.filter((item) =>
      item.node.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    send({ type: "FILTER", filteredData });
  }, [searchTerm]);

  const handleInputChange = (e) => {
    send({ type: "INPUT", value: e.target.value });
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <Card
        data={searchTerm.trim().length > 0 ? filteredData : data}
        loading={loading}
      />
    </>
  );
};

export default InfiniteScrollView;
