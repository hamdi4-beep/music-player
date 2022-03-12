const init = () => {
    const wrapper = document.querySelector('.wrapper')
    const trackContainers = wrapper.querySelectorAll('.track-container')
    const audio = new Audio
    let currentPlayer
    let status

    const imgs = [
        'https://www.zastavki.com/pictures/2560x1600/2020Anime_Anime_girl_with_headphones_on_her_head_145240_19.jpg',
        'https://img.wallpapersafari.com/tablet/768/1024/49/5/4usnWf.png',
        'https://wallpapercave.com/wp/9w5bb53.jpg',
        'https://wallpaperaccess.com/full/38086.jpg',
        'https://wallpaperaccess.com/full/17350.jpg'
    ]

    const list = [
        'https://vgmsite.com/soundtracks/persona-5/szuiidvl/1-01.%20Wake%20Up%2C%20Get%20Up%2C%20Get%20Out%20There.mp3',
        'https://vgmsite.com/soundtracks/kirby-s-return-to-dream-land/ozhvtqgwda/1-04%20A%20Visitor%20from%20Afar.mp3',
        'https://vgmsite.com/soundtracks/silent-hill-3-original/eibucmzo/03.%20Float%20Up%20From%20Dream.mp3',
        'https://vgmsite.com/soundtracks/persona-4-arena-original-soundtrack/qfpkhgsflq/01.%20Best%20Friends.mp3',
        'https://vgmsite.com/soundtracks/one-piece-pirate-warriors-3-gamerip/kpxzpwed/04%20Lets%20Put%20This%20Matter%20Under.mp3'
    ]

    for (let i=0; i<trackContainers.length; i++) {
        const controls = trackContainers[i].querySelector('.controls')
        const info = trackContainers[i].querySelector('.info')
        const title = info.querySelector('p')
        const progress = document.createElement('div')
        const statusTxt = document.createElement('span')
        const durationLength = document.createElement('p')

        trackContainers[i].style.backgroundImage = `url(${imgs[i]})`
        progress.classList.add('progress')
        durationLength.classList.add('duration')

        trackContainers[i].ondblclick = function(ev) {
            const styles = getComputedStyle(wrapper)

            if (ev.target.className == trackContainers[i].className) {
                const firstChild = wrapper.firstElementChild

                for (const track of trackContainers) {
                    if (ev.target != track) {
                        track.classList.add('hidden')
                    } else {
                        const closeIcon = track.querySelector('.fa-close')
                        closeIcon.style.display = 'inline'
                    }
                }

                if (ev.target == firstChild && firstChild == currentPlayer) {
                    firstChild.classList.remove('selected')
                    firstChild.classList.add('first-child')
                }

                if (styles.getPropertyValue('display') == 'block') {
                    if (ev.target.classList[1] == 'player-one') {
                        firstChild.classList.add('full-view')
                    }
                }
            }
        }

        trackContainers[i].onclick = function(ev) {
            const closeIcon = trackContainers[i].querySelector('.fa-close')
            const settings = trackContainers[i].querySelector('.settings ul')

            if (ev.target.className == 'fas fa-edit') {
                if (settings.classList.contains('display')) {
                    settings.classList.remove('display')
                } else {
                    settings.classList.add('display')
                }
            }

            if (ev.target.className == 'fas fa-close') {
                for (const track of trackContainers) {
                    if (track.classList.contains('hidden')) {
                        track.classList.remove('hidden')
                    }

                    if (currentPlayer == wrapper.firstElementChild) {
                        currentPlayer.classList.add('selected')
                        currentPlayer.classList.remove('first-child')
                        currentPlayer.classList.remove('full-view')
                    }
                }

                closeIcon.style.display = 'none'
            }

            if (ev.target.id == 'upload-cover-img') {
                uploadFile(trackContainers[i])
            }

            playMusic(ev, list[i])
            ev.preventDefault()
        }

        controls.append(progress)
        title.append(statusTxt)
        info.append(durationLength)
    }

    audio.onloadstart = function() {
        const progress = currentPlayer.querySelector('.progress')
        status.textContent = ' - is loading...'
        progress.classList.add('loading')
        progress.style.width = '5em'
    }

    audio.oncanplaythrough = function() {
        const progress = currentPlayer.querySelector('.progress')
        if (!audio.paused) status.textContent = ' - is playing now'
        progress.classList.remove('loading')
    }

    audio.onplay = function() {
        for (const player of trackContainers) {
            if (player != currentPlayer) {
                const status = player.querySelector('p span')
                const duration = player.querySelector('.duration')
                const bar = player.querySelector('.progress')

                duration.textContent = ''
                status.textContent = ''
                bar.style.width = '0%'

                player.classList.remove('selected')
                player.classList.remove('first-child')
            }
        }
    }

    audio.onpause = function() {
        if (!audio.error && audio.readyState == audio.HAVE_ENOUGH_DATA) status.textContent = ' - is paused now!'
        currentPlayer.querySelector('.progress').classList.remove('loading')
    }

    audio.onended = function() {
        status.textContent = ' - has finished playing!'
    }

    audio.onerror = function() {
        const duration = currentPlayer.querySelector('.duration')
        const progress = currentPlayer.querySelector('.loading')
        status.textContent = ' - failed to load!'
        duration.textContent = ''
        audio.error = true
        progress.classList.remove('loading')
        progress.style.width = '0'
    }

    audio.ontimeupdate = function() {
        const duration = currentPlayer.querySelector('.duration')
        const bar = currentPlayer.querySelector('.progress')
        const mins = ('0' + Math.floor(audio.currentTime / 60)).substr(-2)
        const secs = ('0' + Math.floor(audio.currentTime % 60)).substr(-2)
        const minsLength = Math.floor(audio.duration / 60)
        const secsLength = Math.floor(audio.duration % 60)
        const length = (minsLength <= 9 ? '0' + minsLength : minsLength) + ':' + (secsLength <= 9 ? '0' + secsLength : secsLength)
        const result = /\d/.test(length)
        const progress = audio.currentTime / audio.duration

        if (!audio.error && result) {
            duration.textContent = `${mins}:${secs} / ${length}`
            bar.style.width = `${progress * 100}%`
        }
    }

    function playMusic(event, url) {
        const player = event.target.parentElement.parentNode
        const firstChild = wrapper.firstElementChild // first player container

        if (event.target.id == 'play') {
            if (audio.src != url) {
                audio.src = url
            }

            currentPlayer = event.currentTarget
            status = currentPlayer.querySelector('.info p span')

            currentPlayer.classList.add('selected')

            for (const player of trackContainers) {
                if (player.classList.contains('hidden')) {
                    firstChild.classList.remove('selected')
                }
            }

            if (!audio.error && audio.readyState == audio.HAVE_ENOUGH_DATA) status.textContent = ' - is playing now'

            audio.play()
        } else if (event.target.id == 'pause' && player == currentPlayer) {
            if (audio.readyState == audio.HAVE_ENOUGH_DATA) audio.pause()
        } else if (event.target.id == 'stop' && player == currentPlayer) {
            if (!audio.error && audio.readyState == audio.HAVE_ENOUGH_DATA && audio.currentTime != audio.duration) {
                audio.pause()
                audio.currentTime = 0
                audio.stopped = true
                status.textContent = ' - has stopped playing'
            }
        }
    }

    function uploadFile(target) {
        const input = document.createElement('input')
        input.type = 'file'
        input.click()

        input.onchange = function() {
            if (this.files[0]) {
                const reader = new FileReader
                const file = this.files[0]
                const type = (file.type).split('/')[0]

                reader.onload = function() {
                    if (type == 'image' && target instanceof HTMLElement) {
                        target.style.backgroundImage = `url(${reader.result})`
                    }
                }

                reader.readAsDataURL(file)
            }
        }

        input.remove()
    }
}

window.onload = init
