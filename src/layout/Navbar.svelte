<script>
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import { getAuthData, logout } from "../lib/auth.js";

  onMount(async () => {
    getAuthData();
    const access = localStorage.getItem("access");
    const home = document.getElementById("homeNav")
    const calling = document.getElementById("callingNav")
    if (access === "A") {
      home.classList.toggle("d-none")
      return;
    } else if (access === "B") {
      calling.classList.toggle("d-none")
      return;
    }
  });

  window.addEventListener("beforeunload", logout)

</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-5">
  <div class="container-fluid">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="navbar-brand">Paging System</a>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item" id="homeNav">
          <!-- svelte-ignore a11y-missing-attribute -->
          <a>
            <Link to="/home" class="nav-link active">Home</Link>
          </a>
        </li>

        <li class="nav-item" id="callingNav">
          <!-- svelte-ignore a11y-missing-attribute -->
          <a>
            <Link to="/calling" class="nav-link active">Calling</Link>
          </a>
        </li>

        <li class="nav-item">
          <!-- svelte-ignore a11y-missing-attribute -->
          <a on:click={logout} class="nav-link active">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
