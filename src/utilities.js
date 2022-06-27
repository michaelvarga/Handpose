const fingerPoints = {
  thumb: [0, 1, 2, 3, 4],
  index: [0, 5, 6, 7, 8],
  middle: [0, 9, 10, 11, 12],
  ring: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20]
}

//drawing function
export const drawHand = (predictions, canvas) => {
  //if a hand is detected (there are predictions)
  if(predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;
      //loop through fingers
      for (let j = 0; j < Object.keys(fingerPoints).length; j++) {
        //loop through joints on each finger, and draw path to connect them
        let finger = Object.keys(fingerPoints)[j];
        for (let k = 0; k < fingerPoints[finger].length - 1; k++) {
          const firstJointIdx = fingerPoints[finger][k];
          const secondJointIdx = fingerPoints[finger][k + 1];
          canvas.beginPath();
          canvas.moveTo(
            landmarks[firstJointIdx][0],
            landmarks[firstJointIdx][1]
          );
          canvas.lineTo(
            landmarks[secondJointIdx][0],
            landmarks[secondJointIdx][1]
          );
          canvas.strokeStyle = "yellow";
          canvas.lineWidth = 4;
          canvas.stroke();
        }
      }

      //loop through the landmarks on hand and draw them on canvas
      for (let i = 0; i < landmarks.length; i++) {
        //get x, y points
        const x = landmarks[i][0];
        const y = landmarks[i][1];
        //draw
        canvas.beginPath();
        canvas.arc(x, y, 5, 0, 3 * Math.PI);

        canvas.fillStyle = "aqua";
        canvas.fill();
      }
    })
  }
}
