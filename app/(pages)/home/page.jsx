"use client";
import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import WordCloud from "wordcloud";
import ReactJoyride from "react-joyride";
import Image from "next/image";
import imgExample from "@/public/images/example.png";
import imgExample2 from "@/public/images/example2.png";
import imgExample3 from "@/public/images/example3.png";
import imgExample4 from "@/public/images/example4.png";

export const Index = () => {
  const [words, setWords] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const steps = [
    {
      content: (
        <div className="relative flex flex-col justify-start items-start text-start gap-4">
          <h1 className="font-bold text-xl">First</h1>
          <h1>For the first you must have file .csv</h1>
          <p>Copy the link URL to the post you want to retrieve </p>
          <Image
            src={imgExample2}
            alt=""
            className="w-full h-full object-cover"
            width={5000}
            height={5000}
          />
        </div>
      ),
      placement: "center",
      target: "section",
    },
    {
      content: (
        <div className="relative flex flex-col justify-start items-start text-start gap-4">
          <h1 className="font-bold text-xl">Second</h1>
          <p>
            Paste the link URL into IGCommentsExport and click export, you must
            have installed it before
          </p>
          <Image
            src={imgExample3}
            alt=""
            className="w-full h-full object-cover"
            width={5000}
            height={5000}
          />
        </div>
      ),
      placement: "center",
      target: "section",
    },
    {
      content: (
        <div className="relative flex flex-col justify-start items-start text-start gap-4">
          <h1 className="font-bold text-xl">Third</h1>
          <p>
            Then delete all data and columns User Id, Username, Comment Id,
            Profile URL, Avatar URL & Date. Leave only data in column comment
            text
          </p>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              <h1>Before: </h1>
              <Image
                src={imgExample4}
                alt=""
                className="w-full h-full object-cover"
                width={5000}
                height={5000}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>After: </p>
              <Image
                src={imgExample}
                alt=""
                className="w-full h-full object-cover"
                width={5000}
                height={5000}
              />
            </div>
          </div>
        </div>
      ),
      placement: "center",
      target: "section",
    },

    {
      target: ".dropzone",
      content: (
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className="font-bold text-xl">Fourth</h1>
          <h1>Put or drop your file .csv to drop zone.</h1>
        </div>
      ),
    },
    {
      target: ".process-button",
      content: (
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className="font-bold text-xl">Fifth</h1>
          <h1>Click here to process the file and generate the word cloud.</h1>
        </div>
      ),
    },
    {
      content: (
        <div className="flex flex-col h-[50%] justify-center items-center gap-4">
          <h1 className="text-xl font-bold">🎉 Congratulation 🎉</h1>
          <p>Your word cloud has been built!</p>
        </div>
      ),
      placement: "center",
      target: "section",
    },
  ];

  const handleTourCallback = (data) => {
    if (data.status === "finished") {
      setShowGuide(false);
    } else if (data.status === "skipped") {
      setShowGuide(false);
    }
  };

  useEffect(() => {
    if (showCanvas && canvasRef.current) {
      const numWords = words.length;
      let weightFactor;

      if (numWords <= 100) {
        weightFactor = 20;
      } else if (numWords <= 200) {
        weightFactor = 17;
      } else if (numWords <= 300) {
        weightFactor = 13;
      } else if (numWords <= 400) {
        weightFactor = 7;
      } else {
        weightFactor = 3;
      }

      WordCloud(canvasRef.current, {
        list: words,
        weightFactor: weightFactor,
        color: "random-light",
        backgroundColor: "transparent",
      });
    }
  }, [showCanvas, words]);

  const handleFileUpload = (file) => {
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data;
          const sortedWordCount = sortWordCounts(countWords(data));
          console.table(sortedWordCount);

          const wordArray = sortedWordCount.map(([word, count]) => [
            word,
            count,
          ]);
          setWords(wordArray);
          setFileName(file.name);
        },
      });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
      event.preventDefault();
    }
  };

  const extractWords = (comment) => {
    return comment.match(/\w+/g) || [];
  };

  const countWords = (comments) => {
    const wordCount = {};
    comments.forEach((commentArr) => {
      commentArr.forEach((comment) => {
        const words = extractWords(comment);
        words.forEach((word) => {
          const lowerWord = word.toLowerCase();
          if (wordCount[lowerWord]) {
            wordCount[lowerWord] += 1;
          } else {
            wordCount[lowerWord] = 1;
          }
        });
      });
    });
    return wordCount;
  };

  const sortWordCounts = (wordCount) => {
    return Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
  };

  const handleFormSubmit = (event) => {
    setLoading(true);
    event.preventDefault();

    setTimeout(() => {
      setShowCanvas(true);
      setLoading(false);
    }, 3000);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "wordcloud.png";
      link.click();
    }
  };

  return (
    <>
      <ReactJoyride
        steps={steps}
        run={showGuide}
        callback={handleTourCallback}
        continuous
        showSkipButton
        showProgress
      />
      <section className=" relative flex flex-col min-h-dvh bg-[#021526] pt-24 px-10 justify-center items-center">
        <div
          onClick={() => setShowGuide(true)}
          className="absolute right-10 top-10 rounded-xl flex px-4 py-2 gap-4 bg-yellow-200 hover:bg-yellow-400 transition-all duration-300 cursor-pointer"
        >
          <h1 className="text-xl text-black">Guide</h1>
          <svg
            className="w-6 h-6 text-black"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 9a3 3 0 0 1 3-3m-2 15h4m0-3c0-4.1 4-4.9 4-9A6 6 0 1 0 6 9c0 4 4 5 4 9h4Z"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-6 justify-center items-center text-center">
          {showCanvas && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 px-10">
              <div className="bg-[#021526] object-contain relative p-6 min-w-1/2 min-h-1/2 rounded-lg text-center flex flex-col  gap-2">
                <div
                  onClick={() => setShowCanvas(false)}
                  className="flex items-center gap-2 cursor-pointer group justify-end"
                >
                  <h1 className="text-md text-white group-hover:text-gray-200">
                    Close
                  </h1>
                  <svg
                    className="w-6 h-6 text-white group-hover:text-gray-200"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fillRule="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18 17.94 6M18 18 6.06 6"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold  text-white">Result</h2>
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className=" object-contain min-w-full min-h-full p-4 border rounded-xl scale-100"
                ></canvas>
                <div className="grid grid-cols-3 items-center justify-between text-start gap-2">
                  {words.slice(0, 9).map(([word, count], index) => (
                    <>
                      <h1 key={index} className="text-xl text-white font-bold">
                        {word}: {count}
                      </h1>
                    </>
                  ))}
                </div>

                <button
                  onClick={handleDownload}
                  className="mt-4 rounded-lg py-2 px-4 bg-green-300 hover:bg-green-500 cursor-pointer text-xl text-black font-bold  transition-all duration-300"
                >
                  Download as PNG
                </button>
              </div>
            </div>
          )}
          <h1 className="text-[7vw] leading-[100%] font-bold text-white text-balance">
            Visualization of the words mentioned.
          </h1>
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-4 items-center justify-center w-1/2"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <label
              htmlFor="dropzone-file"
              className="dropzone flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
            >
              {fileName ? (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-4">
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m2.665 9H6.647A1.647 1.647 0 0 1 5 15.353v-1.706A1.647 1.647 0 0 1 6.647 12h1.018M16 12l1.443 4.773L19 12m-6.057-.152-.943-.02a1.34 1.34 0 0 0-1.359 1.22 1.32 1.32 0 0 0 1.172 1.421l.536.059a1.273 1.273 0 0 1 1.226 1.718c-.2.571-.636.754-1.337.754h-1.13"
                    />
                  </svg>

                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-xl">{fileName}</span>{" "}
                    <br />
                    Or drag and drop another file
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    .CSV
                  </p>
                </div>
              )}
              <input
                id="dropzone-file"
                name="file"
                type="file"
                className="sr-only"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleInputChange}
              />
            </label>
            <button
              disabled={!fileName}
              type="submit"
              className={`process-button text-black text-xl border-transparent px-4 py-2 rounded-lg bg-green-300 ${
                !fileName
                  ? "hover:bg-green-300 cursor-not-allowed"
                  : "hover:bg-green-500 cursor-pointer"
              }   transition-all duration-300 w-full`}
            >
              {loading ? (
                <svg
                  aria-hidden="true"
                  className="inline w-6 h-6 text-gray-200 animate-spin text-center dark:text-white fill-gray-600 dark:fill-gray-300"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                <span>Visualize</span>
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Index;
