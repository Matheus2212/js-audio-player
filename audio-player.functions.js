const AudioPlayer = {
        canvas: null,

        createCanvas: function () {
                var canvas = document.createElement('div');
                canvas.classList.add('js-audio-player');
                canvas.innerHTML = "<div class='js-audio-player-image'></div><div class='js-audio-player-status'>" + this.getControls().outerHTML + "</div>";
                document.getElementsByTagName('body')[0].append(canvas);
                this.canvas = canvas;
                this.delegate.basic();
        },
        getControls: function (options) {
                var controlsElm = document.createElement('div');
                var basicControls = document.createElement('div');
                var buttonKeys = Object.keys(this.basicControls);
                controlsElm.classList.add('js-audio-player-controls');
                basicControls.classList.add('js-audio-player-basic');
                controlsElm.append(basicControls);

                for (var iterate = 0; iterate < buttonKeys.length; iterate++) {
                        var button = this.createButton();
                        button.innerText = this.basicControls[buttonKeys[iterate]].text['en'];
                        button.setAttribute('id', this.basicControls[buttonKeys[iterate]].id);
                        basicControls.append(button);
                }

                if (typeof options !== "undefined") {

                }

                return controlsElm;
        },
        createButton: function () {
                var button = document.createElement('a');
                button.classList.add('js-audio-player-button');
                return button;
        },
        bindToggle: function (elm, target, className) {
                elm.addEventListener('click', function (evt) {
                        (target.classList.contains(className) ? target.classList.remove(className) : target.classList.add(className));
                        evt.preventDefault();
                });
        },
        basicControls: {
                file: {
                        id: "js-audio-player-file",
                        name: "js-audio-player-file",
                        text: {
                                'en': "Add audio from File",
                        },
                        action: function () {

                        }
                },
                url: {
                        id: "js-audio-player-url",
                        name: "js-audio-player-url",
                        text: {
                                'en': "Add audio from URL",
                        },
                        action: function (button) {
                                button = document.getElementById(button);
                                var where = AudioPlayer.canvas.getElementsByClassName('js-audio-player-basic')[0];
                                var input = document.createElement('input');
                                input.setAttribute('name', this.name);
                                input.setAttribute('type', 'text');
                                input.setAttribute('placeholder', 'Paste URL here');
                                where.append(input);
                                AudioPlayer.bindToggle(button, input, 'js-audio-player-show');
                                AudioPlayer.youtube.init(input);
                        }
                }
        },
        delegate: {
                basic: function () {
                        var button = AudioPlayer.createButton();
                        var status = AudioPlayer.canvas.getElementsByClassName('js-audio-player-controls')[0];
                        var basic = status.getElementsByClassName('js-audio-player-basic')[0];
                        var objectKeys = Object.keys(AudioPlayer.basicControls);
                        button.classList.add('js-audio-player-toggle-basic-controls');
                        status.append(button);
                        AudioPlayer.bindToggle(button, basic, 'js-audio-player-show');

                        for (var iterate = 0; iterate < objectKeys.length; iterate++) {
                                object = AudioPlayer.basicControls[objectKeys[iterate]];
                                object.action(object.id);
                        }
                }
        },
        youtube: {
                action: function () {

                },
                bind: function (element) {
                        //element.removeEventListener('click', this.action, false);
                        //element.addEventListener('click', this.action);
                },
                init: function () {

                }
        },


        init: function (options) {
                this.createCanvas();
        }
}
//youtube URL
//vimeo URL
//soundcloud URL
//file