$(document).ready(()=>{
    console.log("Script loaded!");
    let toggle = true;
    const audioPlayer = document.getElementById("audio-preview")

    $("#btn-play-pause").click(()=>{
        if(toggle){
            $("#btn-play-pause i").removeClass("fa-play-circle")
            $("#btn-play-pause i").addClass("fa-pause-circle")
            toggle = false;
            audioPlayer.play()
        }else{
            $("#btn-play-pause i").removeClass("fa-pause-circle")
            $("#btn-play-pause i").addClass("fa-play-circle")
            toggle = true;
            audioPlayer.pause()
        }
    })
        let duration = 0;
        audioPlayer.addEventListener('loadedmetadata', ()=>{
            duration = audioPlayer.duration;
            let minutes = Math.floor(duration / 60);
            let seconds = duration - minutes*60;
            if(seconds.toFixed().toString().length>1){
                $("#final-time").html(`${minutes}:${seconds.toFixed()}`);
            }else{
                $("#final-time").html(`${minutes}:0${seconds.toFixed()}`);
            }
            //console.log(seconds);
        })

    audioPlayer.addEventListener("timeupdate" , ()=>{
        let currentTime = audioPlayer.currentTime;
        let minutes = Math.floor(currentTime / 60);
        let seconds = currentTime - minutes*60;
        if(seconds.toFixed().toString().length>1){
                $("#initial-time").html(`${minutes}:${seconds.toFixed()}`);
        }else{
                $("#initial-time").html(`${minutes}:0${seconds.toFixed()}`);
        }
        
        let percentage = parseInt(currentTime)/parseInt(duration) * 100;
        $("#seekbar").css("width" , `${percentage}%`);
        //console.log(percentage +"%");
    })

    audioPlayer.addEventListener("ended" , ()=>{
        $("#seekbar").css("width" , `0%`);
        $("#btn-play-pause i").removeClass("fa-pause-circle")
        $("#btn-play-pause i").addClass("fa-play-circle")
        $("#initial-time").html(`0:0`);
        toggle = true;

    })
    const changeSong = (imgUrl , songSrc, id , songName)=>{
        $("#audio-preview").attr("src" , songSrc);
        $("#img-preview").attr("src" , imgUrl)
        $("#song-name").html(songName);
        $("#seekbar").css("width" , `0%`);
        $("#initial-time").html(`0:0`);
        $("#btn-play-pause i").removeClass("fa-play-circle")
        $("#btn-play-pause i").addClass("fa-pause-circle")
        toggle = false;
        audioPlayer.play()
        $(".music-item-wrapper").removeClass("music-item-wrapper-active")
        $(`#${id}`).addClass("music-item-wrapper-active");
        //toggle = true;
    }

    $.get("http://5dd1894f15bbc2001448d28e.mockapi.io/playlist" , (response)=>{
        console.log(response)
        $("#audio-preview").attr("src" , response[0].file);
        $("#img-preview").attr("src" , response[0].albumCover)
         $("#song-name").html(response[0].track);

        response.map((item)=>{
            const {id , track , file , artist , albumCover} = item;
            const musicItemWrapper = $("<div>").prop({
                class:"music-item-wrapper",
                id: id
            })
            const smallPreviewWrapper = $("<div>").addClass("small-preview-wrapper").append($("<img>").prop({
                class:"small-preview",
                src : albumCover,
                alt: track
            }))

            const trackNameWrapper = $("<div>").addClass("track-name-wrapper").append($("<h3>").prop({
                class:"track-name"
            }).html(track) , $("<p>").prop({
                class:"artist-name"
            }).html(artist))

            musicItemWrapper.append(smallPreviewWrapper , trackNameWrapper)
            $("#right-div").append(musicItemWrapper)
            musicItemWrapper.click((e)=>{
                //console.log(e.target);
                changeSong(albumCover , file , id , track);
            })

            $("#1").addClass("music-item-wrapper-active");
           

        })

    })

    


})