import dayjs from "dayjs";
import { useEffect, useState } from "react";

export const Home = () => {
  const [pictureUrl, setPictureUrl] = useState("");

  const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchPicture = async () => {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/daily`);
      const json = await response.json();
      if (json.url) {
        setPictureUrl(json.url);
      }
    };

    fetchPicture();
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Daily Dog Picture</h1>
      <h2>
        Here is your picture for{" "}
        <span style={{ color: "cornflowerblue" }}>
          {dayjs().format("dddd D MMMM YYYY")}
        </span>
      </h2>
      <img src={pictureUrl} style={{ width: "50%" }} />
    </div>
  );
};

export default Home;
