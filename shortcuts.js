var shortcut = (function() {
    var config = {
        'delay': 1000,
    }
    var arr  = [];
    var objs = [];
    var keys = {
                "0" : 48, "1" : 49, "2" : 50, "3" : 51, "4" : 52, "5" : 53, "6" : 54, "7" : 55, "8" : 56,
                "9" : 57, "A" : 65, "B" : 66, "C" : 67, "D" : 68, "E" : 69, "F" : 70, "G" : 71, "H" : 72,
                "I" : 73, "J" : 74, "K" : 75, "L" : 76, "M" : 77, "N" : 78, "O" : 79, "P" : 80, "Q" : 81,
                "R" : 82, "S" : 83, "T" : 84, "U" : 85, "V" : 86, "W" : 87, "X" : 88, "Y" : 89, "Z" : 90,
                "DOWN" : 40, "LEFT" : 37, "UP"   : 38, "RIGHT": 39,"CTRL" : 17
            };

    function handle(e) {
        objs.push(e);
        arr.forEach(function(x, key){
            var status = true;
            var cont = (objs.length - 1) - (x.key.length -1);
            var j = 0;
            if(cont >= 0){
                for(var i = cont; i <= objs.length - 1;i++){
                    var e = objs[i];
                    var keyCode = x.keys[j];
                    if(e.which == keyCode && x.ctrl == e.ctrlKey && x.shift == e.shiftKey && x.alt == e.altKey){
                        status = true;
                    }else{
                        status = false;
                        break;
                    }
                    if(e.target.nodeName == 'INPUT'){
                        status = false;
                        break;
                    }
                    j++;
                }
            }else{
                status = false;
            }
            if(status){
                objs = [];
                x.callBack.call();
            }
            if(x.key.length > 1){
                setTimeout(function(){
                    objs = [];
                }, config.delay);
            }
        });
    }

    function setShortCut(shortcut, func){
        var aux = {};
        var ctrl  = false;
        var shift = false;
        var alt   = false;

        aux.callBack = func;
        aux.key = [];
        aux.keys = [];

        shortcut = shortcut.trim();
        shortcut = shortcut.split('+');
        shortcut.forEach(function(x, key){
            x = x.toUpperCase();
            if(x == 'CTRL' && key == 0)
                ctrl = true;

            if(x == 'ALT' && key == 0)
                alt = true;

            if(x == 'SHIFT' && key == 0)
                shift = true;

            if((key > 0 &&  keys[x]) || (x !== 'CTRL' && x !== 'ALT' && x !== 'SHIFT')){
                aux.key.push(x);
                aux.keys.push(keys[x]);
            }else if(!keys[x] && key > 0)
                throw('Error, invalid caracter');

            aux.ctrl  = ctrl;
            aux.alt   = alt;
            aux.shift = shift;
        });
        arr.push(aux);
    }

    return {
        'on' : function () {
            if(arguments.length == 1 && (typeof(arguments[0]) == 'object' && !Array.isArray(arguments[0]))){
                var list = arguments[0];
                var nkeys = Object.keys(arguments[0]);
                nkeys.forEach(function(key){
                    setShortCut(key, list[key]);
                });
                return true;
            }

            if(arguments.length == 2){
                setShortCut(arguments[0], arguments[1]);
                return true;
            }
            throw('Error, invalid number of parameters');
        },

        'start': function() {
            document.addEventListener('keydown', handle);
        },

        'config': function(){
            if(arguments.length == 1 && (typeof(arguments[0]) == 'object' && !Array.isArray(arguments[0])))
                config = arguments[0];
            else
                return config;
        }
    };
})();

document.addEventListener('DOMContentLoaded', shortcut.start);

