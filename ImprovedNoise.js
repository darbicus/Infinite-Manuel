function ImprovedNoise(seed) {
    this.p = [512];
    this.shuffle(seed);

}

ImprovedNoise.prototype = {
    shuffle: function () {

        var permutation = [256],
            i, j, tmp;
        for (i = 0; i < 256; i += 1) {
            permutation[i] = i;
        }

        for (i = 0; i < 256; i += 1) {
            j = ((Math.random() * (256 - i)) | 0) + i;
            tmp = permutation[i];
            permutation[i] = permutation[j];
            permutation[j] = tmp;
            this.p[i + 256] = this.p[i] = permutation[i];
        }
    },
    fade: function (t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    },
    lerp: function (t, a, b) {
        return a + t * (b - a);
    },
    grad: function (hash, x, y, z) {
        var h = (hash & 15) | 0,
            u = h < 8 ? x : y, // INTO 12 GRADIENT DIRECTIONS.
            v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    },
    noise: function (x, y, z) {

        var X = (x | 0 & 255) | 0,
            Y = (y | 0 & 255) | 0,
            Z = (z | 0 & 255) | 0;
        x -= x | 0; // FIND RELATIVE X,Y,Z
        y -= y | 0; // OF POINT IN CUBE.
        z -= z | 0;
        var u = this.fade(x),
            A = this.p[X] + Y,
            AA = this.p[A] + Z,
            AB = this.p[A + 1] + Z,
            B = this.p[X + 1] + Y,
            BA = this.p[B] + Z,
            BB = this.p[B + 1] + Z,
            v = this.fade(y),
            w = this.fade(z);



        A = A | 0; //garantir int

        B = B | 0; //garantir int

        return ((this.lerp(w, this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y, z), // AND ADD
                    this.grad(this.p[BA], x - 1, y, z)), // BLENDED
                this.lerp(u, this.grad(this.p[AB], x, y - 1, z), // RESULTS
                    this.grad(this.p[BB], x - 1, y - 1, z))), // FROM  8
            this.lerp(v, this.lerp(u, this.grad(this.p[AA + 1], x, y, z - 1), // CORNERS
                    this.grad(this.p[BA + 1], x - 1, y, z - 1)), // OF CUBE
                this.lerp(u, this.grad(this.p[AB + 1], x, y - 1, z - 1), this.grad(this.p[BB + 1], x - 1, y - 1, z - 1))))) + 1) / 2;
    },
    perlinNoise: function (x, y) {
        var n = 0.0,
            i, stepSize;

        for (i = 0; i < 8; i += 1) {
            stepSize = 64.0 / ((1 << i));
            n += this.noise(x / stepSize, y / stepSize, 128) / (1 << i);
        }

        return n;
    }
};
