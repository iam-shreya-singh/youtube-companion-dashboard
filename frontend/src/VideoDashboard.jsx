import { useState, useEffect } from "react";
import axios from "axios";

export default function VideoDashboard() {
  const [video, setVideo] = useState(null);

  useEffect(() => {
    axios.get("https://organic-engine-4wrv7gw6q9v27vww-4000.app.github.dev/video/vE-3kWXhcbw")
      .then((res) => setVideo(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!video) return <p>Loading...</p>;

  const v = video.items[0];

  return (
    <div>
      <h2>Video Dashboard</h2>
      <h3>{v.snippet.title}</h3>
      <p>{v.snippet.description}</p>
      <p>Views: {v.statistics.viewCount}</p>
      <p>Likes: {v.statistics.likeCount}</p>
    </div>
  );
}
