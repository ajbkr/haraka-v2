const ROUNDS = 5
const AES_ROUNDS = 2

// AES S-box
const S = [
  [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76],
  [0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0],
  [0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15],
  [0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75],
  [0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84],
  [0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf],
  [0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8],
  [0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2],
  [0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73],
  [0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb],
  [0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79],
  [0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08],
  [0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a],
  [0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e],
  [0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf],
  [0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16]
]

// round constants
const RC = [
  BigInt('0x0684704ce620c00ab2c5fef075817b9d'),
  BigInt('0x8b66b4e188f3a06b640f6ba42f08f717'),
  BigInt('0x3402de2d53f28498cf029d609f029114'),
  BigInt('0x0ed6eae62e7b4f08bbf3bcaffd5b4f79'),
  BigInt('0xcbcfb0cb4872448b79eecd1cbe397044'),
  BigInt('0x7eeacdee6e9032b78d5335ed2b8a057b'),
  BigInt('0x67c28f435e2e7cd0e2412761da4fef1b'),
  BigInt('0x2924d9b0afcacc07675ffde21fc70b3b'),
  BigInt('0xab4d63f1e6867fe9ecdb8fcab9d465ee'),
  BigInt('0x1c30bf84d4b7cd645b2a404fad037e33'),
  BigInt('0xb2cc0bb9941723bf69028b2e8df69800'),
  BigInt('0xfa0478a6de6f55724aaa9ec85c9d2d8a'),
  BigInt('0xdfb49f2b6b772a120efa4f2e29129fd4'),
  BigInt('0x1ea10344f449a23632d611aebb6a12ee'),
  BigInt('0xaf0449884b0500845f9600c99ca8eca6'),
  BigInt('0x21025ed89d199c4f78a2c7e327e593ec'),
  BigInt('0xbf3aaaf8a759c9b7b9282ecd82d40173'),
  BigInt('0x6260700d6186b01737f2efd910307d6b'),
  BigInt('0x5aca45c22130044381c29153f6fc9ac6'),
  BigInt('0x9223973c226b68bb2caf92e836d1943a'),
  BigInt('0xd3bf9238225886eb6cbab958e51071b4'),
  BigInt('0xdb863ce5aef0c677933dfddd24e1128d'),
  BigInt('0xbb606268ffeba09c83e48de3cb2212b1'),
  BigInt('0x734bd3dce2e4d19c2db91a4ec72bf77d'),
  BigInt('0x43bb47c361301b434b1415c42cb3924e'),
  BigInt('0xdba775a8e707eff603b231dd16eb6899'),
  BigInt('0x6df3614b3c7559778e5e23027eca472c'),
  BigInt('0xcda75a17d6de7d776d1be5b9b88617f9'),
  BigInt('0xec6b43f06ba8e9aa9d6c069da946ee5d'),
  BigInt('0xcb1e6950f957332ba25311593bf327c1'),
  BigInt('0x2cee0c7500da619ce4ed0353600ed0d9'),
  BigInt('0xf0b1a5a196e90cab80bbbabc63a4a350'),
  BigInt('0xae3db1025e962988ab0dde30938dca39'),
  BigInt('0x17bb8f38d554a40b8814f3a82e75b442'),
  BigInt('0x34bb8a5b5f427fd7aeb6b779360a16f6'),
  BigInt('0x26f65241cbe5543843ce5918ffbaafde'),
  BigInt('0x4ce99a54b9f3026aa2ca9cf7839ec978'),
  BigInt('0xae51a51a1bdff7be40c06e2822901235'),
  BigInt('0xa0c1613cba7ed22bc173bc0f48a659cf'),
  BigInt('0x756acc03022882884ad6bdfde9c59da1')
]

/**
 * Get padded hex for single byte
 */
function hexbyte (x) {
  const s = x.toString(16)

  return s.length === 1 ? `0${s}` : s
}

/**
 * Print list of bytes in hex
 */
function ps (s) {
  return s.map(x => hexbyte(x)).join(' ')
}

/**
 * Print state
 */
function printstate (s) {
  let q

  for (let i = 0; i < 4; ++i) {
    if (s.length === 4) {
      q = [
        s[0][i], s[0][i + 4], s[0][i + 8], s[0][i + 12],
        s[1][i], s[1][i + 4], s[1][i + 8], s[1][i + 12],
        s[2][i], s[2][i + 4], s[2][i + 8], s[2][i + 12],
        s[3][i], s[3][i + 4], s[3][i + 8], s[3][i + 12]
      ]
    } else {
      q = [
        s[0][i], s[0][i + 4], s[0][i + 8], s[0][i + 12],
        s[1][i], s[1][i + 4], s[1][i + 8], s[1][i + 12]
      ]
    }
    print(ps(q))
  }
  print()
}

/**
 * Multiply by 2 over GF(2^128)
 */
function xtime (x) {
  if (x >> 7) {
    return ((x << 1) ^ 0x1b) & 0xff
  } else {
    return (x << 1) & 0xff
  }
}

/**
 * XOR two lists element-wise
 */
function xor (x, y) {
  const v = []

  for (let i = 0; i < 16; ++i) {
    v[i] = x[i] ^ y[i]
  }
  return v
}

/**
 * Apply a single S-box
 */
function sbox (x) {
  return S[x >> 4][x & 0x0f]
}

/**
 * AES SubBytes
 */
function subbytes (s) {
  return s.map(x => sbox(x))
}

/**
 * AES ShiftRows
 */
function shiftrows (s) {
  return [
    /* eslint-disable computed-property-spacing */
    s[ 0], s[ 5], s[10], s[15],
    s[ 4], s[ 9], s[14], s[ 3],
    s[ 8], s[13], s[ 2], s[ 7],
    s[12], s[ 1], s[ 6], s[11]
    /* eslint-enable computed-property-spacing */
  ]
}

/**
 * AES MixColumns
 */
function mixcolumns (s) {
  const v = []
  for (let i = 0; i < 4; ++i) {
    v[i] = []
    /* eslint-disable computed-property-spacing, no-multi-spaces, space-in-parens */
    v[i].push(xtime(s[4 * i]) ^ xtime(s[4 * i + 1]) ^       s[4 * i + 1]  ^       s[4 * i + 2]  ^       s[4 * i + 3])
    v[i].push(      s[4 * i]  ^ xtime(s[4 * i + 1]) ^ xtime(s[4 * i + 2]) ^       s[4 * i + 2]  ^       s[4 * i + 3])
    v[i].push(      s[4 * i]  ^       s[4 * i + 1]  ^ xtime(s[4 * i + 2]) ^ xtime(s[4 * i + 3]) ^       s[4 * i + 3])
    v[i].push(xtime(s[4 * i]) ^       s[4 * i    ]  ^       s[4 * i + 1]  ^       s[4 * i + 2]  ^ xtime(s[4 * i + 3]))
    /* eslint-enable computed-property-spacing, no-multi-spaces, space-in-parens */
  }
  return [
    ...v[0],
    ...v[1],
    ...v[2],
    ...v[3]
  ]
}

/**
 * AES single regular round
 */
function aesenc (s, rk) {
  s = subbytes(s)
  s = shiftrows(s)
  s = mixcolumns(s)
  const rkr = [] // rk reversed
  for (let i = rk.length - 1; i >= 0; --i) {
    rkr.push(rk[i])
  }
  s = xor(s, rkr)
  return s
}

/**
 * Linear mixing for Haraka-512/256
 */
function mix512 (s) {
  return [
    [
      /* eslint-disable computed-property-spacing */
      s[0][12], s[0][13], s[0][14], s[0][15],
      s[2][12], s[2][13], s[2][14], s[2][15],
      s[1][12], s[1][13], s[1][14], s[1][15],
      s[3][12], s[3][13], s[3][14], s[3][15]
    ],
    [
      s[2][ 0], s[2][ 1], s[2][ 2], s[2][ 3],
      s[0][ 0], s[0][ 1], s[0][ 2], s[0][ 3],
      s[3][ 0], s[3][ 1], s[3][ 2], s[3][ 3],
      s[1][ 0], s[1][ 1], s[1][ 2], s[1][ 3]
    ],
    [
      s[2][ 4], s[2][ 5], s[2][ 6], s[2][ 7],
      s[0][ 4], s[0][ 5], s[0][ 6], s[0][ 7],
      s[3][ 4], s[3][ 5], s[3][ 6], s[3][ 7],
      s[1][ 4], s[1][ 5], s[1][ 6], s[1][ 7]
    ],
    [
      s[0][ 8], s[0][ 9], s[0][10], s[0][11],
      s[2][ 8], s[2][ 9], s[2][10], s[2][11],
      s[1][ 8], s[1][ 9], s[1][10], s[1][11],
      s[3][ 8], s[3][ 9], s[3][10], s[3][11]
      /* eslint-enable computed-property-spacing */
    ]
  ]
}

/**
 * Linear mixing for Haraka-256/256
 */
function mix256 (s) {
  return [
    [
      /* eslint-disable computed-property-spacing */
      s[0][ 0], s[0][ 1], s[0][ 2], s[0][ 3],
      s[1][ 0], s[1][ 1], s[1][ 2], s[1][ 3],
      s[0][ 4], s[0][ 5], s[0][ 6], s[0][ 7],
      s[1][ 4], s[1][ 5], s[1][ 6], s[1][ 7]
    ],
    [
      s[0][ 8], s[0][ 9], s[0][10], s[0][11],
      s[1][ 8], s[1][ 9], s[1][10], s[1][11],
      s[0][12], s[0][13], s[0][14], s[0][15],
      s[1][12], s[1][13], s[1][14], s[1][15]
      /* eslint-enable computed-property-spacing */
    ]
  ]
}

/**
 * Convert RC (round constants) to 16 words state
 */
function convRC (rc) {
  let rcstr = rc.toString(16)
  while (rcstr.length < 32) {
    rcstr = `0${rcstr}`
  }

  // In Python, previously:
  //   rcstr = hex(rc)[2:-1].zfill(32)
  //
  // However, following https://github.com/kste/haraka/issues/1
  // this JS code is now the equivalent of:
  //   rcstr = hex(rc)[2:].zfill(32)
  const v = []
  for (let i = 0; i < 32; i += 2) {
    v.push(parseInt(rcstr.substring(i, i + 2), 16))
  }
  return v
}

/**
 * Haraka-512/256
 */
function haraka512256 (msg) {
  // obtain state from msg input
  let s = [
    [
      /* eslint-disable computed-property-spacing */
      msg[ 0], msg[ 1], msg[ 2], msg[ 3],
      msg[ 4], msg[ 5], msg[ 6], msg[ 7],
      msg[ 8], msg[ 9], msg[10], msg[11],
      msg[12], msg[13], msg[14], msg[15]
    ],
    [
      msg[16], msg[17], msg[18], msg[19],
      msg[20], msg[21], msg[22], msg[23],
      msg[24], msg[25], msg[26], msg[27],
      msg[28], msg[29], msg[30], msg[31]
    ],
    [
      msg[32], msg[33], msg[34], msg[35],
      msg[36], msg[37], msg[38], msg[39],
      msg[40], msg[41], msg[42], msg[43],
      msg[44], msg[45], msg[46], msg[47]
    ],
    [
      msg[48], msg[49], msg[50], msg[51],
      msg[52], msg[53], msg[54], msg[55],
      msg[56], msg[57], msg[58], msg[59],
      msg[60], msg[61], msg[62], msg[63]
      /* eslint-enable computed-property-spacing */
    ]
  ]

  print('= input state =')
  printstate(s)

  // apply round functions
  for (let t = 0; t < ROUNDS; ++t) {
    // first we do AES_ROUNDS of AES rounds
    for (let m = 0; m < AES_ROUNDS; ++m) {
      for (let i = 0; i < 4; ++i) {
        s[i] = aesenc(s[i], convRC(RC[4 * t * AES_ROUNDS + 4 * m + i]))
      }
    }

    print(`= round ${t} : after aes layer =`)
    printstate(s)

    // now apply mixing
    s = mix512(s)

    print(`= round ${t} : after mix layer =`)
    printstate(s)
  }

  print('= output from permutation =')
  printstate(s)

  // apply feed-forward
  for (let i = 0; i < 4; ++i) {
    s[i] = xor(
      s[i],
      [
        /* eslint-disable no-multi-spaces */
        msg[16 * i +  0],
        msg[16 * i +  1],
        msg[16 * i +  2],
        msg[16 * i +  3],
        msg[16 * i +  4],
        msg[16 * i +  5],
        msg[16 * i +  6],
        msg[16 * i +  7],
        msg[16 * i +  8],
        msg[16 * i +  9],
        msg[16 * i + 10],
        msg[16 * i + 11],
        msg[16 * i + 12],
        msg[16 * i + 13],
        msg[16 * i + 14],
        msg[16 * i + 15]
        /* eslint-enable no-multi-spaces */
      ]
    )
  }

  print('= after feed-forward =')
  printstate(s)

  // truncation
  return [
    /* eslint-disable computed-property-spacing */
    s[0][8], s[0][9], s[0][10], s[0][11], s[0][12], s[0][13], s[0][14], s[0][15],
    s[1][8], s[1][9], s[1][10], s[1][11], s[1][12], s[1][13], s[1][14], s[1][15],
    s[2][0], s[2][1], s[2][ 2], s[2][ 3], s[2][ 4], s[2][ 5], s[2][ 6], s[2][ 7],
    s[3][0], s[3][1], s[3][ 2], s[3][ 3], s[3][ 4], s[3][ 5], s[3][ 6], s[3][ 7]
    /* eslint-enable computed-property-spacing */
  ]
}

/**
 * Haraka-256/256
 */
function haraka256256 (msg) {
  // obtain state from msg input
  let s = [
    [
      /* eslint-disable computed-property-spacing */
      msg[ 0], msg[ 1], msg[ 2], msg[ 3],
      msg[ 4], msg[ 5], msg[ 6], msg[ 7],
      msg[ 8], msg[ 9], msg[10], msg[11],
      msg[12], msg[13], msg[14], msg[15]
    ],
    [
      msg[16], msg[17], msg[18], msg[19],
      msg[20], msg[21], msg[22], msg[23],
      msg[24], msg[25], msg[26], msg[27],
      msg[28], msg[29], msg[30], msg[31]
      /* eslint-enable computed-property-spacing */
    ]
  ]

  print('= input state =')
  printstate(s)

  // apply round functions
  for (let t = 0; t < ROUNDS; ++t) {
    // first we do AES_ROUNDS of AES rounds
    for (let m = 0; m < AES_ROUNDS; ++m) {
      for (let i = 0; i < 2; ++i) {
        s[i] = aesenc(s[i], convRC(RC[2 * t * AES_ROUNDS + 2 * m + i]))
      }
    }

    print(`= round ${t} : after aes layer =`)
    printstate(s)

    // now apply mixing
    s = mix256(s)

    print(`= round ${t} : after mix layer =`)
    printstate(s)
  }

  print('= output from permutation =')
  printstate(s)

  // apply feed-forward
  for (let i = 0; i < 2; ++i) {
    s[i] = xor(
      s[i],
      [
        /* eslint-disable no-multi-spaces */
        msg[16 * i +  0],
        msg[16 * i +  1],
        msg[16 * i +  2],
        msg[16 * i +  3],
        msg[16 * i +  4],
        msg[16 * i +  5],
        msg[16 * i +  6],
        msg[16 * i +  7],
        msg[16 * i +  8],
        msg[16 * i +  9],
        msg[16 * i + 10],
        msg[16 * i + 11],
        msg[16 * i + 12],
        msg[16 * i + 13],
        msg[16 * i + 14],
        msg[16 * i + 15]
        /* eslint-enable no-multi-spaces */
      ]
    )
  }

  print('= after feed-forward =')
  printstate(s)

  // truncation
  return [
    /* eslint-disable computed-property-spacing */
    s[0][0], s[0][1], s[0][ 2], s[0][ 3], s[0][ 4], s[0][ 5], s[0][ 6], s[0][ 7],
    s[0][8], s[0][9], s[0][10], s[0][11], s[0][12], s[0][13], s[0][14], s[0][15],
    s[1][0], s[1][1], s[1][ 2], s[1][ 3], s[1][ 4], s[1][ 5], s[1][ 6], s[1][ 7],
    s[1][8], s[1][9], s[1][10], s[1][11], s[1][12], s[1][13], s[1][14], s[1][15]
    /* eslint-enable computed-property-spacing */
  ]
}

/**
 * Python print()-like function
 */
function print (msg = '') {
  process.stdout.write(`${msg}\n`)
}

/**
 * Program entry point
 */
function main () {
  // set some message bytes
  const m = []
  for (let i = 0; i < 64; ++i) {
    m[i] = i
  }

  // print input
  print('= input bytes =')
  print(ps(m))
  print()

  // call Haraka-512/256
  let digest = haraka512256(m)

  // print digest
  print('= haraka-512/256 output bytes =')
  print(ps(digest))
  print()

  // call Haraka-256/256
  digest = haraka256256(m)

  // print digest
  print('= haraka-256/256 output bytes =')
  print(ps(digest))
  print()

  return 0
}

process.exit(main())
