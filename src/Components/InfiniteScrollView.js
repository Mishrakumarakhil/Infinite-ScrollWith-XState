import React, { useEffect } from "react";
import axios from "axios";
import { useMachine } from "@xstate/react";
import Card from "./Card";
import { galleryMachine } from "./galleryMachine";
import { assign } from "xstate";

const API_URL = "app-api/v1/photo-gallery-feed-page/page";

const actions = {
  filterDataByTitle: (context) => {
    const { data } = context;
  },
  startLoading: assign({
    loading: true,
  }),
  stopLoading: assign({
    loading: false,
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

  const { loading, data } = state.context;

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

  console.log("helllo", loading, data);

  return (
    <>
      <Card data={data} loading={loading} />
    </>
  );
};

export default InfiniteScrollView;
