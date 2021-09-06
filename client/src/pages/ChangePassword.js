import React, { useState } from 'react'
import axios from "axios";

const ChangePassword = () => {
    const [currentPass, setCurrentPass] = useState("")
    const [newPass, setNewPass] = useState("");

    const changePassword = () => {
       axios
         .put(
           "http://localhost:3001/auth/changepassword",
           {
             oldPassword: currentPass,
             newPassword: newPass,
           },
           {
             headers: {
               accessToken: localStorage.getItem("accessToken"),
             },
           }
         )
         .then((resp) => {
            if(resp.data.error) {
                alert(resp.data.error)
            }
         });
    }

    return (
      <div className="createPostPage">
        <label>Type your current password:</label>
        <input
          id="inputPost"
          type="password"
          placeholder="Your current password.."
          value={currentPass}
          onChange={(e) => setCurrentPass(e.target.value)}
        />

        <label>Type your new password:</label>
        <input
          id="inputPost"
          type="password"
          placeholder="Your new password.."
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />

        <button onClick={changePassword} className="btn">
          Change Password
        </button>
      </div>
    );
}

export default ChangePassword
