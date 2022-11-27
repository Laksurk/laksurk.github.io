// Precondition: n is a natural number, 2 <= n <= 2^64
function MillerRabin(n) {
    function qpow(n, k, p) {
        var ans = 1n;
        for(; k > 0n; k >>= 1n) {
            if(k & 1n) ans = ans * n % p;
            n = n * n % p;
        }
        return ans;
    }
    function check(base, n, d, r) {
        if(base % n == 0n) return true;
        var a = qpow(base, d, n);
        if(a == 1n || a == n - 1n) return true;
        while(--r) {
            a = a * a % n;
            if(a == n - 1n) return true;
            if(a == 1n) return false;
        }
        return false;
    }
    function __builtin_ctz(n) {
        for(var r = 0; ; ++r) {
            if(n & 1n) return [r, n];
            n >>= 1n;
        }
    }
    if(n == 2n) return true;
    if(n <= 1n || (n & 1n) == 0n) return false;
    const[r, d] = __builtin_ctz(n - 1n);
    for(const base of [2n, 325n, 9375n, 28178n, 450775n, 9780504n, 1795265022n])
        if(!check(base, n, d, r)) return false;
    return true;
}