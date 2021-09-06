import React, { useContext } from "react";
import axios from "axios"
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import { AuthContext } from "../helpers/AuthContext";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { Link } from "react-router-dom";

function Home() {
  const [listOfPosts, setListsOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  let history = useHistory();

  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((resp) => {
          setListsOfPosts(resp.data.listOfPosts);
          setLikedPosts(
            resp.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, []);

  const like = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((resp) => {
        // In order to update the like instantly!
        setListsOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (resp.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );
      });

    // In order to update the like colors instantly!
    if (likedPosts.includes(postId)) {
      setLikedPosts(
        likedPosts.filter((id) => {
          return id !== postId;
        })
      );
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  // Deleting the post
  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setListsOfPosts(
          listOfPosts.filter((post) => {
            return post.id !== id;
          })
        );
      });
  };

  return (
    <>
      <div className="App">
        {listOfPosts.map((value, key) => (
          <div className="post" key={key}>
            
            <div className="title">
              {value.title}
              {authState.username === value.username && (
                <button
                  className="deletepost"
                  onClick={() => {
                    deletePost(value.id);
                  }}
                >
                  <DeleteOutlineIcon className="delIcon" />
                </button>
              )}
            </div>

            <div
              className="body"
              onClick={() => {
                history.push(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>

            <div className="footer">
              <Link to={`/profile/${value.UserId}`}>
                <label className="username">{value.username}</label>
              </Link>
              <button className="like">
                <ThumbUpAltIcon
                  onClick={() => {
                    like(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "like_btn" : "unlike_btn"
                  }
                />{" "}
                <label className="like_label">{value.Likes.length}</label>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home
