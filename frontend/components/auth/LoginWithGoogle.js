import Link from "next/link";

import { useState, useEffect } from "react";

import GoogleLogin from "react-google-login";

import Router from "next/router";

import { loginWithGoogle, authenticate, isAuth } from "../../actions/auth";

import { GOOGLE_CLIENT_ID } from "../../config";

const LoginGoogle = () => {
  const responseGoogle = response => {
    const tokenId = response.tokenId;
    const user = { tokenId };

    loginWithGoogle(user).then(data => {
      if(!data || data.error) {
        console.log( data && data.error);
      } else {
        authenticate(data, () => {
          /** To navigate to Homepage (Index) after signin successfully */
          if(isAuth() && isAuth().role === 1){
            Router.push("/admin");
          }
          Router.push("/user");
        });
      }
    });
  };
  return (
    <div className="pb-3">
      <GoogleLogin
        clientId={`${GOOGLE_CLIENT_ID}`}
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        theme="dark"
      />
    </div>
  );
};

export default LoginGoogle;
