import { useState } from "react";
import PostList from "./compenents/PostList";
import MainHeader from "./compenents/MainHeader";

function App() {
  const [modalIsVisible, setModalIsVisible] = useState(true);
  function showModalHandler() {
    setModalIsVisible(true);
  }

  function hideModalHandler() {
    setModalIsVisible(false);
  }

  return (
    <>
      <MainHeader onCreatePost={showModalHandler} />
      <main>
        <PostList isPosting={modalIsVisible} onStopPosting={hideModalHandler} />
      </main>
    </>
  );
}

export default App;
