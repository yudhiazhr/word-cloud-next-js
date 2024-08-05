import Image from "next/image";
import { useState } from "react";
import Joyride from "react-joyride";

const JoyRide = () => {
  const [steps] = useState([
    {
      content: (
        <div className="flex flex-col h-[50%] justify-center items-center">
          Hi!, welcome to our website 👋
        </div>
      ),
      placement: "center",
      target: "section",
    },
    {
      content: (
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className=" font-bold text-xl">First</h1>
          <h1 className="">For the first you must have file .csv</h1>
          <p>example:</p>
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkXj6P6BhgVqD-OALoNtj6X6jIlMUN-fA2Ng&s"
            alt=""
            className="w-full h-full"
            width={3000}
            height={3000}
          />
        </div>
      ),
      placement: "center",
      target: "section",
    },
    {
      target: ".dropzone",
      content: (
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className=" font-bold text-xl">Second</h1>
          <h1 className="">Put or drop your file .csv to drop zone.</h1>
        </div>
      ),
    },
    {
      target: ".process-button",
      content: (
        <div className="flex flex-col justify-start items-start gap-4">
          <h1 className=" font-bold text-xl">Third</h1>
          <h1 className="">
            Click here to process the file and generate the word cloud.
          </h1>
        </div>
      ),
    },
    {
      content: (
        <div className="flex flex-col h-[50%] justify-center items-center gap-4">
          <h1 className="text-xl font-bold">🎉 Congratulation 🎉</h1>
          <p>Your word cloud has been build!</p>
        </div>
      ),
      placement: "center",
      target: "section",
    },
  ]);

  return (
    <>
      <Joyride steps={steps} continuous showSkipButton showProgress />
    </>
  );
};

export default JoyRide;
