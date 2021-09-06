import React, { useContext } from 'react'
import {useParams} from "react-router-dom"
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { useHistory } from "react-router-dom";

function Post() {
    let { id } = useParams();
    const [postObj, setPostObj] = React.useState([])
    const [comments, setComments] = React.useState([])
    const [newComment, setNewComment] = React.useState("")

    let history = useHistory();

    const { authState } = useContext(AuthContext);

    React.useEffect(() => {
       axios.get(`http://localhost:3001/posts/byId/${id}`).then((resp) => {
         setPostObj(resp.data);
       });
    }, [id])

    React.useEffect(() => {
      axios.get(`http://localhost:3001/comments/${id}`).then((resp) => {
        setComments(resp.data);
      });
    }, [id])

    const addComment = () => {
        if (newComment) {
           axios
             .post("http://localhost:3001/comments", {
               commentBody: newComment,
               PostId: id,
             },
            //  Here every request needs header as everything need to validated with our data in database!
             {
               headers: {
                 accessToken: localStorage.getItem("accessToken"),
               },
             })
             .then((resp) => {
               if(resp.data.error) {
                 alert("You have not yet logged in!");
               } else {
                 const commentToAdd = { 
                  commentBody: newComment,
                  username: resp.data.username,
                };
                 setNewComment("");
                 setComments([...comments, commentToAdd]);
               }
             });
        }  
    }

    const delComment = (id) => {
      axios.delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then(() => {
        setComments(comments.filter((val) => {
          return val.id !== id;
        }))
      });
    }

    const deletePost = (id) => {
      axios.delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        }
      }).then(() => {
        history.push("/");
      });
    };

    const editPost = (option) => {
      if(option === "title") {
        let newTitle = prompt("Enter New Title");
        axios.put(
          `http://localhost:3001/posts/title`,
          {
            newTitle: newTitle,
            id: id,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        );
        
        // Keep everyother thing same except title which got recently updated!
        setPostObj({ ...postObj, title: newTitle})
      } 
      else {
        let newPostBody = prompt("Enter New text");
        axios.put(
          `http://localhost:3001/posts/postText`,
          {
            newText: newPostBody,
            id: id,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        );

        // Keep everyother thing same except postBody which got recently updated!
        setPostObj({ ...postObj, postText: newPostBody});
      }
    }

    return (
      <div className="postpage">
        <div className="topside">

          <div className="title">
            <label onClick={() => {
              if (authState.username === postObj.username){
                editPost("title");
              } 
            }}>
              {postObj.title}
            </label>

            {authState.username === postObj.username && (
              <button
                className="deletepost"
                onClick={() => {
                  deletePost(postObj.id);
                }}
              >
                <DeleteOutlineIcon className="delIcon" />
              </button>
            )}
          </div>

          <div className="body">
            <label onClick={() => {
              if (authState.username === postObj.username) {
                editPost("body");
              }
            }}>
              {postObj.postText}
            </label>
          </div>
          <div className="footer_ts">{postObj.username}</div>
        </div>

        <div className="bottomside">
          <div className="listOfComments">
            {comments.map((value, key) => (
              <div key={key} className="comment">
                {value.commentBody}

                {/* Deleting the comment which is only commented by me*/}
                {authState.username === value.username && (
                  <button
                    className="com_delete"
                    onClick={() => {
                      delComment(value.id);
                    }}
                  >
                    X
                  </button>
                )}

                <label className="comment label">
                  Posted by: {value.username}
                </label>
              </div>
            ))}
          </div>
          <div className="addCommentContainer">
            <input
              type="text"
              placeholder="Add your comments..."
              autoComplete="off"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="comment_btn" onClick={addComment}>
              Add comment
            </button>
          </div>
        </div>
      </div>
    );
}

export default Post
