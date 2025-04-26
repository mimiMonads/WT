import { useEffect, useState } from "react";
import {
  faGithub,
  faHtml5,
  faJs,
  faNodeJs,
  faReact,
  faWebAwesome,
} from "@fortawesome/free-brands-svg-icons";
import Loader from "react-loaders";
import AnimatedLetters from "../AnimatedLetters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.scss";

const About = () => {
  const [letterClass, setLetterClass] = useState("text-animate");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLetterClass("text-animate-hover");
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <div className="container about-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={["A", "b", "o", "u", "t"]}
              idx={15}
            />
          </h1>
          <p align="LEFT">
            This project is part of the Web Technologies course at Griffith
            College Cork. <br />
            It is a Question and Answer (Q&A) Website designed for developers to
            ask and answer technical questions. <br />
            The plataform includes authentication, CRUD operation, templating,
            and validation.
          </p>
          <p align="LEFT">
            Developed by: <br />
            <strong>
              Antony Vladimir Montemayor Terrazas 3105325 <br />
              Bruna Gonçalves Heleno 3009733 <br />
              Elton Nakaoji 3093840
            </strong>
          </p>
        </div>

        <div className="stage-cube-cont">
          <div className="cubespinner">
            <div className="face1">
              <FontAwesomeIcon icon={faNodeJs} color="#3333cc" />
            </div>
            <div className="face2">
              <FontAwesomeIcon icon={faReact} color="#3333cc" />
            </div>
            <div className="face3">
              <FontAwesomeIcon icon={faJs} color="#3333cc" />
            </div>
            <div className="face4">
              <FontAwesomeIcon icon={faHtml5} color="#3333cc" />
            </div>
            <div className="face5">
              <FontAwesomeIcon icon={faWebAwesome} color="#3333cc" />
            </div>
            <div className="face6">
              <FontAwesomeIcon icon={faGithub} color="#3333cc" />
            </div>
          </div>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  );
};

export default About;
