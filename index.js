let currentSong = new Audio();
const playButton = document.getElementById("play");
let songs;
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");

function secondsToMinutesAndSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Use template literals to format the output with leading zeros
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

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
const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    playButton.classList.remove("fa-play");
    playButton.classList.add("fa-pause");
  }

  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  // document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};
async function main() {
  songs = await getSongs();
  //   play first song bydefault
  playMusic(songs[0], true);
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

  // playbtn eventlistenner

  playButton.addEventListener("click", (e) => {
    if (currentSong.paused) {
      currentSong.play();
      playButton.classList.remove("fa-play");
      playButton.classList.add("fa-pause");
    } else {
      currentSong.pause();
      playButton.classList.remove("fa-pause");
      playButton.classList.add("fa-play");
    }
  });

  // listen for timeupdate and also seekbar
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(
      ".songTime"
    ).innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)} /
      ${secondsToMinutesAndSeconds(currentSong.duration)}
    `;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an event listener to previous
  previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("Previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("Previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Add an event listener to next
  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("Next clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
}
main();
