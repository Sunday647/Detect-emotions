import * as faceapi from "@vladmandic/face-api/dist/face-api.esm.js";
import { useEffect, useState } from "react";
import { GetProp, Button, Upload, UploadFile, UploadProps } from "antd";
import "./index.scss";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const DetecImage = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imgSrc, setImgSrc] = useState<any>("");
  const [emotion, setEmotion] = useState("");

  const onChange: UploadProps["onChange"] = ({
    fileList: newFileList,
    file,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setImgSrc(src);
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
  console.log("fileList", fileList);
  return (
    <div className="contentWrap">
      <div className="operaion">
        <Button type="primary" onClick={startAnalysisImg}>
          Start Analysis Image
        </Button>
      </div>
      <div className="imgWrap">
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
    </div>
  );
};
export default DetecImage;
