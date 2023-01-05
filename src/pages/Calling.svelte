<script>
  import axios from "axios";
  import { HubConnectionBuilder } from "@microsoft/signalr";
  import { onMount } from "svelte";
  // @ts-ignore
  import Artyom from "artyom.js";
  
  import { getAuthData } from "../lib/auth.js";
  import Navbar from "../layout/Navbar.svelte";
  
  let bellVolumeValue="1"
  let artyomVolumeValue="1"
  let listcall = [];
  let voices = "";
  let soundStart = new Audio('./audio/sound-start-low.mp3');
  let soundFinish = new Audio('./audio/sound-finish-low.mp3');

  function bellVolume(e) {
    soundStart.volume = e.target.value
    soundFinish.volume = e.target.value
  }

  let connection = new HubConnectionBuilder()
  // .withUrl("http://sbilocal:8082/hubs")
  .withUrl("https://localhost:44366/hubs")
  .withAutomaticReconnect()
  .build();
  
  const artyom = new Artyom();
  
  onMount(async () => {
    getAuthData()
    connection.start();
    artyom
    .initialize({
      // if you want to run it without internet connection, it will use browser default initialization
      lang: "id-ID",
      continuous: false, // recognize 1 command and stop listening !
      debug: true, // Show everything in the console
      speed: 1, // talk normally
      volume: artyomVolumeValue, // setting volume
    })
    .then(function () {
      console.log("Ready to work !");
    });
  });
  
  connection.on("ReceiveMessage", (data) => {
    if (data != "1") showData();
  });
  
  async function updateData(id) {
    let data = {
      id: id,
    };
    await axios
    .put("paging", data)
    .then((res) => {
      showData();
    })
    .catch((error) => console.error(`Error:${error}`));
  }
  
  function play() {
    artyom.fatality();// use this to stop any of
    soundStart.play();
    
    setTimeout(function(){
      artyom.say(voices, {
        onStart: function () {
          console.log("Mulai");
        },
        onEnd: function () {
          soundFinish.play();
          setTimeout(function(){
            voices = "";
            updateData(listcall[0].id);
            connection.invoke("SendMessage", "1", "");
            console.log("Selesai");
          }, 3000)
        },
      });
    }, 3000);
    return;
  }

  async function deleteFlag() {
    axios
      .delete("paging/flag")
      .then((res) => {
        if (res.data) {
          alert("Success Delete Announcement");
          showData();
        } else {
          alert("No Announcement want to delete");
        }
      })
      .catch((error) => console.error(`Error:${error}`));
  }

  async function showData() {
    axios
      .get("paging/list")
      .then((res) => {
        listcall = res.data;
        voices = `Mohon Perhatian. ${listcall[0].descrip}. Sekali lagi. ${listcall[0].descrip}. Terima Kasih.`;
        if (listcall[0].flag === "2") {
          artyom.shutUp();
        } else {
          play();
        }
        console.log(voices); // Berhasil Mengirim voice yang telah di kirim dari home
        console.log(listcall[0].descrip); // berhasil menampilkan listcall dari db
        console.log(listcall[0].flag); // berhasil menampilkan listcall flag dari db
      })
      .catch((error) => console.error(`Error:${error}`));
    }
  </script>

<Navbar />
<main class="container calling">
  <div class="row" style="margin-top: 15px;">
    <!-- table -->
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">Call Queu</div>
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {#each listcall as item}
              <tr>
                {#if item.flag === "1"}
                <td>{item.descrip}</td>
                <td>
                  <span class="badge bg-warning">Process</span>
                </td>
                {/if}
              </tr>
              {/each}
            </tbody>
          </table>
          <button class="btn btn-danger" on:click={deleteFlag}
            >Delete Announcement</button
            >
          </div>
        </div>
    </div>
    
    <label for="">Sound Bell Volume : <span>{soundStart.volume}</span></label>
    <input type="range" min="0" max="1" step=".1" bind:value={bellVolumeValue} on:change={bellVolume} class="w-25" />
    
  </div>
</main>
