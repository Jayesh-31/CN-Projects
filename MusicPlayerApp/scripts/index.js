function setInitialSongData(){
    currentPlayList = [];
    songContainer.textContent = "";
    songList.forEach(song => {
        addSongElem(song);
    });
}

function filterByGenre(genre){
    currentPlayList = [];
    songContainer.textContent = "";
    songList.forEach(song => {
        if(song.genre == genre){
            addSongElem(song);
        }
    });
}

function addSongElem(song){
    let addSong = JSON.parse(JSON.stringify(song));
    addSong.id = currentPlayList.length;
    currentPlayList.push(addSong);
    const songElem = document.createElement('div');
    songElem.classList.add('song');
    songElem.setAttribute('data-id', addSong.id);
    songElem.textContent = `${addSong.name} - ${addSong.artist}`;
    songElem.addEventListener('click', ()=> {
        let songId = songElem.getAttribute('data-id');
        playSong(songId);
    })
    songContainer.appendChild(songElem);
}

function createPlayList(playListName){
    const playListElem = document.createElement('div');
    playListElem.classList.add('playlist-name');
    playListElem.textContent = playListName;
    playListElem.addEventListener('click', () => {
        setToCurrentPlaylist(playListElem);
    });
    allPlayListElem.appendChild(playListElem);
}

function setToCurrentPlaylist(playListElem){
    currentPlayListElem.querySelector('.current-playlist-item').innerHTML = "";
    currentPlayListElem.querySelector('.current-playlist-item').appendChild(playListElem);
}

function playSong(songId){
    let songSelected;

    for(let song of currentPlayList){
        if(song.id == songId){
            songSelected = song;
            break; 
        }
    }

    if(currentSongPlaying){
        currentSongPlaying.style.backgroundColor = 'rgb(35, 178, 244)';
        currentSongPlaying.style.color = 'black';
    }

    for(let songElem of songListContainer.querySelectorAll('.song')){
        if (songElem.getAttribute('data-id') == songId) {
            songElem.style.backgroundColor = 'rgb(0 97 141)';
            songElem.style.color = 'white';
            songElem.classList.add('song-playing');
            currentSongPlaying = songElem;
            break;
        };
    }

    imgElem.setAttribute('src', songSelected.image);
    imgElem.setAttribute('alt', songSelected.name);
    songNameElem.textContent = songSelected.name;
    artistNameElem.textContent = `-${songSelected.artist}`;

    audioSrcElem.setAttribute('src', songSelected.source);
    audioSrcElem.setAttribute('type', songSelected.srcType);

    audioElem.load();

    // Optionally, start playing the song
    audioElem.play().catch(error => {
        console.error("Error playing audio:", error);
    });
}

function playPrevSong(){
    let currentSongId = currentSongPlaying.getAttribute('data-id');
    let prevSongId = (parseInt(currentSongId) - 1).toString();
    prevSongId = prevSongId < 0 ? (currentPlayList.length - 1).toString() : prevSongId;
    playSong(prevSongId);
}

function playNextSong(){
    let currentSongId = currentSongPlaying.getAttribute('data-id');
    let nextSongId = (parseInt(currentSongId) + 1).toString();
    nextSongId = nextSongId >= currentPlayList.length ? "0": nextSongId;
    playSong(nextSongId);
}


const songContainer = document.querySelector('#song-list');
const filterSongSelect = document.getElementById('filter-song');
const cardElem = document.querySelector('.card');
const imgElem = cardElem.querySelector('img');

const songListContainer = document.querySelector('.song-list');
const songNameElem = cardElem.querySelector('.song-name');
const artistNameElem = cardElem.querySelector('.artist-name');

const audioContainer =  document.querySelector('.audio-action');
const audioElem = audioContainer.querySelector('audio'); // Select the audio element directly
const audioSrcElem = audioElem.querySelector('source');

const songButtonContainer = document.querySelector('.song-btn');
const prevSongBtn = songButtonContainer.querySelector('.prev');
const addToPlayListBtn = songButtonContainer.querySelector('.add-to-playlist');
const nextSongBtn = songButtonContainer.querySelector('.next');

const playListContainer = document.querySelector('.playlist');
const playListInputElem = playListContainer.querySelector('#playlist-name');
const createPlayListBtn = playListContainer.querySelector('.create-playlist');
const currentPlayListElem = playListContainer.querySelector('.current-playlist');
const allPlayListElem = playListContainer.querySelector('.all-playlist');

let currentSongPlaying;
let currentPlayList = songList

filterSongSelect.addEventListener('change', () => {
    let selectedGenre = filterSongSelect.value;
    if(selectedGenre == 'all'){
        setInitialSongData();
    } else {
        filterByGenre(selectedGenre);
    }
});

prevSongBtn.addEventListener('click', () => {
    playPrevSong();
});

nextSongBtn.addEventListener('click', () => {
    playNextSong();
});

createPlayListBtn.addEventListener('click', () => {
    if(playListInputElem.value !== ""){
        createPlayList(playListInputElem.value);
        playListInputElem.value = "";
    } else {
        alert("Please Enter A Name For Playlist");
    }
});

setInitialSongData();