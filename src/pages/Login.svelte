<script>
  import { onMount } from "svelte";
  import axios from "axios";
  import {saveAuthData, getAuthData} from "../lib/auth.js"
  import {fade} from "svelte/transition"

  let username;
  let password;
  let hasError = false
  let errMessage = "Username and password must be correct"

  onMount(async () => {
    getAuthData()
  });

  function callFocus(input) {
    input.focus();
  }

  async function handleSubmit(e) {
    let login = {
      Name: username,
      Password: password,
      systemid: "33",
    };
    await axios.post("Users/authenticatenew", login)
      .then((res) => {
        saveAuthData(res.data.token, res.data.access, res.data.username)
        // console.log("Response", res.data);
      })
      .catch((error) => {
        if(error.response.status==401){
          hasError = true

          setTimeout(function(){
            hasError = false;
          }, 2500);
        }
      });
  }

</script>
<section class="vh-100">
  <div class="container-fluid h-custom">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-7 col-lg-6 col-xl-5">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          src="./images/login.png"
          class="img-fluid"
          alt="Sample image"
        />
      </div>
      <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <h2 class="mb-4">Sign In</h2>
        <div class="text-center text-lg-start mt-4 pt-2">
          {#if hasError}
            <!-- svelte-ignore missing-declaration -->
            <p class="error-alert" transition:fade={{duration:150}}>{errMessage}</p>
          {/if}
        </div>
        <form on:submit|preventDefault={handleSubmit}>
          <!-- Username input -->
          <div class="form-outline mb-4">
            <input
              type="text"
              id="username"
              bind:value={username} 
              use:callFocus
              class="form-control form-control-lg"
              placeholder="Username" required
            />
          </div>

          <!-- Password input -->
          <div class="form-outline mb-3">
            <input
              type="password"
              id="password"
              bind:value={password}
              class="form-control form-control-lg"
              placeholder="Password" required
            />
          </div>

          <div class="text-center text-lg-start mt-4 pt-2">
            <button id="login" class="btn btn-primary btn-lg login"
              >Login</button
            >
          </div>
          
        </form>
      </div>
    </div>
  </div>
</section>

<style>
	.error-alert {
		border: 1px solid #c00 !important;
		padding: 6px;
		text-align: center;
		color: #c00;
		border-radius: 3px;
	}
</style>