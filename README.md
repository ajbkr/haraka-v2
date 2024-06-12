Haraka v2
=========

A JavaScript (Node.js) implementation of the two Haraka v2 variants of
cryptographic hash function--Haraka-512 v2 and Haraka-256 v2.

This implementation is heavily influenced by the two reference implementations
written (some time ago) in C and Python. They are available at
[https://github.com/kste/haraka](https://github.com/kste/haraka).

The source code should be read in conjunction with the original
[Haraka v2 -- Efficient Short-Input Hashing for Post-Quantum Applications](https://eprint.iacr.org/2016/098.pdf)
paper.

Verus
-----

Haraka v2 is the cryptographic hash function used by cryptocurrency mining
software to secure transactions on the [Verus](https://verus.io/) network.

NOTE: This implementation is not built for performance; its primary aim is one
of readability, hopefully providing a suitable jumping-off point for further
exploration.
