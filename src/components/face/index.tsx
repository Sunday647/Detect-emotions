import * as faceapi from "@vladmandic/face-api/dist/face-api.esm.js";
import { useEffect, useState } from "react";
import {
  GetProp,
  Tabs,
  Upload,
  UploadFile,
  UploadProps,
  TabsProps,
} from "antd";
import "./index.scss";
import DetectVideo from "./DetecVideo";
import DetecImage from "./DetecImage";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const DetectFace = () => {
  const video = document.getElementById("video");
  const [type, setType] = useState<"video" | "image">("image");
  const [isReady, setIsReady] = useState(false);
  const [isOpenVideo, setIsoOpenVideo] = useState(false);
  const [emotion, setEmotion] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const items: TabsProps["items"] = [
    {
      key: "image",
      label: "检测图片",
      children: <DetecImage />,
    },
    {
      key: "video",
      label: "检测视频",
      children: <DetectVideo />,
    },
  ];

  const init = () => {
    // const dir =
    //   "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"; //
    const dir = "/models";
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(dir),
      faceapi.nets.tinyFaceDetector.loadFromUri(dir),
      faceapi.nets.faceLandmark68Net.loadFromUri(dir),
      faceapi.nets.faceRecognitionNet.loadFromUri(dir),
      faceapi.nets.faceExpressionNet.loadFromUri(dir),
      faceapi.nets.ageGenderNet.loadFromUri(dir),
    ]).then(() => {
      setIsReady(true);
      console.log("loaded all");
    });
  };
  const onChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const startAnalysisImg = () => {
    const img = document.getElementsByTagName("img")[0];
    img.crossOrigin = "anonymous";
    // const canvas = document.createElement("canvas");
    // canvas.style.position = "absolute";
    // document.body.append(canvas);
    // const ctx = canvas.getContext("2d");
    faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender()
      .then((result) => {
        console.log("result", result);
        if (result.length > 0) {
          const expressions = result[0].expressions;
          const emotion = Object.keys(expressions).reduce((a, b) =>
            expressions[a] > expressions[b] ? a : b
          );
          setEmotion(emotion);
          // const box = result[0].detection.box;
          // ctx.strokeStyle = "red";
          // ctx.strokeRect(box.x, box.y, box.width, box.height);
          // ctx?.fillText(emotion, box.x, box.y - 10);
        } else {
          // img cross origin 可能会导致检测失败
          console.error("no face detected", img);
        }
      });
  };
  useEffect(() => {
    init();
  }, []);
  console.log("fileList", fileList);
  return (
    <div className="contentWrap">
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={(key: any) => setType(key)}
      />
      {/* <div className="imgWrap">
        <img
          id="img"
          crossOrigin="anonymous"
          src={fileList[0]?.thumbUrl}
          // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQqeYZMbqKOVTOo_uyiGMS1WBcXieWBSx5CA&usqp=CAU"
          alt="laughting face"
          style={{ width: 200, height: 200 }}
        />

        <Upload
          listType="picture-card"
          multiple={false}
          maxCount={1}
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          beforeUpload={() => false}
          style={{ display: "none" }}
        >
          Upload
        </Upload>
        <div>
          {`The above person is `}{" "}
          <span>{`${emotion ? emotion : "analysising"}`}</span>
        </div>
      </div>

      <video id="video" style={{ width: 400, height: 450 }} /> */}
    </div>
  );
};
export default DetectFace;

// function dodetectpic() {
//   //   $.messager.progress();
//   //加载训练好的模型（weight，bias）
//   Promise.all([
//     faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//     faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//     faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
//     faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
//     faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//     // faceapi.nets.mtcnn.loadFromUri("/models"),
//     //faceapi.nets.tinyYolov.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights')
//   ]).then(async () => {
//     //在原来图片容器中添加一层用于显示识别的蓝色框框
//     const container = document.createElement("div");
//     container.style.position = "relative";
//     // $("#picmodal").prepend(container);
//     //先加载维护好的人脸数据(人脸的特征数据和标签，用于后面的比对)
//     const labeledFaceDescriptors = await loadLabeledImages();
//     //比对人脸特征数据
//     const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
//     //获取输入图片
//     let image = document.getElementById("testpic");
//     //根据图片大小创建一个图层，用于显示方框
//     let canvas = faceapi.createCanvasFromMedia(image);
//     //console.log(canvas);
//     container.prepend(canvas);
//     const displaySize = { width: image.width, height: image.height };
//     faceapi.matchDimensions(canvas, displaySize);
//     //设置需要使用什么算法和参数进行扫描识别图片的人脸特征
//     const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.38 });
//     //const options = new faceapi.TinyFaceDetectorOptions()
//     //const options = new faceapi.MtcnnOptions()
//     //开始获取图片中每一张人脸的特征数据
//     const detections = await faceapi
//       .detectAllFaces(image, options)
//       .withFaceLandmarks()
//       .withFaceDescriptors();
//     //根据人脸轮廓的大小，调整方框的大小
//     const resizedDetections = faceapi.resizeResults(detections, displaySize);
//     //开始和事先准备的标签库比对，找出最符合的那个标签
//     const results = resizedDetections.map((d) =>
//       faceMatcher.findBestMatch(d.descriptor)
//     );
//     console.log(results);
//     results.forEach((result, i) => {
//       //显示比对的结果
//       const box = resizedDetections[i].detection.box;
//       const drawBox = new faceapi.draw.DrawBox(box, {
//         label: result.toString(),
//       });
//       drawBox.draw(canvas);
//       console.log(box, drawBox);
//     });
//     $.messager.progress("close");
//   });
// }
// //读取人脸标签数据
// async function loadLabeledImages() {
//   //获取人脸图片数据,包含：图片+标签
//   const data = await $.get("/FaceLibs/GetImgData");
//   //对图片按标签进行分类
//   const labels = [...new Set(data.map((item) => item.Label))];
//   console.log(labels);
//   return Promise.all(
//     labels.map(async (label) => {
//       const descriptions = [];
//       const imgs = data.filter((item) => item.Label == label);
//       for (let i = 0; i < imgs.length; i++) {
//         const item = imgs[i];
//         const img = await faceapi.fetchImage(`${item.ImgUrl}`);
//         //console.log(item.ImgUrl, img);
//         //const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
//         //识别人脸的初始化参数
//         const options = new faceapi.SsdMobilenetv1Options({
//           minConfidence: 0.38,
//         });
//         //const options = new faceapi.TinyFaceDetectorOptions()
//         //const options = new faceapi.MtcnnOptions()
//         //扫描图片中人脸的轮廓数据
//         const detections = await faceapi
//           .detectSingleFace(img, options)
//           .withFaceLandmarks()
//           .withFaceDescriptor();
//         console.log(detections);
//         if (detections) {
//           descriptions.push(detections.descriptor);
//         } else {
//           console.warn("Unrecognizable face");
//         }
//       }
//       console.log(label, descriptions);
//       return new faceapi.LabeledFaceDescriptors(label, descriptions);
//     })
//   );
// }
