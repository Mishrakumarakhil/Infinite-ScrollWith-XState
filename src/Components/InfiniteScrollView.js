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
      console.log("hellllo", data);
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
      console.log("input Value change", event);

      return event.value
    }
  }),

  updateFilterData: assign({
    data: (context, event) => {
      console.log("input filter change", context, event);
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

  const { loading, data, searchTerm } = state.context;

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
    console.log("INPUT",send({ type: "FETCH"}))
    send("FETCH");

    return () => {
      console.log("Component unmounted");
    };
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
    console.log("he09809890", filteredData);

    send({ type: "FILTER", filteredData });
  }, [searchTerm]);

  const handleInputChange = (e) => {
    // Send an event to update the input value in the state machine
    console.log("INPUT",send({ type: "INPUT", value: e.target.value }))
    send({ type: "INPUT", value: e.target.value });
  };
  console.log("helllo", loading, data, searchTerm);

  return (
    <>
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={handleInputChange}
        //   (e) => {
        //   console.log("Input changed"); // Add this line
        //   const searchTerms = e.target.value;
        //   send({ type: "SEARCH", searchTerms });
        // }}
      />
      <Card data={data} loading={loading} />
    </>
  );
};

export default InfiniteScrollView;
