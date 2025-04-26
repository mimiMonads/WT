import { useEffect, useState } from "react";
import Loader from "react-loaders";
import AnimatedLetters from "../AnimatedLetters";

const PrivacyPolicy = () => {
  const [letterClass, setLetterClass] = useState("text-animate");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLetterClass("text-animate-hover");
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <div className="container privacy-policy-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={[
                "P",
                "r",
                "i",
                "v",
                "a",
                "c",
                "y",
                " ",
                "P",
                "o",
                "l",
                "i",
                "c",
                "y",
              ]}
              idx={15}
            />
          </h1>
          <img
            className="privacy-policy-image"
            src={require("../../assets/images/privacy-policy.png")}
            alt="Privacy Policy"
          />
        </div>
      </div>
      <Loader type="pacman" />
    </>
  );
};

export default PrivacyPolicy;
