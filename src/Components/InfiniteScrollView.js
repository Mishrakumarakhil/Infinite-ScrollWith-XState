import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import Card from "./Card";
import { galleryMachine } from "./galleryMachine";
import { actions, services } from "./helper";

const InfiniteScrollView = () => {
  const [state, send] = useMachine(galleryMachine, {
    actions,
    services,
  });

  const { loading, data, searchTerm, filteredData } = state.context;

  //Mounting
  useEffect(() => {
    send("FETCH");
  }, []);

  const handleScroll = (e) => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      if (!loading && state.matches("idle")) {
        send("FETCH");
      }
    }
  };

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
