const ctx = document.getElementById("canvas").getContext("2d");
const base_mass = 10000000;
const G = 0.01;
const drawable_pool = [];

let decay = 0.4;

function Collision(obj1, ground = true) {
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
  constructor(r, g, b, hex = false) {
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
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  constructor(ctx, x, y, w, h, fs, mass, custom_callback) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
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

const rect1 = new Rectangle(
  ctx,
  400,
  100,
  10,
  10,
  new FillStyle(0, 0, 255),
  10,
  async (r) => {
    Collision(r);

    r.ctx.fillStyle = "#fff";
    r.ctx.fillRect(r.x - 2, r.y - 2, r.w + 2, r.h + 2);

    // r.fs.r = (r.y / 500) * 255 - decay;
    // r.fs.b = ((500 - r.y) / 500) * 255 - decay;
    // r.fs.g = (1 / (r.fs.b + r.fs.r)) * 255 - decay;

    r.velocity.x += r.accl.x;
    r.velocity.y += r.accl.y;

    r.x += r.velocity.x;
    r.y += r.velocity.y;

    const gx = -r.x + star.x,
      gy = -r.y + star.y;

    const d = Math.sqrt(gx * gx + gy * gy);

    const gf = (r.mass * star.mass * G) / (d * d);

    r.accl = new Vector((gf * gx) / 100, (gf * gy) / 100);
  }
);

const star = new Rectangle(
  ctx,
  200,
  200,
  100,
  100,
  new FillStyle(0, 0, 255),
  1000,
  async (r) => {}
);

// rect1.velocity = new Vector(0.3, 0.1);

async function main() {
  for (const obj of drawable_pool) {
    await obj.draw();
  }
  setTimeout(main, 1000 / 60);
}

main();

setTimeout(() => (decay *= 2), 1000);
