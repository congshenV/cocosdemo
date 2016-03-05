require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Fly":[function(require,module,exports){
cc._RFpush(module, '14396Qsl9BFhaGevMsz4ZkX', 'Fly');
// script\Fly.js

"use strict";

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        // 星星和主角之间的距离小于这个数值时，就会完成收集
        pickRadius: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},

    getPlayerDistance: function getPlayerDistance() {
        // 根据 player 节点位置判断距离
        var playerPos = this.game.player.getPosition();
        // 根据两点位置计算两点之间距离
        var dist = cc.pDistance(this.node.position, playerPos);
        return dist;
    },

    onPicked: function onPicked() {
        // 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
        this.game.spawnNewStar();
        // 然后销毁当前星星节点
        this.node.destroy();
    },
    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        // 每帧判断和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        }
    }
});

cc._RFpop();
},{}],"Game":[function(require,module,exports){
cc._RFpush(module, '502b2REz/dAN5Usf4Knirzb', 'Game');
// script\Game.js

'use strict';

cc.Class({
    'extends': cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        flyPrefab: {
            'default': null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            'default': null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            'default': null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        // 生成一个新的星星
        this.spawnNewStar();
    },
    spawnNewStar: function spawnNewStar() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.flyPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());

        // 将 Game 组件的实例传入星星组件
        newStar.getComponent('Fly').game = this;
    },

    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width / 2;
        randX = cc.randomMinus1To1() * maxX;
        // 返回星星坐标
        return cc.p(randX, randY);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"Player":[function(require,module,exports){
cc._RFpush(module, 'b0a3bjrR0VNo7W2L+MRzTml', 'Player');
// script\Player.js

"use strict";

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0
    },

    setJumpAction: function setJumpAction() {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 不断重复
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown));
    },

    setInputControl: function setInputControl() {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            // 松开按键时，停止向该方向的加速
            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                }
            }
        }, self.node);
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);

        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;

        // 初始化键盘输入监听
        this.setInputControl();
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {

        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;
    }
});

cc._RFpop();
},{}]},{},["Fly","Game","Player"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHQvRmx5LmpzIiwiYXNzZXRzL3NjcmlwdC9HYW1lLmpzIiwiYXNzZXRzL3NjcmlwdC9QbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNjLl9SRnB1c2gobW9kdWxlLCAnMTQzOTZRc2w5QkZoYUdldk1zejRaa1gnLCAnRmx5Jyk7XG4vLyBzY3JpcHRcXEZseS5qc1xuXG5cInVzZSBzdHJpY3RcIjtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICAvLyDmmJ/mmJ/lkozkuLvop5LkuYvpl7TnmoTot53nprvlsI/kuo7ov5nkuKrmlbDlgLzml7bvvIzlsLHkvJrlrozmiJDmlLbpm4ZcbiAgICAgICAgcGlja1JhZGl1czogMFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuXG4gICAgZ2V0UGxheWVyRGlzdGFuY2U6IGZ1bmN0aW9uIGdldFBsYXllckRpc3RhbmNlKCkge1xuICAgICAgICAvLyDmoLnmja4gcGxheWVyIOiKgueCueS9jee9ruWIpOaWrei3neemu1xuICAgICAgICB2YXIgcGxheWVyUG9zID0gdGhpcy5nYW1lLnBsYXllci5nZXRQb3NpdGlvbigpO1xuICAgICAgICAvLyDmoLnmja7kuKTngrnkvY3nva7orqHnrpfkuKTngrnkuYvpl7Tot53nprtcbiAgICAgICAgdmFyIGRpc3QgPSBjYy5wRGlzdGFuY2UodGhpcy5ub2RlLnBvc2l0aW9uLCBwbGF5ZXJQb3MpO1xuICAgICAgICByZXR1cm4gZGlzdDtcbiAgICB9LFxuXG4gICAgb25QaWNrZWQ6IGZ1bmN0aW9uIG9uUGlja2VkKCkge1xuICAgICAgICAvLyDlvZPmmJ/mmJ/ooqvmlLbpm4bml7bvvIzosIPnlKggR2FtZSDohJrmnKzkuK3nmoTmjqXlj6PvvIznlJ/miJDkuIDkuKrmlrDnmoTmmJ/mmJ9cbiAgICAgICAgdGhpcy5nYW1lLnNwYXduTmV3U3RhcigpO1xuICAgICAgICAvLyDnhLblkI7plIDmr4HlvZPliY3mmJ/mmJ/oioLngrlcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgLy8g5q+P5bin5Yik5pat5ZKM5Li76KeS5LmL6Ze055qE6Led56a75piv5ZCm5bCP5LqO5pS26ZuG6Led56a7XG4gICAgICAgIGlmICh0aGlzLmdldFBsYXllckRpc3RhbmNlKCkgPCB0aGlzLnBpY2tSYWRpdXMpIHtcbiAgICAgICAgICAgIC8vIOiwg+eUqOaUtumbhuihjOS4ulxuICAgICAgICAgICAgdGhpcy5vblBpY2tlZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnNTAyYjJSRXovZEFONVVzZjRLbmlyemInLCAnR2FtZScpO1xuLy8gc2NyaXB0XFxHYW1lLmpzXG5cbid1c2Ugc3RyaWN0JztcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyDov5nkuKrlsZ7mgKflvJXnlKjkuobmmJ/mmJ/pooTliLbotYTmupBcbiAgICAgICAgZmx5UHJlZmFiOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5pif5pif5Lqn55Sf5ZCO5raI5aSx5pe26Ze055qE6ZqP5py66IyD5Zu0XG4gICAgICAgIG1heFN0YXJEdXJhdGlvbjogMCxcbiAgICAgICAgbWluU3RhckR1cmF0aW9uOiAwLFxuICAgICAgICAvLyDlnLDpnaLoioLngrnvvIznlKjkuo7noa7lrprmmJ/mmJ/nlJ/miJDnmoTpq5jluqZcbiAgICAgICAgZ3JvdW5kOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHBsYXllciDoioLngrnvvIznlKjkuo7ojrflj5bkuLvop5LlvLnot7PnmoTpq5jluqbvvIzlkozmjqfliLbkuLvop5LooYzliqjlvIDlhbNcbiAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vIOiOt+WPluWcsOW5s+mdoueahCB5IOi9tOWdkOagh1xuICAgICAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLmdyb3VuZC55ICsgdGhpcy5ncm91bmQuaGVpZ2h0IC8gMjtcbiAgICAgICAgLy8g55Sf5oiQ5LiA5Liq5paw55qE5pif5pifXG4gICAgICAgIHRoaXMuc3Bhd25OZXdTdGFyKCk7XG4gICAgfSxcbiAgICBzcGF3bk5ld1N0YXI6IGZ1bmN0aW9uIHNwYXduTmV3U3RhcigpIHtcbiAgICAgICAgLy8g5L2/55So57uZ5a6a55qE5qih5p2/5Zyo5Zy65pmv5Lit55Sf5oiQ5LiA5Liq5paw6IqC54K5XG4gICAgICAgIHZhciBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5mbHlQcmVmYWIpO1xuICAgICAgICAvLyDlsIbmlrDlop7nmoToioLngrnmt7vliqDliLAgQ2FudmFzIOiKgueCueS4i+mdolxuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XG4gICAgICAgIC8vIOS4uuaYn+aYn+iuvue9ruS4gOS4qumaj+acuuS9jee9rlxuICAgICAgICBuZXdTdGFyLnNldFBvc2l0aW9uKHRoaXMuZ2V0TmV3U3RhclBvc2l0aW9uKCkpO1xuXG4gICAgICAgIC8vIOWwhiBHYW1lIOe7hOS7tueahOWunuS+i+S8oOWFpeaYn+aYn+e7hOS7tlxuICAgICAgICBuZXdTdGFyLmdldENvbXBvbmVudCgnRmx5JykuZ2FtZSA9IHRoaXM7XG4gICAgfSxcblxuICAgIGdldE5ld1N0YXJQb3NpdGlvbjogZnVuY3Rpb24gZ2V0TmV3U3RhclBvc2l0aW9uKCkge1xuICAgICAgICB2YXIgcmFuZFggPSAwO1xuICAgICAgICAvLyDmoLnmja7lnLDlubPpnaLkvY3nva7lkozkuLvop5Lot7Pot4Ppq5jluqbvvIzpmo/mnLrlvpfliLDkuIDkuKrmmJ/mmJ/nmoQgeSDlnZDmoIdcbiAgICAgICAgdmFyIHJhbmRZID0gdGhpcy5ncm91bmRZICsgY2MucmFuZG9tMFRvMSgpICogdGhpcy5wbGF5ZXIuZ2V0Q29tcG9uZW50KCdQbGF5ZXInKS5qdW1wSGVpZ2h0ICsgNTA7XG4gICAgICAgIC8vIOagueaNruWxj+W5leWuveW6pu+8jOmaj+acuuW+l+WIsOS4gOS4quaYn+aYnyB4IOWdkOagh1xuICAgICAgICB2YXIgbWF4WCA9IHRoaXMubm9kZS53aWR0aCAvIDI7XG4gICAgICAgIHJhbmRYID0gY2MucmFuZG9tTWludXMxVG8xKCkgKiBtYXhYO1xuICAgICAgICAvLyDov5Tlm57mmJ/mmJ/lnZDmoIdcbiAgICAgICAgcmV0dXJuIGNjLnAocmFuZFgsIHJhbmRZKTtcbiAgICB9XG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnYjBhM2JqclIwVk5vN1cyTCtNUnpUbWwnLCAnUGxheWVyJyk7XG4vLyBzY3JpcHRcXFBsYXllci5qc1xuXG5cInVzZSBzdHJpY3RcIjtcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICAvLyDkuLvop5Lot7Pot4Ppq5jluqZcbiAgICAgICAganVtcEhlaWdodDogMCxcbiAgICAgICAgLy8g5Li76KeS6Lez6LeD5oyB57ut5pe26Ze0XG4gICAgICAgIGp1bXBEdXJhdGlvbjogMCxcbiAgICAgICAgLy8g5pyA5aSn56e75Yqo6YCf5bqmXG4gICAgICAgIG1heE1vdmVTcGVlZDogMCxcbiAgICAgICAgLy8g5Yqg6YCf5bqmXG4gICAgICAgIGFjY2VsOiAwXG4gICAgfSxcblxuICAgIHNldEp1bXBBY3Rpb246IGZ1bmN0aW9uIHNldEp1bXBBY3Rpb24oKSB7XG4gICAgICAgIC8vIOi3s+i3g+S4iuWNh1xuICAgICAgICB2YXIganVtcFVwID0gY2MubW92ZUJ5KHRoaXMuanVtcER1cmF0aW9uLCBjYy5wKDAsIHRoaXMuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSk7XG4gICAgICAgIC8vIOS4i+iQvVxuICAgICAgICB2YXIganVtcERvd24gPSBjYy5tb3ZlQnkodGhpcy5qdW1wRHVyYXRpb24sIGNjLnAoMCwgLXRoaXMuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcbiAgICAgICAgLy8g5LiN5pat6YeN5aSNXG4gICAgICAgIHJldHVybiBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKGp1bXBVcCwganVtcERvd24pKTtcbiAgICB9LFxuXG4gICAgc2V0SW5wdXRDb250cm9sOiBmdW5jdGlvbiBzZXRJbnB1dENvbnRyb2woKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy8g5re75Yqg6ZSu55uY5LqL5Lu255uR5ZCsXG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcbiAgICAgICAgICAgIC8vIOacieaMiemUruaMieS4i+aXtu+8jOWIpOaWreaYr+WQpuaYr+aIkeS7rOaMh+WumueahOaWueWQkeaOp+WItumUru+8jOW5tuiuvue9ruWQkeWvueW6lOaWueWQkeWKoOmAn1xuICAgICAgICAgICAgb25LZXlQcmVzc2VkOiBmdW5jdGlvbiBvbktleVByZXNzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuYTpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8g5p2+5byA5oyJ6ZSu5pe277yM5YGc5q2i5ZCR6K+l5pa55ZCR55qE5Yqg6YCfXG4gICAgICAgICAgICBvbktleVJlbGVhc2VkOiBmdW5jdGlvbiBvbktleVJlbGVhc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY0xlZnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5kOlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBzZWxmLm5vZGUpO1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5qdW1wQWN0aW9uID0gdGhpcy5zZXRKdW1wQWN0aW9uKCk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24odGhpcy5qdW1wQWN0aW9uKTtcblxuICAgICAgICAvLyDliqDpgJ/luqbmlrnlkJHlvIDlhbNcbiAgICAgICAgdGhpcy5hY2NMZWZ0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWNjUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgLy8g5Li76KeS5b2T5YmN5rC05bmz5pa55ZCR6YCf5bqmXG4gICAgICAgIHRoaXMueFNwZWVkID0gMDtcblxuICAgICAgICAvLyDliJ3lp4vljJbplK7nm5jovpPlhaXnm5HlkKxcbiAgICAgICAgdGhpcy5zZXRJbnB1dENvbnRyb2woKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuXG4gICAgICAgIC8vIOagueaNruW9k+WJjeWKoOmAn+W6puaWueWQkeavj+W4p+abtOaWsOmAn+W6plxuICAgICAgICBpZiAodGhpcy5hY2NMZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLnhTcGVlZCAtPSB0aGlzLmFjY2VsICogZHQ7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5hY2NSaWdodCkge1xuICAgICAgICAgICAgdGhpcy54U3BlZWQgKz0gdGhpcy5hY2NlbCAqIGR0O1xuICAgICAgICB9XG4gICAgICAgIC8vIOmZkOWItuS4u+inkueahOmAn+W6puS4jeiDvei2hei/h+acgOWkp+WAvFxuICAgICAgICBpZiAoTWF0aC5hYnModGhpcy54U3BlZWQpID4gdGhpcy5tYXhNb3ZlU3BlZWQpIHtcbiAgICAgICAgICAgIC8vIGlmIHNwZWVkIHJlYWNoIGxpbWl0LCB1c2UgbWF4IHNwZWVkIHdpdGggY3VycmVudCBkaXJlY3Rpb25cbiAgICAgICAgICAgIHRoaXMueFNwZWVkID0gdGhpcy5tYXhNb3ZlU3BlZWQgKiB0aGlzLnhTcGVlZCAvIE1hdGguYWJzKHRoaXMueFNwZWVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOagueaNruW9k+WJjemAn+W6puabtOaWsOS4u+inkueahOS9jee9rlxuICAgICAgICB0aGlzLm5vZGUueCArPSB0aGlzLnhTcGVlZCAqIGR0O1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiXX0=
