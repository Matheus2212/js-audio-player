const AudioPlayer = {
        options: null,
        canvas: null,
        index: 0,
        currentItem: null,
        mainTag: null,
        status: false,
        createCanvas: function () {
                var canvas = document.createElement('div');
                canvas.classList.add('js-audio-player');
                if (this.options.hasOwnProperty("wrapperClass") && typeof this.options.wrapperClass === "string") {
                        let aux = this.options.wrapperClass.split(' ');
                        aux.forEach(function ($class) {
                                if ($class.trim() !== "") {
                                        canvas.classList.add($class);
                                }
                        });
                }
                canvas.innerHTML = "<div class='js-audio-player-image'></div><div class='js-audio-player-status'><div class='js-audio-player-status-bar'><span class='js-audio-current'>0:00</span><span class='js-audio-bar'><div class='js-audio-range'><input data-background='#CCCCCC' data-color='#333333' type='range' max='100' value='0' /></div></span><span class='js-audio-total'>0:00</span></div><div class='js-audio-controls'></div></div>";
                canvas.querySelector('.js-audio-player-status').appendChild(this.mainTag);
                document.getElementsByTagName('body')[0].append(canvas);
                this.canvas = canvas;
        },
        timeFormat: function (duration) {
                // Hours, minutes and seconds
                let hrs = ~~(duration / 3600);
                let mins = ~~((duration % 3600) / 60);
                let secs = ~~duration % 60;
                let ret = "";
                if (hrs > 0) {
                        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
                }
                ret += "" + mins + ":" + (secs < 10 ? "0" : "");
                ret += "" + secs;
                return ret;
        },
        prepareSound: function () {
                if (this.options == null) {
                        return;
                }
                this.index = 0;
                if (this.options.hasOwnProperty('startAt') && (typeof this.options.startAt == "string" || typeof this.options.startAt == "number")) {
                        this.index = this.options.startAt;
                }
                if (this.options.hasOwnProperty('file') && typeof this.options.file === "string" && this.options.file !== "") {
                        let identification = this.identify(this.options.file);
                        if (identification === "audio") {
                                this.prepareAudio(this.options.file);
                        } else {
                                this.prepareIframe(identification);
                        }
                }
                if (this.options.hasOwnProperty('queue') && typeof this.options.queue === "object" && this.options.queue.length > 0 !== "") {

                        let identification = this.identify(this.options.queue[this.index]);
                        if (identification === "audio") {
                                this.prepareAudio(this.options.queue[this.index]);
                        } else {
                                this.prepareIframe(identification);
                        }
                }
        },
        prepareAudio: function (source) {
                this.mainTag = document.createElement('audio');
                this.mainTag.setAttribute('controls', true);
                let sourceEl = document.createElement('source');
                sourceEl.src = source;
                this.mainTag.appendChild(sourceEl);
        },
        prepareIframe: function (data) {
                this.mainTag = document.createElement('iframe');
                this.mainTag.id = "jsAudioIframe";
                //this.mainTag.setAttribute('allow', 'accelerometer;clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                let src = `https://www.youtube.com/embed/${data.id}`;
                if (this.options.hasOwnProperty('autoplay') && this.options.autoplay) {
                        src += '?autoplay=1&controls=0';
                }
                this.mainTag.src = src;
        },
        identify: function (source) {
                let type = "url";
                let id = "";
                console.log(source);
                if (/youtu\.be/.test(source)) {
                        type = "youtube";
                        let aux = source.split('/');
                        id = aux[aux.length - 1];
                        return { service: "youtube", id: id };
                }
                if (/youtube\.com\/embed/.test(source)) {
                        type = "youtube";
                        id = source.split('embed/')[1];
                        return { service: "youtube", id: id };
                }
                if (/youtube\.com\/watch/.test(source)) {
                        type = "youtube";
                        id = source.split('v=')[1];
                        return { service: "youtube", id: id };
                }
                return "audio";
        },
        applyAudioEvents: function () {
                let func = this.timeFormat;
                let player = this.canvas;
                let op = this.options;
                if (this.mainTag.tagName === "AUDIO") {
                        this.mainTag.onended = function (e) {
                                player.querySelector("[data-icon='play']").style.display = "inline-block";
                                player.querySelector("[data-icon='pause']").style.display = "none";
                                if (op.hasOwnProperty('repeat') && op.repeat) {
                                        e.target.parentNode.querySelector('[data-icon="play"]').dispatchEvent(new Event('click'));
                                }
                        };
                        this.mainTag.onloadedmetadata = function (e) {
                                e.target.parentNode.querySelector('.js-audio-total').innerHTML = func(e.target.duration);
                                e.target.parentNode.querySelector('.js-audio-range>input').max = e.target.duration;
                        };
                        this.mainTag.ontimeupdate = function (e) {
                                e.target.parentNode.querySelector('.js-audio-current').innerHTML = func(e.target.currentTime);
                                if (!this.paused) {
                                        let input = e.target.parentNode.querySelector('.js-audio-range>input');
                                        input.value = e.target.currentTime;
                                        jsAudioRangeHandle(input);
                                }
                        }
                        let input = player.querySelector('.js-audio-range>input');
                        function jsAudioRangeHandle(input) {
                                let progress = (input.value / input.max) * 100;
                                let bg = input.getAttribute('data-background');
                                let c = input.getAttribute('data-color');
                                input.style.background = `linear-gradient(to right, ${c} ${progress}%, ${bg} ${progress}%)`;
                        }
                        input.addEventListener("input", function () {
                                let audio = player.querySelector('audio');
                                audio.pause();
                                jsAudioRangeHandle(this);
                        });
                        input.addEventListener("change", function () {
                                let input = this;
                                jsAudioRangeHandle(input);
                                let audio = player.querySelector('audio');
                                audio.currentTime = input.value;
                                setTimeout(function () {
                                        audio.play();
                                }, 10);
                        });
                }

        },
        createButton: function (icon, additionalClass) {
                let button = document.createElement('button');
                button.classList.add('js-player-button');
                button.setAttribute('data-icon', icon);
                if (typeof additionalClass === "string") {
                        let aux = additionalClass.split(' ');
                        aux.forEach(function ($class) {
                                if ($class.trim() !== "") {
                                        button.classList.add($class);
                                }
                        });
                }
                if (icon == "pause") {
                        button.style.display = "none";
                }
                let iconSpan = document.createElement('span');
                iconSpan.classList.add('js-player-icon');
                iconSpan.classList.add(icon);
                button.appendChild(iconSpan);
                return button;
        },
        prepareOptions: function () {
                let wrapper = document.createElement('div');
                wrapper.classList.add('js-audio-player-buttons-wrapper');
                wrapper.appendChild(this.createButton('prev'));
                wrapper.appendChild(this.createButton('play'));
                wrapper.appendChild(this.createButton('pause'));
                wrapper.appendChild(this.createButton('next'));
                this.canvas.querySelector('.js-audio-controls').appendChild(wrapper);
        },
        applyActions: function () {
                let player = this.mainTag;
                let wrapper = this.canvas;
                wrapper.querySelectorAll('.js-player-button').forEach(function ($button) {
                        $button.addEventListener('click', function () {
                                let type = this.getAttribute('data-icon');
                                if (type == "play") {
                                        if (player.tagName === "AUDIO") {
                                                player.play();
                                        }
                                        if (player.tagName === "IFRAME") {
                                                console.log(player);
                                        }
                                        wrapper.querySelector('[data-icon="pause"]').style.display = "inline-block";
                                        this.style.display = "none";
                                }
                                if (type == "pause") {
                                        if (player.tagName === "AUDIO") {
                                                player.pause();
                                        }
                                        wrapper.querySelector('[data-icon="play"]').style.display = "inline-block";
                                        this.style.display = "none";
                                }
                        });
                });
        },
        init: function (options) {
                if (typeof options === "object" && options !== null) {
                        this.options = options;
                }
                this.prepareSound();
                this.createCanvas();
                this.prepareOptions();
                this.applyActions();
                this.applyAudioEvents();
                if (options.hasOwnProperty('autoplay') && options.autoplay) {
                        let tag = this.canvas;
                        function jsAudioPlay() {
                                window.removeEventListener('mousemove', jsAudioPlay, false)
                                tag.querySelector('[data-icon="play"]').dispatchEvent(new Event('click'));
                        }
                        window.addEventListener('mousemove', jsAudioPlay)
                }
        }
}
//youtube URL
//vimeo URL
//soundcloud URL
//file
//base64