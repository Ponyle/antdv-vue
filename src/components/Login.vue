<template>
    <div>

        <div class=" landscape flex a-c j-c"  style="z-index:999">
            <a-form id="nav_top" :form="form" class="login-form" @submit="handleSubmit">
                <h1>LEGE SYSTEM</h1>
                <a-form-item>
                    <a-input
                            v-decorator="['userName', { rules: [{ required: true, message: '请输入账号!' }] }, ]"
                            placeholder="账号">
                        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-input
                            v-decorator="[ 'password', { rules: [{ required: true, message: '请输入密码!' }] },]"
                            type="password"
                            placeholder="密码">
                        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-checkbox
                            v-decorator="['remember',{valuePropName: 'checked', initialValue: true, },]">
                        七天内免登陆
                    </a-checkbox>

                    <a-button type="primary" html-type="submit" class="login-form-button">
                        登 录
                    </a-button>

                </a-form-item>
            </a-form>
        </div>
        <div class="filter">
        </div>
        <canvas id="canvas">

        </canvas>
    </div>
</template>
e
<script>
    import login from '../../src/aip/user/index'
    export default {
        name: "Login",
        beforeCreate() {
            this.form = this.$form.createForm(this, { name: 'normal_login' });
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields( async (err, values) => {
                    if (!err) {
                        let {userName,password,remember} = values
                        let res = await login(userName,password)
                        if (res.data.state){
                            this.$setCookie({
                                username:values.userName,
                                user_type:res.data.user_type
                            },
                                remember?{expires: 7}:null
                            )

                            this.$message.success('登陆成功', 1, () => {
                            })
                            this.$router.push('/')
                        }else {
                            this.$message.error('登陆失败')
                        }
                    }
                });
            },
        },

        mounted() {
            function Star(id, x, y) {
                this.id = id;
                this.x = x;
                this.y = y;
                this.r = Math.floor(Math.random() * 2) + 1;
                var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
                this.color = "rgba(255,255,255," + alpha + ")";
            }

            Star.prototype.draw = function () {
                ctx.fillStyle = this.color;
                ctx.shadowBlur = this.r * 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.fill();
            }

            Star.prototype.move = function () {
                this.y -= .15;
                if (this.y <= -10) this.y = HEIGHT + 10;
                this.draw();
            }

            Star.prototype.die = function () {
                stars[this.id] = null;
                delete stars[this.id];
            }

            function Dot(id, x, y, r) {

                this.id = id;
                this.x = x;
                this.y = y;
                this.r = Math.floor(Math.random() * 5) + 1;
                this.maxLinks = 2;
                this.speed = .5;
                this.a = .5;
                this.aReduction = .005;
                this.color = "rgba(255,255,255," + this.a + ")";
                this.linkColor = "rgba(255,255,255," + this.a / 4 + ")";

                this.dir = Math.floor(Math.random() * 140) + 200;
            }

            Dot.prototype.draw = function () {
                ctx.fillStyle = this.color;
                ctx.shadowBlur = this.r * 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.fill();
            }

            Dot.prototype.link = function () {
                if (this.id == 0) return;
                var previousDot1 = getPreviousDot(this.id, 1);
                var previousDot2 = getPreviousDot(this.id, 2);
                var previousDot3 = getPreviousDot(this.id, 3);
                if (!previousDot1) return;
                ctx.strokeStyle = this.linkColor;
                ctx.moveTo(previousDot1.x, previousDot1.y);
                ctx.beginPath();
                ctx.lineTo(this.x, this.y);
                if (previousDot2 != false) ctx.lineTo(previousDot2.x, previousDot2.y);
                if (previousDot3 != false) ctx.lineTo(previousDot3.x, previousDot3.y);
                ctx.stroke();
                ctx.closePath();
            }

            function getPreviousDot(id, stepback) {
                if (id == 0 || id - stepback < 0) return false;
                if (typeof dots[id - stepback] != "undefined") return dots[id - stepback];
                else return false;//getPreviousDot(id - stepback);
            }

            Dot.prototype.move = function () {
                this.a -= this.aReduction;
                if (this.a <= 0) {
                    this.die();
                    return
                }
                this.color = "rgba(255,255,255," + this.a + ")";
                this.linkColor = "rgba(255,255,255," + this.a / 4 + ")";
                this.x = this.x + Math.cos(degToRad(this.dir)) * this.speed;
                this.y = this.y + Math.sin(degToRad(this.dir)) * this.speed;
                this.draw();
                this.link();
            }

            Dot.prototype.die = function () {
                dots[this.id] = null;
                delete dots[this.id];
            }


            var canvas = document.getElementById('canvas'),
                ctx = canvas.getContext('2d'),
                WIDTH,
                HEIGHT,
                mouseMoving = false,
                mouseMoveChecker,
                mouseX,
                mouseY,
                stars = [],
                initStarsPopulation = 80,
                dots = [],
                dotsMinDist = 2,
                maxDistFromCursor = 50;

            setCanvasSize();
            init();

            function setCanvasSize() {
                WIDTH = document.documentElement.clientWidth,
                    HEIGHT = document.documentElement.clientHeight;
                canvas.setAttribute("width", WIDTH);
                canvas.setAttribute("height", HEIGHT);
            }

            function init() {
                ctx.strokeStyle = "white";
                ctx.shadowColor = "white";
                for (var i = 0; i < initStarsPopulation; i++) {
                    stars[i] = new Star(i, Math.floor(Math.random() * WIDTH), Math.floor(Math.random() * HEIGHT));
                    //stars[i].draw();
                }
                ctx.shadowBlur = 0;
                animate();
            }

            function animate() {
                ctx.clearRect(0, 0, WIDTH, HEIGHT);

                for (var i in stars) {
                    // stars[i].move();
                }
                for (var m in dots) {

                    // dots[m].move();
                }
                drawIfMouseMoving();
                requestAnimationFrame(animate);
            }

            window.onmousemove = function (e) {
                mouseMoving = true;
                mouseX = e.clientX;
                mouseY = e.clientY;
                clearInterval(mouseMoveChecker);
                mouseMoveChecker = setTimeout(function () {
                    mouseMoving = false;
                }, 100);
            }


            function drawIfMouseMoving() {
                if (!mouseMoving) return;

                if (dots.length == 0) {
                    dots[0] = new Dot(0, mouseX, mouseY);
                    dots[0].draw();
                    return;
                }

                var previousDot = getPreviousDot(dots.length, 1);
                var prevX = previousDot.x;
                var prevY = previousDot.y;

                var diffX = Math.abs(prevX - mouseX);
                var diffY = Math.abs(prevY - mouseY);

                if (diffX < dotsMinDist || diffY < dotsMinDist) return;

                var xVariation = Math.random() > .5 ? -1 : 1;
                xVariation = xVariation * Math.floor(Math.random() * maxDistFromCursor) + 1;
                var yVariation = Math.random() > .5 ? -1 : 1;
                yVariation = yVariation * Math.floor(Math.random() * maxDistFromCursor) + 1;
                dots[dots.length] = new Dot(dots.length, mouseX + xVariation, mouseY + yVariation);
                dots[dots.length - 1].draw();
                dots[dots.length - 1].link();
            }

            function degToRad(deg) {
                return deg * (Math.PI / 180);
            }

        },
    }
</script>

<style scoped>
    #nav_top {

        padding:10px;
        border-radius: 10px;
        background: rgba(0,0,0,.1);
    }

    #nav_top .login-form-button {
        width: 100%;
    }
    h1{
        font-weight: bold;
        position:relative;
        /*text-shadow: 2px 2px 15px green;*/
        color: rgba(12,233,174);
        font-size: 40px;
        left: 60px;


    }
    h1::after{
        content:"LEGE SYSTEM";
        position: absolute;
        color: transparent;
        left: 0;
        top: 0;
        background: url("../../public/bg.jpg") 0 / 100% 100%;
        -webkit-background-clip:text;
        clip: rect(0px,20px,50px,0px);
        animation: move 2s infinite alternate-reverse;
    }
    @keyframes move {
        from {
            clip: rect(0px,50px,50px,0px);
        }
        to{
            clip: rect(0px,300px,50px,250px);
        }
    }
    .login-form {
        width: 400px;

    }

    #nav_top .login-form-button {
        width: 100%;
    }
    html, body {
        margin: 0;
        overflow: hidden;
        width: 100%;
        height: 100%;
        cursor: none;
    }

    .filter {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #fe5757;
        animation: colorChange 30s ease-in-out infinite;
        animation-fill-mode: both;
        mix-blend-mode: overlay;
    }

    @keyframes colorChange {
        0%, 100% {
            opacity: 0;
        }
        50% {
            opacity: .9;
        }
    }

    .landscape {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('../../public/xkbg.png');
        background-size: 1000px 250px;
        background-repeat: repeat-x;
        background-position: center bottom;
    }

</style>