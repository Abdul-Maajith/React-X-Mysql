import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

const Profile = () => {
    let { id } = useParams();
    const [username, setUsername] = useState("")
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    let history = useHistory();

    const { authState } = useContext(AuthContext);
    
    useEffect(() => {
      axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((resp) => {
        setUsername(resp.data.username)
      })

      axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((resp) => {
        setListOfPosts(resp.data)
      })
    }, [])
    
    // Deleting the post
    const deletePost = (id) => {
      axios
        .delete(`http://localhost:3001/posts/${id}`, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then(() => {
          setListOfPosts(
            listOfPosts.filter((post) => {
              return post.id !== id;
            })
          );
        });
    };

    return (
      <div className="profilePageContainer">
        <div className="basicInfo">
          <h1>Username: {username}</h1>

          {authState.username === username && (
            <button className="password_btn" onClick={() => history.push("/changepassword")}>
              Change My Password
            </button>
          )}
        </div>

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
                <label className="username">{value.username}</label>
                <label className="like_label">{value.Likes.length}</label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}

export default Profile
