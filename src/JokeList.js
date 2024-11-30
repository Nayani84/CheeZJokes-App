import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from './Joke';
import './JokeList.css';

/** List of jokes. */

function JokeList({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /* retrieve jokes from API */
    async function getJokes() {
      try {
        let jokes = [];
        let seenJokes = new Set();

        while (jokes.length < numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" },
          });

          const { id, joke } = res.data;

          if (!seenJokes.has(id)) {
            seenJokes.add(id);
            jokes.push({ id, joke, votes: 0 });
          } else {
            console.log("duplicate found!");
          }
        }
        setJokes(jokes);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    if (isLoading) getJokes();
  }, [isLoading, numJokesToGet]);

  /* empty joke list, set to loading state, and then call getJokes */
  function generateNewJokes() {
    setJokes([]);
    setIsLoading(true);
  };

  /* change vote for this id by delta (+1 or -1) */
  function vote(id, delta) {
    setJokes((jokes) =>
      jokes.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    );
  };

  /* render: either loading spinner or list of sorted jokes. */
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button
        className="JokeList-getmore"
        onClick={generateNewJokes}
      >
        Get New Jokes
      </button>

      {sortedJokes.map(({ id, joke, votes }) => (
        <Joke
          text={joke}
          key={id}
          id={id}
          votes={votes}
          vote={vote}
        />
      ))}
    </div>
  );
}

export default JokeList;