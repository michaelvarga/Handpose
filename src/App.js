import React, { useRef, useState } from "react";
import * as ts from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";
import { thumbsDownGesture } from "./gestures/ThumbsDown";
import { style } from "./component-style";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [emoji, setEmoji] = useState(null);

  //load the handpose model
  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Hand gesture model loaded");
    //loop to continuously detect hands in video
    setInterval(() => {
      detect(net);
    }, 100);
  };

  //detect a hand in the video
  const detect = async (net) => {
    //Check that data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      //Get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      //Set video height/width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      //Set canvas height/width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //Make detections
      const hand = await net.estimateHands(video);

      if (hand.length > 0) {
        const ge = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
          thumbsDownGesture,
        ]);
        const gesture = await ge.estimate(hand[0].landmarks, 8);
        console.log("Gestures", gesture.gestures);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const confidence = gesture.gestures.map((gesture) => gesture.score);
          //find the gesture that has highest confidence to set in our state
          const maxConfIdx = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          setEmoji(gesture.gestures[maxConfIdx].name);
        }
      }

      //Draw mesh
      const canvas = canvasRef.current.getContext("2d");
      drawHand(hand, canvas);
    }
  };

  runHandpose();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam id="webcam" ref={webcamRef} style={style.webcam} />
        <canvas ref={canvasRef} style={style.canvas} />
      </header>

      {emoji ? (
        <img
          src={require(`./emojis/${emoji}.png`)}
          alt={emoji}
          className="gesture-emoji"
          style={style.img}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
