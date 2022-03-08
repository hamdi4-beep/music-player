const init = () => {
    const wrapper = document.querySelector('.wrapper')
    const trackContainers = wrapper.querySelectorAll('.track-container')
    const audio = new Audio
    let currentPlayer
    let details

    const imgs = [
        'https://www.zastavki.com/pictures/2560x1600/2020Anime_Anime_girl_with_headphones_on_her_head_145240_19.jpg',
        'https://img.wallpapersafari.com/tablet/768/1024/49/5/4usnWf.png',
        'https://wallpapercave.com/wp/9w5bb53.jpg',
        'https://wallpaperaccess.com/full/38086.jpg',
        'https://wallpapercave.com/wp/wp4163647.jpg'
    ]

    const list = [
        'https://vgmsite.com/soundtracks/persona-5/szuiidvl/1-01.%20Wake%20Up%2C%20Get%20Up%2C%20Get%20Out%20There.mp3',
        'https://vgmsite.com/soundtracks/kirby-planet-robobot-original-soundtrack/dopwqvhctg/1-05%20Adventure%20in%20the%20World%20of%20Machines.mp3',
        'https://vgmsite.com/soundtracks/silent-hill-3-original/eibucmzo/03.%20Float%20Up%20From%20Dream.mp3',
        'https://vgmsite.com/soundtracks/persona-4-arena-original-soundtrack/qfpkhgsflq/01.%20Best%20Friends.mp3',
        'https://vgmsite.com/soundtracks/metal-gear-solid-3-snake-eater-original-soundtrack/luivnntl/1-03.%20CQC.mp3'
    ]

    for (let i=0; i<trackContainers.length; i++) {
        const controls = trackContainers[i].querySelector('.controls')
        const info = trackContainers[i].querySelector('.info')
        const title = info.querySelector('p')
        const progress = document.createElement('div')
        const span = document.createElement('span')
        const p = document.createElement('p')

        trackContainers[i].style.backgroundImage = `url(${imgs[i]})`
        progress.classList.add('progress')
        p.classList.add('duration')

        trackContainers[i].ondblclick = function(ev) {
            if (ev.target.className == trackContainers[i].className) {
                const _target = ev.target

                for (const track of trackContainers) {
                    if (ev.target != track) {
                        track.classList.add('hidden')
                    } else {
                        const closeIcon = track.querySelector('.fa-close')
                        closeIcon.style.display = 'inline'
                        _target.classList.remove('selected')
                    }
                }
            }
        }

        trackContainers[i].onclick = function(ev) {
            const closeIcon = trackContainers[i].querySelector('.fa-close')

            if (ev.target.className == 'fas fa-edit') {
                uploadImg(trackContainers[i])
            }

            if (ev.target.className == 'fas fa-close') {
                for (const track of trackContainers) {
                    if (track.classList.contains('hidden')) {
                        track.classList.remove('hidden')
                    }
                }

                closeIcon.style.display = 'none'
            }

            playMusic(ev, list[i])
        }

        controls.append(progress)
        title.append(span)
        info.append(p)
    }

    audio.ontimeupdate = function() {
        const duration = currentPlayer.querySelector('.duration')
        const bar = currentPlayer.querySelector('.progress')
        const mins = ('0' + Math.floor(audio.currentTime / 60)).substr(-2)
        const secs = ('0' + Math.floor(audio.currentTime % 60)).substr(-2)
        const progress = audio.currentTime / audio.duration

        if (!audio.error) {
            duration.textContent = `${mins}:${secs}`
            bar.style.width = `${progress * 100}%`
        }
    }

    audio.onpause = function() {
        if (!audio.error && audio.readyState == audio.HAVE_ENOUGH_DATA) details.textContent = ' - is paused now!'
    }

    audio.onplay = function() {
        for (const player of trackContainers) {
            if (player != currentPlayer) {
                const span = player.querySelector('p span')
                const duration = player.querySelector('.duration')
                const bar = player.querySelector('.progress')

                duration.textContent = ''
                span.textContent = ''
                bar.style.width = '0%'

                player.classList.remove('selected')
            }
        }
    }

    audio.onloadstart = function() {
        const progress = currentPlayer.querySelector('.progress')

        details.textContent = ' - is loading...'
        progress.classList.add('loading')
        progress.style.width = '5em'
    }

    audio.oncanplay = function() {
        const progress = currentPlayer.querySelector('.progress')

        details.textContent = ' - is playing now!'
        progress.classList.remove('loading')
        audio.play()
    }

    audio.onerror = function() {
        const duration = currentPlayer.querySelector('.duration')
        const progress = currentPlayer.querySelector('.loading')
        details.textContent = ' - failed to load!'
        duration.textContent = ''
        audio.error = true
        progress.classList.remove('loading')
        progress.style.width = '0'
    }

    audio.onended = function() {
        details.textContent = ' - has finished playing!'
    }

    function playMusic(event, url) {
        const player = event.target.parentElement.parentNode
        let info

        if (event.target.id == 'play') {
            if (audio.src != url) {
                audio.src = url
            }

            currentPlayer = event.currentTarget
            info = currentPlayer.querySelector('.info')
            details = info.querySelector('p span')
            if (!audio.error && audio.readyState == audio.HAVE_ENOUGH_DATA) details.textContent = ' - is playing now!'

            for (const player of trackContainers) {
                if (player.classList.contains('hidden')) {
                    currentPlayer.classList.remove('selected')
                } else {
                    currentPlayer.classList.add('selected')
                }
            }

            audio.play()
        } else if (event.target.id == 'pause' && player == currentPlayer) {
            audio.pause()
        }
    }

    function uploadImg(elem) {
        const input = document.createElement('input')
        input.type = 'file'
        input.click()

        input.onchange = function() {
            if (this.files[0]) {
                const reader = new FileReader
                const file = this.files[0]
                const type = file.type

                if (type.split('/')[0] == 'image') {
                    reader.onload = function() {
                        elem.style.backgroundImage = `url(${reader.result})`
                    }

                    reader.readAsDataURL(file)
                }
            }
        }

        input.remove()
    }
}

window.onload = init