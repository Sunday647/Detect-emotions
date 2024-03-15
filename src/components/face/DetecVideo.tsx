import * as faceapi from "@vladmandic/face-api/dist/face-api.esm.js";
import { useEffect, useState } from "react";
import { GetProp, Button, Upload, UploadFile, UploadProps } from "antd";
import "./index.scss";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const DetectVideo = () => {
  const video = document.getElementById("video");
  const [isReady, setIsReady] = useState(false);
  const [isOpenVideo, setIsoOpenVideo] = useState(false);
  const [emotion, setEmotion] = useState("");

  const startVideo = () => {
    navigator.getUserMedia(
      { video: { width: 1280, height: 720 } },
      (stream: any) => {
        video!.srcObject = stream;
        video!.onloadedmetadata = (e) => {
          video!.play();
          setIsoOpenVideo(true);
        };
      },
      (err) => {
        console.error(`The following error occurred: ${err.name}`);
      }
    );
  };

  const stopVideo = () => {
    const stream = video!.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    video!.srcObject = null;
    setIsoOpenVideo(false);
  };

  // video.addEventListener("play", () => {
  //   const canvas = faceapi.createCanvasFromMedia(video);
  //   // const canvas = document.createElement("canvas");
  //   canvas.style.position = "absolute";
  //   document.body.append(canvas);
  //   const displaySize = { width: video.width, height: video.height };
  //   faceapi.matchDimensions(canvas, displaySize);
  //   setInterval(async () => {
  //     const detections = await faceapi
  //       .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
  //       .withFaceLandmarks()
  //       .withFaceExpressions();
  //     const resizedDetections = faceapi.resizeResults(detections, displaySize);
  //     canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  //     faceapi.draw.drawDetections(canvas, resizedDetections);
  //     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  //     faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  //   }, 100);
  // });

  return (
    <div className="contentWrap">
      <div className="operaion">
        <Button type="primary" onClick={isOpenVideo ? stopVideo : startVideo}>
          {isOpenVideo ? "Stop Video" : "Start Video"}
        </Button>
      </div>

      <video id="video" style={{ width: 400, height: 450 }} />
      <div>
        {`The above person is `}{" "}
        <span>{`${emotion ? emotion : "analysising"}`}</span>
      </div>
    </div>
  );
};
export default DetectVideo;
