import React, { useState, useEffect, useRef } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgpu";
import { toast } from "react-toastify";

const SquatCounter = () => {
  const [detector, setDetector] = useState(null);
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  let upPosition = true;
  let downPosition = false;
  let kneeAngle = 0;
  let handsClose = false;
  let handsOut = false;
  let properSquatPosition = false;
  let reps = 0;

  const [isDetecting, setIsDetecting] = useState(false); // New state to control detection
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);
  const animationFrameRef = useRef(null); // To store requestAnimationFrame ID

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      // Clear the entire canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

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
          checkHandPosition(keypoints);
          updateKneeAngle(poses);
          inUpPosition();
          inDownPosition();
          console.log("goc chan " + kneeAngle);
          console.log("tay mo " + handsOut);
          console.log("tay dong " + kneeAngle);
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

  function calculateDistance(point1, point2) {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }

  function checkHandPosition(keypoints) {
    const leftWrist = keypoints[9];
    const rightWrist = keypoints[10];
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];

    if (
      leftWrist.score > 0.3 &&
      rightWrist.score > 0.3 &&
      leftShoulder.score > 0.3 &&
      rightShoulder.score > 0.3
    ) {
      // Khoảng cách giữa hai tay
      const handDistance = calculateDistance(leftWrist, rightWrist);
      // Khoảng cách giữa hai vai để scale
      const shoulderDistance = calculateDistance(leftShoulder, rightShoulder);

      // Tay nắm lại (khoảng cách gần)
      handsClose = handDistance < shoulderDistance * 0.5;
      // Tay dang ra (khoảng cách xa)
      handsOut = handDistance > shoulderDistance * 1.2;
    } else {
      handsOut = true;
    }
  }

  function updateKneeAngle(poses) {
    const leftAnkle = poses[0].keypoints[15];
    const leftHips = poses[0].keypoints[11];
    const leftKnee = poses[0].keypoints[13];

    // Calculate angle between wrist, elbow, and shoulder using atan2
    let angle =
      Math.atan2(leftAnkle.y - leftKnee.y, leftAnkle.x - leftKnee.x) -
      Math.atan2(leftHips.y - leftKnee.y, leftHips.x - leftKnee.x);

    // Convert the angle from radians to degrees
    angle = angle * (180 / Math.PI);

    // Ensure the angle is always positive (0 to 360 degrees)
    if (angle < 0) {
      // angle += 360;
    }

    // Ensure all keypoints have a sufficient score (confidence) to use the data
    if (leftHips.score > 0.3 && leftAnkle.score > 0.3 && leftKnee.score > 0.3) {
      // console.log("Elbow angle:", angle); // You can update the state or use the angle value here
      // setElbowAngle(angle);
      kneeAngle = angle;
    } else {
      // console.log("Cannot see elbow or wrist clearly");
      return null; // Return null if the points are not visible or not reliable
    }
  }

  const inUpPosition = () => {
    if (kneeAngle > 165 && kneeAngle < 200) {
      if (downPosition) {
        if (handsOut) {
          const msg = new SpeechSynthesisUtterance(`${reps + 1}`);
          window.speechSynthesis.speak(msg);
          reps = reps + 1;
          setCount(reps);
          upPosition = true;
          downPosition = false;
        } else {
          // const msg = new SpeechSynthesisUtterance(`Wrong hand pose TUM`);
          // window.speechSynthesis.speak(msg);
        }
      }

    }
  };

  const inDownPosition = (poses) => {
    // let elbowAboveNose = false;
    // if (poses[0].keypoints[0].y > poses[0].keypoints[7].y) {
    //   elbowAboveNose = true;
    // } else {
    //   elbowAboveNose = false;
    // }

    if (kneeAngle > 250) {
      if (upPosition) {
        if (handsOut) {
          // const msg = new SpeechSynthesisUtterance("Wrong hand pose 1");
          // window.speechSynthesis.speak(msg);
        }
        if (handsClose) {
          downPosition = true;
          upPosition = false;
        }
      }
    }
  };

  const drawPose = (keypoints, ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Vẽ các keypoint
    keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = properSquatPosition
          ? "rgba(0, 255, 0, 1)"
          : "rgba(255, 0, 0, 1)";
        ctx.fill();
      }
    });

    // Vẽ skeleton
    const skeleton = [
      [5, 6], // shoulders
      [5, 7], // left arm
      [7, 9], // left forearm
      [6, 8], // right arm
      [8, 10], // right forearm
      [5, 11], // left trunk
      [6, 12], // right trunk
      [11, 12], // hips
      [11, 13], // left thigh
      [12, 14], // right thigh
      [13, 15], // left calf
      [14, 16], // right calf
    ];

    skeleton.forEach(([i1, i2]) => {
      const point1 = keypoints[i1];
      const point2 = keypoints[i2];

      if (point1.score > 0.3 && point2.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);

        // Màu sắc dựa trên vị trí và góc
        if (
          [11, 13, 15, 12, 14, 16].includes(i1) ||
          [11, 13, 15, 12, 14, 16].includes(i2)
        ) {
          // Phần chân
          ctx.strokeStyle = "green";
        } else if (
          [5, 7, 9, 6, 8, 10].includes(i1) ||
          [5, 7, 9, 6, 8, 10].includes(i2)
        ) {
          // Phần tay
          ctx.strokeStyle =
            (handsClose && downPosition) || (handsOut && upPosition)
              ? "green"
              : "yellow";
        } else {
          // Phần thân
          ctx.strokeStyle = "green";
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
        <div className=" my-4 p-2 border-2  rounded-md flex justify-center flex-col items-center">
          <p className="text-2xl font-bold text-gray-700 ">Squat challenge:</p>
          <p className="text-xl font-bold text-gray-700 ">Timer: {timeLeft}s</p>
          <p className="text-xl font-bold text-gray-700">Counter: {count}</p>
        </div>
        <div className="mb-4">
          {!isDetecting ? (
            <button
              onClick={startDetection}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Start
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

export default SquatCounter;
