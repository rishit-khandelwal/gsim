const ctx = document.getElementById("canvas").getContext("2d");
const drawable_pool = [];
let decay = 0.4;
const random_air_resitance = (obj)=>{
    obj.velocity.x += obj.y / 200000 * (Math.random() - 0.5) * 30;
};
function Collision(obj1, ground = true) {
    random_air_resitance(obj1);
    if (ground && obj1.y >= 500) {
        obj1.velocity.y = obj1.velocity.y * -1;
        obj1.y = 500;
    }
    if (obj1.y <= 0) {
        obj1.velocity.y = obj1.velocity.y * -1;
    }
    if (ground && (obj1.x >= 500 || obj1.x <= 0)) {
        obj1.velocity.x = -obj1.velocity.x;
    }
}
class FillStyle {
    constructor(r, g, b, hex = false){
        if (hex) {
            this.clr = `#${r}${g}${b}`;
        } else {
            this.r = r;
            this.g = g;
            this.b = b;
        }
    }
    color() {
        return `rgb(${this.r},${this.g},${this.b})`;
    }
}
class Vector {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
class Rectangle {
    constructor(ctx1, x1, y1, w, h, fs, mass, custom_callback){
        this.ctx = ctx1;
        this.x = x1;
        this.y = y1;
        this.w = w;
        this.h = h;
        this.fs = fs;
        this.cc = custom_callback;
        this.mass = mass;
        this.velocity = new Vector(0, 0);
        this.accl = new Vector(0, 0);
        drawable_pool.push(this);
    }
    async draw() {
        this.cc(this);
        this.ctx.fillStyle = this.fs.clr || this.fs.color();
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
const rect1 = new Rectangle(ctx, 200, 200, 10, 10, new FillStyle(0, 0, 255), 10, async (r1)=>{
    Collision(r1);
    r1.fs.r = r1.y / 500 * 255 - decay;
    r1.fs.b = (500 - r1.y) / 500 * 255 - decay;
    r1.fs.g = 1 / (r1.fs.b + r1.fs.r) * 255 - decay;
    r1.velocity.x += r1.accl.x;
    r1.velocity.y += r1.accl.y;
    r1.x += r1.velocity.x;
    r1.y += r1.velocity.y;
    const gx = r1.x - star.x, gy = r1.y - star.y;
    const d = Math.sqrt(gx * gx + gy * gy);
    const gf = this.mass * star.mass * 2 / (d * d);
    r1.accl = new Vector(gf / gx, gf / gy);
});
const star = new Rectangle(ctx, 250, 250, 10, 10, new FillStyle(0, 0, 255), 1000, async (r1)=>{
});
async function main() {
    for (const obj of drawable_pool){
        await obj.draw();
    }
    setTimeout(main, 1000 / 60);
}
main();
setTimeout(()=>decay *= 2
, 1000);
