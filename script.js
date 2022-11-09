var canvas = document.getElementById("myCanvas"),
    context = canvas.getContext("2d");



var el = { rot: 0, ar: [] }
var objP = []
var ke = true
var ControlLeft = false
var mousemove

document.addEventListener('keydown', (e) => {
    if (e.code == 'ControlLeft') {
        ControlLeft = true;
    }
})
document.addEventListener('keyup', (e) => {
    if (e.code == 'ControlLeft') {
        ControlLeft = false
        if (el.ar.length > 2) {
            objP.push(el)
        }
        el = { rot: 0, ar: [] }
    }
})
document.addEventListener('mousedown', (e) => {
    if (!ControlLeft) {
        for (let i = 0; i < objP.length; i++) {
            if (checPoss(objP[i], { x: e.pageX, y: e.pageY })) {
                mousemove = { i: i, x: e.pageX, y: e.pageY }

            }
        }
    }
})
document.addEventListener('mousemove', (e) => {

    if (mousemove) {

        drow(objP[mousemove.i], 5, "rgba(255, 255, 255, 1)")
        for (let l = 0; l < objP[mousemove.i].ar.length; l++) {
            objP[mousemove.i].ar[l].x -= mousemove.x - e.pageX
            objP[mousemove.i].ar[l].y -= mousemove.y - e.pageY
        }
        if (collisions(mousemove.i)) {
            for (let l = 0; l < objP[mousemove.i].ar.length; l++) {
                objP[mousemove.i].ar[l].x += mousemove.x - e.pageX
                objP[mousemove.i].ar[l].y += mousemove.y - e.pageY
            }
        }
        mousemove.x = e.pageX
        mousemove.y = e.pageY

        drow(objP[mousemove.i], 1, "red")
    }
})
document.addEventListener('mouseup', (e) => {
    mousemove = undefined;
})
canvas.addEventListener('click', (e) => {
    if (ControlLeft) {
        try { drow(el, 5, "rgba(255, 255, 255, 1)") } catch { }
        el.ar.push({ x: e.pageX, y: e.pageY })
        drow(el, 1, "red")
    }
})
function drow(ob, lineW, strokeS) {
    context.strokeStyle = strokeS;
    context.lineWidth = lineW;

    context.beginPath();
    context.moveTo(ob.ar[0].x, ob.ar[0].y);
    for (let i = 1; i < ob.ar.length; i++) {
        context.lineTo(ob.ar[i].x, ob.ar[i].y);
    }
    context.closePath();
    context.stroke();
}
function collisions(index) {
    for (let i = 0; i < objP.length; i++) {
        if (i == index) { continue }
        for (let l = 0; l < objP[index].ar.length; l++) {
            if (checPoss(objP[i], objP[index].ar[l])) {
                return true
            }
        }
        for (let l = 0; l < objP[i].ar.length; l++) {
            if (checPoss(objP[index], objP[i].ar[l])) {
                return true
            }
        }
    } return false;
}
function checPoss(ob, point) {

    for (let i = 2; i < ob.ar.length; i++) {

        if (square(ob.ar[0], ob.ar[i - 1], ob.ar[i], point)) {

            return true;
        }
    } return false;
}
function square(a, b, c, d) {
    var ad = pl(a, b, c) - (pl(a, b, d) + pl(a, d, c) + pl(d, b, c))
    return -0.00000001 < ad && ad < 0.00000001
}
function pl(a, b, c) {
    var abl = len(a, b)
    var acl = len(a, c)
    var bcl = len(b, c)
    var p = (abl + acl + bcl) / 2
    return (p * (p - abl) * (p - acl) * (p - bcl)) ** 0.5
}
function len(a, b) {
    return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** 0.5
}
