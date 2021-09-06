import React from 'react'
import {Link} from "react-router-dom"

const PageNotFound = () => {
    return (
      <>
        <div className="pagenotfound">
          <h1>Page Not Found!!</h1>
          <h3>Go to Homepage: </h3>
          <Link to="/">Homepage</Link>
        </div>
      </>
    );
}

export default PageNotFound
