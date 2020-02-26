import React, {useState} from "react";


export default function useVisualMode(initMode) {
  const [mode,setMode] = useState(initMode);
  const [history, setHistory] = useState([initMode]);

  function transition(newMode, backToStart) {
    if (backToStart) {
      setMode(newMode);
      history.pop();
      setHistory(prev => [...prev,newMode]);
    } else {
      setMode(newMode);
      setHistory(prev => [...prev,newMode]);
    }
  }

  function back() {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      history.pop();
    } else if (history.length === 1) {
      setMode(history[history.length - 1]);
      history.pop();
    }
  }

  return {mode, transition, back};

}

