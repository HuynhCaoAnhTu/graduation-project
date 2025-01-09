import React, { useState, useEffect, useRef } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgpu";
import { toast } from "react-toastify";
import axios from "axios";
import axiosInstance from "../../utills/axiosInstance";
import { useMainContext } from "../../../context/UserContext";

const PushUpCounter = () => {
  const [detector, setDetector] = useState(null);
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false); // New state to control detection
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const animationFrameRef = useRef(null); // To store requestAnimationFrame ID

  let upPosition = true;
  let downPosition = false;
  let elbowAngle = 0;
  let backAngle = 0;
  let highlightBack = false;
  let reps = 0;

  const { userInfo } = useMainContext();

  const saveRecord = async () => {
    try {
      const response = await axiosInstance.post("/save-challenge", {
        userId: userInfo._id,
        reps: count,
        type: "pushup"
      });
      console.log("Save record response:", response.data);
      toast.success("Record saved successfully!"); 
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };


  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      // Clear the entire canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleCloseModal = ()=>{
    setIsModalVisible(false);
  }

  const resetTimer = () => {
    setTimeLeft(90);
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setIsTimerRunning(false);
            setIsDetecting(false); // Stop detection when timer ends
            clearCanvas();
            if (count > 0) {
              setIsModalVisible(true);
              saveRecord();

            } else {
              toast.warning("You haven't done any reps!");
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  const startDetection = () => {
    setIsDetecting(true);
    resetTimer(); // Reset timer before starting
    startTimer(); // Start timer immediately when button is clicked
  };

  const stopDetection = () => {
    setIsDetecting(false);
    resetTimer();
    clearCanvas();
    if (count > 0) {
      setIsModalVisible(true);
      saveRecord();

    } else {
      toast.warning("You haven't done any reps!");
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  useEffect(() => {
    if (!detector || !isDetecting) return;

    const ctx = canvasRef.current.getContext("2d");

    const detectPose = async () => {
      if (videoRef.current.readyState === 4) {
        const poses = await detector.estimatePoses(videoRef.current);

        if (poses.length > 0) {
          const keypoints = poses[0].keypoints;
          drawPose(keypoints, ctx);
          updateArmAngle(poses);
          updateBackAngle(poses);
          inUpPosition();
          inDownPosition(poses);
        }
      }

      if (isDetecting) {
        // Only continue the loop if still detecting
        animationFrameRef.current = requestAnimationFrame(detectPose);
      }
    };

    detectPose();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [detector, isDetecting]);

  useEffect(() => {
    const initializeDetector = async () => {
      await tf.ready();
      await tf.setBackend("webgl"); // Sử dụng backend WebGPU
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER, // Sử dụng mô hình chính xác cao hơn
      };
      const detectorInstance = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
      setDetector(detectorInstance);
    };

    initializeDetector();
  }, []);

  // useEffect(() => {
  //   if (!detector) return;

  function updateArmAngle(poses) {
    // Get the keypoints for wrist, elbow, and shoulder (left side)
    const leftWrist = poses[0].keypoints[9];
    const leftShoulder = poses[0].keypoints[5];
    const leftElbow = poses[0].keypoints[7];

    // Calculate angle between wrist, elbow, and shoulder using atan2
    let angle =
      Math.atan2(leftWrist.y - leftElbow.y, leftWrist.x - leftElbow.x) -
      Math.atan2(leftShoulder.y - leftElbow.y, leftShoulder.x - leftElbow.x);

    // Convert the angle from radians to degrees
    angle = angle * (180 / Math.PI);

    // Ensure the angle is always positive (0 to 360 degrees)
    if (angle < 0) {
      // angle += 360;
    }

    // Ensure all keypoints have a sufficient score (confidence) to use the data
    if (
      leftWrist.score > 0.3 &&
      leftElbow.score > 0.3 &&
      leftShoulder.score > 0.3
    ) {
      // console.log("Elbow angle:", angle); // You can update the state or use the angle value here
      // setElbowAngle(angle);
      elbowAngle = angle;
    } else {
      // console.log("Cannot see elbow or wrist clearly");
      return null; // Return null if the points are not visible or not reliable
    }
  }

  // let backAngle = 0;
  let backWarningGiven = null; // null để phân biệt trạng thái ban đầu

  function updateBackAngle(poses) {
    if (!poses || poses.length === 0) return;

    const leftShoulder = poses[0].keypoints[5];
    const leftHip = poses[0].keypoints[11];
    const leftKnee = poses[0].keypoints[13];

    if (
      leftShoulder.score > 0.3 &&
      leftHip.score > 0.3 &&
      leftKnee.score > 0.3
    ) {
      let angle =
        (Math.atan2(leftKnee.y - leftHip.y, leftKnee.x - leftHip.x) -
          Math.atan2(leftShoulder.y - leftHip.y, leftShoulder.x - leftHip.x)) *
        (180 / Math.PI);

      angle = angle % 180;
      backAngle = angle;

      if (angle < 20 || angle > 170) {
        highlightBack = false;
      } else {
        highlightBack = true;

        if (!backWarningGiven) {
          // const msg = new SpeechSynthesisUtterance("Keep your back straight");
          // window.speechSynthesis.speak(msg);
        }
      }
    }
  }

  const inUpPosition = () => {
    if (elbowAngle > 165 && elbowAngle < 200) {
      if (downPosition) {
        const msg = new SpeechSynthesisUtterance(`${reps + 1}`);
        window.speechSynthesis.speak(msg);
        reps = reps + 1;
        setCount(reps);
      }
      upPosition = true;
      downPosition = false;
    }
  };

  const inDownPosition = (poses) => {
    let elbowAboveNose = false;
    if (poses[0].keypoints[0].y > poses[0].keypoints[7].y) {
      elbowAboveNose = true;
    } else {
      elbowAboveNose = false;
    }

    if (
      !highlightBack &&
      elbowAboveNose &&
      Math.abs(elbowAngle) > 30 &&
      Math.abs(elbowAngle) < 100
    ) {
      if (upPosition) {
          const msg = new SpeechSynthesisUtterance("Keep your back straight");
          window.speechSynthesis.speak(msg);
      }
      downPosition = true;
      upPosition = false;
    }
  };
  const drawPose = (keypoints, ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    const selectedLandmarks = [0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // leftShoulder (5), rightShoulder (6), leftElbow (7)

    selectedLandmarks.forEach((index) => {
      const keypoint = keypoints[index];

      if (keypoint.score > 0.3) {
        ctx.beginPath();
        // Vẽ viền trắng
        ctx.arc(keypoint.x, keypoint.y, 8, 0, 2 * Math.PI); // Vòng tròn lớn (viền)
        ctx.fillStyle = "rgba(255, 255, 255, 1)"; // Màu trắng
        ctx.fill();

        ctx.beginPath();
        // Vẽ nền đỏ
        ctx.arc(keypoint.x, keypoint.y, 6, 0, 2 * Math.PI); // Vòng tròn nhỏ (nền)
        ctx.fillStyle = "rgba(0, 0, 0, 1)"; // Màu đỏ
        ctx.fill();
      }
    });

    // Vẽ skeleton (nối các keypoints)
    const skeleton = [
      [5, 6], // leftShoulder - rightShoulder
      [5, 7], // leftShoulder - leftElbow
      [7, 9], // leftElbow - leftWrist
      [6, 8], // rightShoulder - rightElbow
      [8, 10], // rightElbow - rightWrist
      [5, 11], // leftShoulder - leftHip
      [6, 12], // rightShoulder - rightHip
      [11, 12],
      [11, 13], // leftHip - leftKnee
      [13, 15], // leftKnee - leftAnkle
      [12, 14], // rightHip - rightKnee
      [14, 16], // rightKnee - rightAnkle
    ];

    skeleton.forEach(([index1, index2]) => {
      const point1 = keypoints[index1];
      const point2 = keypoints[index2];

      if (point1 && point2 && point1.score > 0.3 && point2.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        if (
          (index1 === 5 && index2 === 11) || // leftShoulder - leftHip
          (index1 === 11 && index2 === 13) || // leftHip - leftKnee
          (index1 === 6 && index2 === 12) || // rightShoulder - rightHip
          (index1 === 12 && index2 === 14) || // rightHip - rightKnee // rightShoulder - rightHip
          (index1 === 11 && index2 === 12)
        ) {
          ctx.strokeStyle = highlightBack ? "red" : "green"; // Đổi màu theo góc
          if (backAngle < 150 || backAngle > 20) {
            // var msg = new SpeechSynthesisUtterance("Keep your back straight");
            // window.speechSynthesis.speak(msg);
          }
        } else {
          ctx.strokeStyle = "green"; // Các đoạn còn lại luôn màu xanh
        }

        ctx.lineWidth = 7;
        ctx.stroke();
      }
    });
  };

  const initializeVideo = async () => {
    const video = videoRef.current;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true, // Sử dụng video không giới hạn độ phân giải
      });

      video.srcObject = stream;
      video.style.transform = "scaleX(-1)";
      streamRef.current = stream;
      // Lấy kích thước của video sau khi stream được kết nối
      video.onloadedmetadata = () => {
        const width = video.videoWidth; // Lấy chiều rộng gốc của video
        const height = video.videoHeight; // Lấy chiều cao gốc của video

        // Đặt chiều rộng và chiều cao cho canvas và video
        video.width = width;
        video.height = height;

        if (canvasRef.current) {
          canvasRef.current.width = width;
          canvasRef.current.height = height;
        }
      };
    }
  };

  useEffect(() => {
    initializeVideo();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <div className=" mt-[54px]  flex flex-col items-center">
        <div className="relative">
          <video
            ref={videoRef}
            className=" w-full max-h-[75vh] lg:w-[640px]   "
            autoPlay
            muted
            style={{
              objectFit: "cover", // Đảm bảo video giữ tỷ lệ mà không bị kéo dãn
            }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full max-h-[75vh] lg:w-[640px]  "
            style={{
              transform: "scaleX(-1)", // Đảm bảo video giữ tỷ lệ mà không bị kéo dãn
            }}
          />
        </div>
        <div className=" my-4 py-4 px-6 border-2  rounded-md flex justify-center flex-col items-center">
          <p className="text-2xl font-bold text-gray-700 ">Pushup challenge:</p>
          <p className="text-xl font-bold text-gray-700 ">Timer: {timeLeft}s</p>
          <p className="text-xl font-bold text-gray-700">Counter: {count}</p>
        </div>
        <div className="mb-4">
          {!isDetecting ? (
            <button
              onClick={startDetection}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Start challenge
            </button>
          ) : (
            <button
              onClick={stopDetection}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Stop
            </button>
          )}
        </div>
      </div>
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">🎉 Congratulations! 🎉</h2>
            <p className="text-lg mb-6">You have completed {count} reps!</p>
            <button
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
              onClick={handleCloseModal}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PushUpCounter;
