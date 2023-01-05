<script>
  import { Router, Link, Route } from "svelte-routing";
  import Calling from "./pages/Calling.svelte";
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";
  import NotFound from "./pages/NotFound.svelte";

  export let url = "";
</script>

<Router {url}>
  <Route path="/"><Login /></Route>
  <Route path="/home"><Home /></Route>
  <Route path="/calling"><Calling /></Route>
  <Route><NotFound /></Route>
</Router>
