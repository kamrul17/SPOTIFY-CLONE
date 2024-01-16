console.log("let do some");
let currentSong = new Audio();
async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  //   console.log(div);
  let atag = div.getElementsByTagName("a");
  //   console.log(atag);
  let songs = [];
  for (let index = 0; index < atag.length; index++) {
    const element = atag[index];

    if (element.href.endsWith(".m4a")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  //   console.log(songs);

  return songs;
}

// play music func
const playMusic = (track) => {
  currentSong.src = "/songs/" + track;
  currentSong.play();
};
async function main() {
  let currentSong;
  let songs = await getSongs();
  //   console.log(songs);
  let songul = document
    .querySelector(".songlists")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songul.innerHTML += `<li><div class="info">
    <div> ${song.replaceAll("%20", " ")}</div>
   
</div></li>`;
  }
  Array.from(
    document.querySelector(".songlists").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}
main();
// songul.innerHTML += `<li>${song.replaceAll(
//   "%20",
//   ""
// )}<span style="padding-left:3px;"><i class="fa-solid fa-music"></i></span></li>
