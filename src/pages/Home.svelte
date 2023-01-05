<script>
  // @ts-nocheck
  import axios from "axios";
  import { onMount } from "svelte";
  import { HubConnectionBuilder } from "@microsoft/signalr";

  import { getAuthData } from "../lib/auth.js";
  import Navbar from "../layout/Navbar.svelte";

  let calfor = "";
  let desti = "";
  let title_cal = "";
  let sectfor = "";
  let selected_call;
  let selected_sect;
  let voices = [];
  let options_call = [];
  let options_sect = [];
  let disbutton = false;
  const username = localStorage.getItem("username");

  let listname = [
    { id: 1, name: "", colorbtn: "primary", textbtn: "+", read: false },
  ];

  let connection = new HubConnectionBuilder()
    // .withUrl("http://sbilocal:8082/hubs")
    .withUrl("https://localhost:44366/hubs")
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveMessage", (data) => {
    if (data == "1") {
      disbutton = false;
    } else {
      disbutton = true;
    }
  });

  onMount(async () => {
    const username = localStorage.getItem("username")
    sectfor=username
    getAuthData();
    axios
      .get("paging")
      .then((res) => {
        options_call = res.data;
      })
      .catch((error) => console.error(`Error:${error}`));

    axios
      .get("paging/flag")
      .then((res) => {
        disbutton = res.data;
      })
      .catch((error) => console.error(`Error:${error}`));

    axios
      .get("paging/section")
      .then((res) => {
        options_sect = res.data;
      })
      .catch((error) => console.error(`Error:${error}`));

    connection.start();
  });

  function changeOption() {
    let obj = options_call.find((o) => o.id === selected_call);
    title_cal = obj.inst;
  }

  function changeSect() {
    let obj = options_sect.find((o) => o.id === selected_sect);
  }

  function callFocus(input) {
    input.focus();
  }

  let uid = listname.length + 1;
  function handleClick(ls) {
    if (ls["textbtn"] == "X") {
      listname = listname.filter((t) => t !== ls);
    } else {
      listname[listname.length - 1].colorbtn = "danger";
      listname[listname.length - 1].textbtn = "X";
      listname[listname.length - 1].read = true;
      const list = {
        id: uid++,
        name: "",
        colorbtn: "primary",
        textbtn: "+",
        read: false,
      };

      listname = [...listname, list];
    }
  }

  function handleSave(flag) {
    if (selected_call == 9) {
      let data = {
        id_master: selected_call,
        call: calfor,
        flag: "1",
        ent_by: username,
      }
      axios
        .post("paging", data)
        .then((res) => {
          connection.invoke("SendMessage", voices, "");
          disbutton = true;
        })
        .catch((error) => console.error(`Error:${error}`));
    } else {
      let data = {
        id_master: selected_call,
        call: calfor + ", Sexsion " + selected_sect + ", ",
        fors: desti,
        flag: "1",
        ent_by: username,
      };  
      axios
        .post("paging", data)
        .then((res) => {
          connection.invoke("SendMessage", voices, "");
          disbutton = true;
        })
        .catch((error) => console.error(`Error:${error}`));
    }
  }

  async function handleSend(e) {
    e.preventDefault()
    let namess = [];
    listname.forEach((el) => {
      namess.push(el.name);
    });
    if (selected_call == 9) {
      calfor = namess.join(", ").replace(/, ([^,]*)$/, ", $1");
    } else {
      calfor = namess.join(", ").replace(/, ([^,]*)$/, ", dan $1");
    }
    if (selected_call == 1) {
      voices = `Mohon Perhatian, Panggilan Kepada ${calfor} Sexsion ${selected_sect}, Dimohon segera  menghubungi Extension ${desti}. Terima Kasih.`;
    } else if (selected_call == 2) {
      voices = `Mohon Perhatian, Panggilan Kepada ${calfor} Sexsion ${selected_sect} , Dimohon segera  Menuju Ke ${desti}. Terima Kasih.`;
    } else {
      voices = `Mohon Perhatian, ${calfor}. Terima Kasih.`;
    }
    console.log(voices);
    handleSave(0);
  }
</script>

<Navbar />
<main class="container">
  <form on:submit={handleSend}>
    <div class="mb-3 col-md-12">
      <label for="action" class="form-label">Action</label>
      <select
        required
        bind:value={selected_call}
        on:change={changeOption}
        class="form-select"
      >
        <option selected value="">Open this select Action</option>
        {#if username=="ga"}
          {#each options_call as option}
            <option value={option.id}>{option.descript}</option>
          {/each}
        {:else}
          {options_call = options_call.filter((x) => x.inst != "Announcement")}
          {#each options_call as option}
            <option value={option.id}>{option.descript}</option>
          {/each}
        {/if}
      </select>
    </div>
    {#if selected_call == 9}
      <div class="mb-3 col-md-12">
        <label for="name" class="form-label">{title_cal}</label>
        <!-- {#each listname as list (list.id)} -->
          <div class="row" style="margin-bottom:5px;">
            <div class="col-sm-12">
              <textarea
                use:callFocus
                bind:value={listname[0].name}
                type="text"
                rows="6"
                class="form-control"
                id="name"
                placeholder="Enter Annoucement"
              />
            </div>
          </div>
        <!-- {/each} -->
      </div>
    {:else}
      <div class="mb-3 col-md-12">
        <label for="name" class="form-label">Name</label>
        {#each listname as list (list.id)}
          <div class="row" style="margin-bottom:5px;">
            <div class="col-sm-11">
              <input
                required
                use:callFocus
                bind:value={list.name}
                type="text"
                readOnly={list.read}
                class="form-control"
                id="name"
                placeholder="Enter Name"
              />
            </div>
            <div class="col-sm-1">
              <input
                type="button"
                on:click={handleClick(list)}
                value={list.textbtn}
                class="btn btn-{list.colorbtn}"
              />
            </div>
          </div>
        {/each}
      </div>
      <div class="mb-3 col-md-12">
        <label for="action" class="form-label">Section</label>
        <select
          required
          bind:value={selected_sect}
          on:change={changeSect}
          class="form-select"
        >
          <option selected value="">Open this select section</option>
          {#each options_sect as option}
            <option value={option.name}>{option.name}</option>
          {/each}
        </select>
      </div>
      <div class="mb-3 col-md-12">
        <label for="inputAddress" class="form-label">{title_cal}</label>
        <input required
          type="text"
          bind:value={desti}
          class="form-control"
          id="inputAddress"
        />
      </div>
    {/if}
    <button
      type="submit"
      class="btn btn-primary"
      disabled={disbutton}>Call</button
    >
    {#if disbutton}
      <p class="alert alert-danger mt-3" role="alert">
        Announcement is still running
      </p>
    {/if}
  </form>
</main>
