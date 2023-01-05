import {navigate} from "svelte-routing"

async function saveAuthData(token, access, username) {
    localStorage.setItem("token", token)
    localStorage.setItem("access", access)
    localStorage.setItem("username", username)
    getAuthData()
  }

async function getAuthData() {
    const token = localStorage.getItem("token")
    const access = localStorage.getItem("access")
    if (!token) {
      navigate("/")
    } else {
        if(access === "A"){
        //   console.log("admin")
          navigate("/calling")
          return
        } else if (access === "B") {
        //   console.log("User")
          navigate("/home")
          return
        }
    }
  }

  async function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("access")
    localStorage.removeItem("username")
    // navigate("/")
    window.location.replace("/")
  }

export {saveAuthData, getAuthData, logout }