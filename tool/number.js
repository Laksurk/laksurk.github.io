function qpow(n, k, p) {
    let ans = 1n;
    for(; k > 0n; k >>= 1n) {
        if(k & 1n) ans = ans * n % p;
        n = n * n % p;
    }
    return ans;
}
function __builtin_ctz(n) {
    for(let r = 0; ; ++r) {
        if(n & 1n) return [r, n];
        n >>= 1n;
    }
}
function abs(n) { return n >= 0n ? n : -n; }
function __gcd(m, n) {
    while (n != 0n) {
        let t = m % n;
        m = n;
        n = t;
    }
    return m;
}
// Precondition: m, n are natural numbers
function __exgcd(m, n) {
    if(n == 0n) return [1n, 0n, m];
    const[x, y, g] = __exgcd(n, m % n);
    return [y, x - m / n * y, g];
}
// Precondition: m, n, c are integers
// Return: [x, y], x is the minimum natural solution (-1 if no solutions)
function exgcd(m, n, c) {
    let[x, y, g] = __exgcd(abs(m), abs(n));
    if(c % g != 0n) return [-1, 0];
    if(m < 0n) x = -x;
    if(n < 0n) y = -y;
    x *= c / g;
    y *= c / g;
    // const k = (-x) / (n / g);// + (x < 0n ? 1n : 0n);
    x = (x % (n / g) + (n / g)) % (n / g);
    return [x, (c - x * m) / n];
}
// Precondition: m, n are integers
function inv(m, n) { return exgcd(m, n, 1n)[0]; }
// random integer in [0, 2^16)
var rand16 = function() {
    var r = 1n;
    return function() {
        r *= 1103515245n;
        r += 12345n;
        r >>= 16n;
        r &= 65535n;
        return r;
    };
}();
// random integer in [0, 2^80)
function rand80() {
    let ans = 0n;
    for(let i = 5; i--;) {
        ans <<= 16n;
        ans |= rand16();
    }
    return ans;
}
// random integer in [l, r)
function rand(l, r) { return rand80() % (r - l) + l; }
// Precondition: n is a natural number, 2 <= n <= 2^64
function MillerRabin(n) {
    function check(base, n, d, r) {
        if(base % n == 0n) return true;
        let a = qpow(base, d, n);
        if(a == 1n || a == n - 1n) return true;
        while(--r) {
            a = a * a % n;
            if(a == n - 1n) return true;
            if(a == 1n) return false;
        }
        return false;
    }
    if(n == 2n) return true;
    if((n & 1n) == 0n) return false;
    const[r, d] = __builtin_ctz(n - 1n);
    for(const base of [2n, 325n, 9375n, 28178n, 450775n, 9780504n, 1795265022n])
        if(!check(base, n, d, r)) return false;
    return true;
}
// Precondition: n is a composite number, 4 <= n <= 2^64
function PollardRho(n) {
    if(n == 4n) return 2n;
    while(true) {
        const next = function(){
            const c = rand(1n, n);
            return function(x) { return (x * x + c) % n; };
        }();
        let p = 0n, q = 0n, prod = 1n;
        for(let cnt = 0; ;++cnt) {
            p = next(p); q = next(next(q));
            const x = prod * abs(p - q) % n;
            if(p == q || x == 0 || cnt == 64) {
                const d = __gcd(prod, n);
                if(d > 1) return d;
                else if(cnt < 64) break;
                cnt = -1;
            }
            prod = x;
        }
    }
}
// Precondition: n is a natural number, 2 <= n <= 2^64
function Factorize(n) {
    let l = [n], ans = [];
    while(l.length > 0) {
        const n = l.pop();
        if(MillerRabin(n)) { ans.push(n); continue; }
        const d = PollardRho(n);
        l.push(d);
        l.push(n / d);
    }
    return ans.sort(function(x, y){ return x == y ? 0 : x > y ? -1 : +1 });
}