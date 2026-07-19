<template>
  <div class="min-h-screen relative overflow-hidden" :style="{ background: design.bg }">

    <!-- ── DECORACIONES SVG ── -->

    <!-- botanical -->
    <template v-if="design.decoration === 'botanical'">
      <svg class="absolute top-0 left-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" fill="none">
        <path d="M10 10 C40 50,80 30,100 80" :stroke="design.primaryDeco" stroke-width="2" opacity="0.7"/>
        <ellipse cx="35" cy="38" rx="16" ry="10" :fill="design.primaryDeco" transform="rotate(-30 35 38)" opacity="0.65"/>
        <ellipse cx="60" cy="25" rx="20" ry="11" :fill="design.secondaryDeco" transform="rotate(-60 60 25)" opacity="0.55"/>
        <ellipse cx="90" cy="48" rx="18" ry="10" :fill="design.primaryDeco" transform="rotate(15 90 48)" opacity="0.6"/>
        <ellipse cx="20" cy="65" rx="14" ry="8" :fill="design.secondaryDeco" transform="rotate(-45 20 65)" opacity="0.45"/>
        <path d="M5 5 C20 60,10 100,30 140" :stroke="design.primaryDeco" stroke-width="1.5" opacity="0.35"/>
        <ellipse cx="15" cy="90" rx="10" ry="6" :fill="design.primaryDeco" transform="rotate(-70 15 90)" opacity="0.4"/>
      </svg>
      <svg class="absolute top-0 right-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" fill="none" style="transform:scaleX(-1)">
        <path d="M10 10 C40 50,80 30,100 80" :stroke="design.primaryDeco" stroke-width="2" opacity="0.7"/>
        <ellipse cx="35" cy="38" rx="16" ry="10" :fill="design.primaryDeco" transform="rotate(-30 35 38)" opacity="0.65"/>
        <ellipse cx="60" cy="25" rx="20" ry="11" :fill="design.secondaryDeco" transform="rotate(-60 60 25)" opacity="0.55"/>
        <ellipse cx="90" cy="48" rx="18" ry="10" :fill="design.primaryDeco" transform="rotate(15 90 48)" opacity="0.6"/>
        <path d="M5 5 C20 60,10 100,30 140" :stroke="design.primaryDeco" stroke-width="1.5" opacity="0.35"/>
      </svg>
      <svg class="absolute bottom-0 left-0 w-36 h-36 pointer-events-none" viewBox="0 0 180 180" fill="none" style="transform:scaleY(-1)">
        <path d="M10 10 C40 50,80 30,100 80" :stroke="design.primaryDeco" stroke-width="2" opacity="0.45"/>
        <ellipse cx="35" cy="38" rx="16" ry="10" :fill="design.primaryDeco" transform="rotate(-30 35 38)" opacity="0.4"/>
        <ellipse cx="60" cy="25" rx="20" ry="11" :fill="design.secondaryDeco" transform="rotate(-60 60 25)" opacity="0.35"/>
      </svg>
      <svg class="absolute bottom-0 right-0 w-36 h-36 pointer-events-none" viewBox="0 0 180 180" fill="none" style="transform:scale(-1,-1)">
        <path d="M10 10 C40 50,80 30,100 80" :stroke="design.primaryDeco" stroke-width="2" opacity="0.45"/>
        <ellipse cx="35" cy="38" rx="16" ry="10" :fill="design.primaryDeco" transform="rotate(-30 35 38)" opacity="0.4"/>
        <ellipse cx="60" cy="25" rx="20" ry="11" :fill="design.secondaryDeco" transform="rotate(-60 60 25)" opacity="0.35"/>
      </svg>
    </template>

    <!-- geometric -->
    <template v-else-if="design.decoration === 'geometric'">
      <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 700" fill="none" preserveAspectRatio="xMidYMid slice">
        <rect x="12" y="12" width="376" height="676" :stroke="design.primaryDeco" stroke-width="1.2" opacity="0.5"/>
        <rect x="20" y="20" width="360" height="660" :stroke="design.primaryDeco" stroke-width="0.5" opacity="0.3"/>
        <path d="M12 80 L80 12 M 388 80 L320 12 M12 620 L80 688 M388 620 L320 688" :stroke="design.primaryDeco" stroke-width="1" opacity="0.6"/>
        <polygon points="200,12 215,30 200,48 185,30" :fill="design.primaryDeco" opacity="0.7"/>
        <polygon points="12,350 30,365 12,380 -6,365" :fill="design.primaryDeco" opacity="0.5"/>
        <polygon points="388,350 406,365 388,380 370,365" :fill="design.primaryDeco" opacity="0.5"/>
        <polygon points="200,688 215,670 200,652 185,670" :fill="design.primaryDeco" opacity="0.7"/>
        <line x1="12" y1="200" x2="12" y2="500" :stroke="design.primaryDeco" stroke-width="2" opacity="0.4"/>
        <line x1="388" y1="200" x2="388" y2="500" :stroke="design.primaryDeco" stroke-width="2" opacity="0.4"/>
      </svg>
    </template>

    <!-- confetti -->
    <template v-else-if="design.decoration === 'confetti'">
      <svg class="absolute inset-0 w-full pointer-events-none" style="height:100%;min-height:600px" viewBox="0 0 400 700" fill="none" preserveAspectRatio="xMidYMid slice">
        <circle cx="30" cy="40" r="8" :fill="design.primaryDeco" opacity="0.5"/>
        <circle cx="370" cy="60" r="6" :fill="design.secondaryDeco" opacity="0.5"/>
        <rect x="60" y="20" width="10" height="10" :fill="design.secondaryDeco" opacity="0.5" transform="rotate(30 65 25)"/>
        <rect x="330" cy="90" width="12" height="8" :fill="design.primaryDeco" opacity="0.4" transform="rotate(-20 336 94)"/>
        <circle cx="80" cy="150" r="5" :fill="design.primaryDeco" opacity="0.4"/>
        <circle cx="320" cy="130" r="7" :fill="design.secondaryDeco" opacity="0.4"/>
        <path d="M350 200 L365 208 L358 224 L343 216 Z" :fill="design.primaryDeco" opacity="0.5"/>
        <path d="M40 250 L55 242 L63 257 L48 265 Z" :fill="design.secondaryDeco" opacity="0.4"/>
        <circle cx="20" cy="350" r="6" :fill="design.primaryDeco" opacity="0.35"/>
        <circle cx="380" cy="400" r="9" :fill="design.secondaryDeco" opacity="0.35"/>
        <rect x="50" y="450" width="8" height="14" :fill="design.primaryDeco" opacity="0.35" transform="rotate(45 54 457)"/>
        <rect x="345" y="500" width="12" height="8" :fill="design.secondaryDeco" opacity="0.3" transform="rotate(-35 351 504)"/>
        <circle cx="100" cy="550" r="6" :fill="design.primaryDeco" opacity="0.3"/>
        <circle cx="300" cy="580" r="5" :fill="design.secondaryDeco" opacity="0.3"/>
        <path d="M60 620 L70 628 L62 640 L52 632 Z" :fill="design.primaryDeco" opacity="0.3"/>
      </svg>
    </template>

    <!-- rosas -->
    <template v-else-if="design.decoration === 'rosas'">
      <svg class="absolute top-0 left-0 w-52 h-52 pointer-events-none" viewBox="0 0 220 220" fill="none" opacity="0.45">
        <circle cx="80" cy="80" r="28" :fill="design.primaryDeco"/>
        <circle cx="80" cy="80" r="20" :fill="design.primaryDeco" opacity="0.8"/>
        <circle cx="80" cy="80" r="12" :fill="design.secondaryDeco"/>
        <ellipse cx="80" cy="54" rx="10" ry="17" :fill="design.primaryDeco" transform="rotate(0 80 80)" opacity="0.7"/>
        <ellipse cx="80" cy="54" rx="10" ry="17" :fill="design.primaryDeco" transform="rotate(45 80 80)" opacity="0.6"/>
        <ellipse cx="80" cy="54" rx="10" ry="17" :fill="design.primaryDeco" transform="rotate(90 80 80)" opacity="0.6"/>
        <ellipse cx="80" cy="54" rx="10" ry="17" :fill="design.primaryDeco" transform="rotate(135 80 80)" opacity="0.6"/>
        <ellipse cx="80" cy="54" rx="10" ry="17" :fill="design.primaryDeco" transform="rotate(180 80 80)" opacity="0.5"/>
        <ellipse cx="80" cy="54" rx="10" ry="17" :fill="design.primaryDeco" transform="rotate(225 80 80)" opacity="0.5"/>
        <ellipse cx="80" cy="54" rx="10" ry="17" :fill="design.primaryDeco" transform="rotate(270 80 80)" opacity="0.5"/>
        <ellipse cx="80" cy="54" rx="10" ry="17" :fill="design.primaryDeco" transform="rotate(315 80 80)" opacity="0.55"/>
        <ellipse cx="30" cy="130" rx="8" ry="18" fill="#7A9E68" transform="rotate(-30 30 130)" opacity="0.5"/>
        <ellipse cx="15" cy="80" rx="6" ry="14" fill="#7A9E68" transform="rotate(20 15 80)" opacity="0.4"/>
      </svg>
      <svg class="absolute top-0 right-0 w-44 h-44 pointer-events-none" viewBox="0 0 200 200" fill="none" opacity="0.4" style="transform:scaleX(-1)">
        <circle cx="70" cy="70" r="24" :fill="design.secondaryDeco"/>
        <circle cx="70" cy="70" r="17" :fill="design.primaryDeco" opacity="0.8"/>
        <ellipse cx="70" cy="48" rx="9" ry="15" :fill="design.primaryDeco" transform="rotate(0 70 70)" opacity="0.7"/>
        <ellipse cx="70" cy="48" rx="9" ry="15" :fill="design.primaryDeco" transform="rotate(60 70 70)" opacity="0.6"/>
        <ellipse cx="70" cy="48" rx="9" ry="15" :fill="design.primaryDeco" transform="rotate(120 70 70)" opacity="0.6"/>
        <ellipse cx="70" cy="48" rx="9" ry="15" :fill="design.primaryDeco" transform="rotate(180 70 70)" opacity="0.5"/>
        <ellipse cx="70" cy="48" rx="9" ry="15" :fill="design.primaryDeco" transform="rotate(240 70 70)" opacity="0.5"/>
        <ellipse cx="70" cy="48" rx="9" ry="15" :fill="design.primaryDeco" transform="rotate(300 70 70)" opacity="0.55"/>
        <ellipse cx="20" cy="120" rx="6" ry="13" fill="#7A9E68" transform="rotate(30 20 120)" opacity="0.4"/>
      </svg>
    </template>

    <!-- estrellas -->
    <template v-else-if="design.decoration === 'estrellas'">
      <div class="absolute inset-0 pointer-events-none" :style="`background-image:radial-gradient(circle,${design.primaryDeco}22 1.5px,transparent 1.5px);background-size:28px 28px`"/>
      <svg class="absolute top-8 left-1/2 -translate-x-1/2 w-full pointer-events-none" viewBox="0 0 400 60" fill="none">
        <polygon points="80,10 83,20 93,20 85,26 88,36 80,30 72,36 75,26 67,20 77,20" :fill="design.primaryDeco" opacity="0.4"/>
        <polygon points="200,5 204,17 217,17 207,25 211,37 200,29 189,37 193,25 183,17 196,17" :fill="design.primaryDeco" opacity="0.6"/>
        <polygon points="320,10 323,20 333,20 325,26 328,36 320,30 312,36 315,26 307,20 317,20" :fill="design.primaryDeco" opacity="0.4"/>
        <polygon points="40,30 42,37 49,37 43,42 45,49 40,45 35,49 37,42 31,37 38,37" :fill="design.secondaryDeco" opacity="0.35"/>
        <polygon points="360,25 362,32 369,32 363,37 365,44 360,40 355,44 357,37 351,32 358,32" :fill="design.secondaryDeco" opacity="0.35"/>
      </svg>
    </template>

    <!-- corona -->
    <template v-else-if="design.decoration === 'corona'">
      <svg class="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-20 pointer-events-none" viewBox="0 0 150 70" fill="none">
        <path d="M10 65 L10 38 L35 14 L75 42 L115 14 L140 38 L140 65 Z" :fill="design.primaryDeco" opacity="0.15"/>
        <path d="M10 65 L10 38 L35 14 L75 42 L115 14 L140 38 L140 65 Z" :stroke="design.primaryDeco" stroke-width="2"/>
        <circle cx="10" cy="38" r="5" :fill="design.primaryDeco"/>
        <circle cx="35" cy="14" r="5" :fill="design.primaryDeco"/>
        <circle cx="75" cy="42" r="6" :fill="design.secondaryDeco"/>
        <circle cx="115" cy="14" r="5" :fill="design.primaryDeco"/>
        <circle cx="140" cy="38" r="5" :fill="design.primaryDeco"/>
        <rect x="32" y="46" width="10" height="13" :fill="design.primaryDeco" opacity="0.7" rx="1"/>
        <rect x="70" y="46" width="10" height="13" :fill="design.secondaryDeco" opacity="0.7" rx="1"/>
        <rect x="108" y="46" width="10" height="13" :fill="design.primaryDeco" opacity="0.7" rx="1"/>
      </svg>
      <!-- small roses left/right -->
      <svg class="absolute top-0 left-0 w-32 h-32 pointer-events-none" viewBox="0 0 140 140" fill="none" opacity="0.3">
        <circle cx="50" cy="50" r="20" :fill="design.secondaryDeco"/>
        <circle cx="50" cy="50" r="14" :fill="design.secondaryDeco" opacity="0.8"/>
        <ellipse cx="50" cy="33" rx="7" ry="12" :fill="design.secondaryDeco" transform="rotate(0 50 50)" opacity="0.7"/>
        <ellipse cx="50" cy="33" rx="7" ry="12" :fill="design.secondaryDeco" transform="rotate(60 50 50)" opacity="0.6"/>
        <ellipse cx="50" cy="33" rx="7" ry="12" :fill="design.secondaryDeco" transform="rotate(120 50 50)" opacity="0.6"/>
        <ellipse cx="50" cy="33" rx="7" ry="12" :fill="design.secondaryDeco" transform="rotate(180 50 50)" opacity="0.5"/>
        <ellipse cx="50" cy="33" rx="7" ry="12" :fill="design.secondaryDeco" transform="rotate(240 50 50)" opacity="0.5"/>
        <ellipse cx="50" cy="33" rx="7" ry="12" :fill="design.secondaryDeco" transform="rotate(300 50 50)" opacity="0.55"/>
      </svg>
      <svg class="absolute top-0 right-0 w-32 h-32 pointer-events-none" viewBox="0 0 140 140" fill="none" opacity="0.3" style="transform:scaleX(-1)">
        <circle cx="50" cy="50" r="20" :fill="design.secondaryDeco"/>
        <circle cx="50" cy="50" r="14" :fill="design.secondaryDeco" opacity="0.8"/>
        <ellipse cx="50" cy="33" rx="7" ry="12" :fill="design.secondaryDeco" transform="rotate(0 50 50)" opacity="0.7"/>
        <ellipse cx="50" cy="33" rx="7" ry="12" :fill="design.secondaryDeco" transform="rotate(60 50 50)" opacity="0.6"/>
        <ellipse cx="50" cy="33" rx="7" ry="12" :fill="design.secondaryDeco" transform="rotate(120 50 50)" opacity="0.6"/>
        <ellipse cx="50" cy="33" rx="7" ry="12" :fill="design.secondaryDeco" transform="rotate(180 50 50)" opacity="0.5"/>
        <ellipse cx="50" cy="33" rx="7" ry="12" :fill="design.secondaryDeco" transform="rotate(240 50 50)" opacity="0.5"/>
        <ellipse cx="50" cy="33" rx="7" ry="12" :fill="design.secondaryDeco" transform="rotate(300 50 50)" opacity="0.55"/>
      </svg>
    </template>

    <!-- laurel -->
    <template v-else-if="design.decoration === 'laurel'">
      <div class="absolute inset-0 pointer-events-none" :style="`background-image:radial-gradient(circle,${design.primaryDeco}18 1.5px,transparent 1.5px);background-size:30px 30px`"/>
      <svg class="absolute top-10 left-1/2 -translate-x-1/2 w-64 opacity-30 pointer-events-none" viewBox="0 0 260 80" fill="none">
        <path d="M130 40 C110 40,95 30,80 20" :stroke="design.secondaryDeco" stroke-width="2"/>
        <ellipse cx="88" cy="23" rx="14" ry="7" :fill="design.primaryDeco" transform="rotate(-25 88 23)" opacity="0.9"/>
        <ellipse cx="74" cy="31" rx="13" ry="6.5" :fill="design.primaryDeco" transform="rotate(-40 74 31)" opacity="0.8"/>
        <ellipse cx="62" cy="40" rx="13" ry="6" :fill="design.primaryDeco" transform="rotate(-55 62 40)" opacity="0.8"/>
        <ellipse cx="52" cy="50" rx="12" ry="6" :fill="design.primaryDeco" transform="rotate(-65 52 50)" opacity="0.7"/>
        <path d="M130 40 C150 40,165 30,180 20" :stroke="design.secondaryDeco" stroke-width="2"/>
        <ellipse cx="172" cy="23" rx="14" ry="7" :fill="design.primaryDeco" transform="rotate(25 172 23)" opacity="0.9"/>
        <ellipse cx="186" cy="31" rx="13" ry="6.5" :fill="design.primaryDeco" transform="rotate(40 186 31)" opacity="0.8"/>
        <ellipse cx="198" cy="40" rx="13" ry="6" :fill="design.primaryDeco" transform="rotate(55 198 40)" opacity="0.8"/>
        <ellipse cx="208" cy="50" rx="12" ry="6" :fill="design.primaryDeco" transform="rotate(65 208 50)" opacity="0.7"/>
        <circle cx="130" cy="40" r="5" :fill="design.secondaryDeco" opacity="0.9"/>
      </svg>
      <svg class="absolute top-0 left-0 w-full pointer-events-none" viewBox="0 0 400 30" fill="none">
        <line x1="0" y1="6" x2="400" y2="6" :stroke="design.secondaryDeco" stroke-width="0.8" opacity="0.7"/>
        <line x1="0" y1="12" x2="400" y2="12" :stroke="design.secondaryDeco" stroke-width="2" opacity="0.9"/>
        <line x1="0" y1="18" x2="400" y2="18" :stroke="design.secondaryDeco" stroke-width="0.8" opacity="0.7"/>
      </svg>
      <svg class="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 400 30" fill="none" style="transform:scaleY(-1)">
        <line x1="0" y1="6" x2="400" y2="6" :stroke="design.secondaryDeco" stroke-width="0.8" opacity="0.7"/>
        <line x1="0" y1="12" x2="400" y2="12" :stroke="design.secondaryDeco" stroke-width="2" opacity="0.9"/>
        <line x1="0" y1="18" x2="400" y2="18" :stroke="design.secondaryDeco" stroke-width="0.8" opacity="0.7"/>
      </svg>
    </template>

    <!-- corazones -->
    <template v-else-if="design.decoration === 'corazones'">
      <svg class="absolute inset-0 w-full pointer-events-none" style="height:100%;min-height:600px" viewBox="0 0 400 700" fill="none" preserveAspectRatio="xMidYMid slice">
        <path d="M30 45 C30 38,40 35,45 42 C50 35,60 38,60 45 C60 58,45 68,45 68 C45 68,30 58,30 45Z" :fill="design.primaryDeco" opacity="0.2"/>
        <path d="M360 80 C360 74,368 72,372 77 C376 72,384 74,384 80 C384 90,372 98,372 98 C372 98,360 90,360 80Z" :fill="design.primaryDeco" opacity="0.2"/>
        <path d="M15 200 C15 194,23 192,27 197 C31 192,39 194,39 200 C39 210,27 218,27 218 C27 218,15 210,15 200Z" :fill="design.secondaryDeco" opacity="0.18"/>
        <path d="M370 300 C370 294,378 292,382 297 C386 292,394 294,394 300 C394 310,382 318,382 318 C382 318,370 310,370 300Z" :fill="design.primaryDeco" opacity="0.15"/>
        <path d="M20 450 C20 444,28 442,32 447 C36 442,44 444,44 450 C44 460,32 468,32 468 C32 468,20 460,20 450Z" :fill="design.secondaryDeco" opacity="0.15"/>
        <path d="M360 550 C360 544,368 542,372 547 C376 542,384 544,384 550 C384 560,372 568,372 568 C372 568,360 560,360 550Z" :fill="design.primaryDeco" opacity="0.18"/>
        <path d="M180 30 C180 24,188 22,192 27 C196 22,204 24,204 30 C204 40,192 48,192 48 C192 48,180 40,180 30Z" :fill="design.primaryDeco" opacity="0.12"/>
      </svg>
    </template>

    <!-- ondas -->
    <template v-else-if="design.decoration === 'ondas'">
      <svg class="absolute top-0 left-0 w-full pointer-events-none" viewBox="0 0 400 60" fill="none" preserveAspectRatio="none">
        <path d="M0 40 C50 20,100 60,150 40 C200 20,250 60,300 40 C350 20,400 60,400 40 L400 0 L0 0 Z" :fill="design.primaryDeco" opacity="0.12"/>
        <path d="M0 50 C60 30,120 70,180 50 C240 30,300 70,360 50 C380 44,390 52,400 48" :stroke="design.primaryDeco" stroke-width="1.5" opacity="0.5" fill="none"/>
      </svg>
      <svg class="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 400 60" fill="none" preserveAspectRatio="none" style="transform:rotate(180deg)">
        <path d="M0 40 C50 20,100 60,150 40 C200 20,250 60,300 40 C350 20,400 60,400 40 L400 0 L0 0 Z" :fill="design.primaryDeco" opacity="0.12"/>
        <path d="M0 50 C60 30,120 70,180 50 C240 30,300 70,360 50 C380 44,390 52,400 48" :stroke="design.primaryDeco" stroke-width="1.5" opacity="0.5" fill="none"/>
      </svg>
    </template>

    <!-- minimal -->
    <template v-else-if="design.decoration === 'minimal'">
      <div class="absolute left-0 top-0 bottom-0 w-1 pointer-events-none" :style="`background:linear-gradient(to bottom,${design.accentColor},${design.secondaryDeco},${design.accentColor})`"/>
      <div class="absolute top-0 left-0 right-0 h-0.5 pointer-events-none" :style="`background:linear-gradient(to right,${design.accentColor},${design.secondaryDeco},transparent)`"/>
    </template>

    <!-- baby -->
    <template v-else-if="design.decoration === 'baby'">
      <svg class="absolute inset-0 w-full pointer-events-none" style="height:100%;min-height:600px" viewBox="0 0 400 700" fill="none" preserveAspectRatio="xMidYMid slice">
        <!-- estrellas pequeñas -->
        <polygon points="40,40 42,47 49,47 43,52 45,59 40,54 35,59 37,52 31,47 38,47" :fill="design.primaryDeco" opacity="0.3"/>
        <polygon points="360,60 362,67 369,67 363,72 365,79 360,74 355,79 357,72 351,67 358,67" :fill="design.primaryDeco" opacity="0.3"/>
        <polygon points="20,180 22,187 29,187 23,192 25,199 20,194 15,199 17,192 11,187 18,187" :fill="design.secondaryDeco" opacity="0.25"/>
        <polygon points="380,250 382,257 389,257 383,262 385,269 380,264 375,269 377,262 371,257 378,257" :fill="design.secondaryDeco" opacity="0.25"/>
        <!-- luna -->
        <path d="M370 120 A22 22 0 1 1 352 150 A16 16 0 1 0 370 120 Z" :fill="design.primaryDeco" opacity="0.2"/>
        <!-- burbujas -->
        <circle cx="25" cy="350" r="14" :stroke="design.primaryDeco" stroke-width="1.5" opacity="0.2" fill="none"/>
        <circle cx="375" cy="430" r="10" :stroke="design.primaryDeco" stroke-width="1.5" opacity="0.2" fill="none"/>
        <circle cx="30" cy="550" r="8" :stroke="design.secondaryDeco" stroke-width="1" opacity="0.2" fill="none"/>
      </svg>
    </template>

    <!-- cruz (bautizo) -->
    <template v-else-if="design.decoration === 'cruz'">
      <svg class="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-14 pointer-events-none" viewBox="0 0 50 60" fill="none">
        <rect x="20" y="2" width="10" height="56" rx="2" :fill="design.primaryDeco" opacity="0.35"/>
        <rect x="6" y="16" width="38" height="10" rx="2" :fill="design.primaryDeco" opacity="0.35"/>
      </svg>
      <svg class="absolute top-0 left-0 w-36 h-36 pointer-events-none" viewBox="0 0 160 160" fill="none" opacity="0.3">
        <path d="M10 10 C40 50,80 30,100 80" :stroke="design.secondaryDeco" stroke-width="2"/>
        <ellipse cx="35" cy="38" rx="15" ry="9" :fill="design.secondaryDeco" transform="rotate(-30 35 38)" opacity="0.6"/>
        <ellipse cx="60" cy="25" rx="18" ry="10" :fill="design.primaryDeco" transform="rotate(-60 60 25)" opacity="0.5"/>
        <ellipse cx="88" cy="50" rx="16" ry="9" :fill="design.secondaryDeco" transform="rotate(15 88 50)" opacity="0.55"/>
      </svg>
      <svg class="absolute top-0 right-0 w-36 h-36 pointer-events-none" viewBox="0 0 160 160" fill="none" opacity="0.3" style="transform:scaleX(-1)">
        <path d="M10 10 C40 50,80 30,100 80" :stroke="design.secondaryDeco" stroke-width="2"/>
        <ellipse cx="35" cy="38" rx="15" ry="9" :fill="design.secondaryDeco" transform="rotate(-30 35 38)" opacity="0.6"/>
        <ellipse cx="60" cy="25" rx="18" ry="10" :fill="design.primaryDeco" transform="rotate(-60 60 25)" opacity="0.5"/>
        <ellipse cx="88" cy="50" rx="16" ry="9" :fill="design.secondaryDeco" transform="rotate(15 88 50)" opacity="0.55"/>
      </svg>
    </template>

    <!-- ── CONTENIDO ── -->
    <div class="relative z-10 flex flex-col items-center px-6 py-14 min-h-screen">

      <!-- Foto de portada -->
      <div v-if="event.coverImage" class="w-full max-w-sm rounded-2xl overflow-hidden mb-8 shadow-xl" style="height:200px">
        <img :src="event.coverImage" class="w-full h-full object-cover" />
      </div>

      <!-- Tipo de evento -->
      <p class="text-xs font-bold uppercase tracking-[0.28em] mb-3" :style="{ color: design.accentColor }">
        ✦ {{ eventTypeLabel }} ✦
      </p>

      <!-- Nombre del evento -->
      <h1 class="text-3xl font-bold text-center leading-tight mb-2" :style="{ color: design.titleColor }">
        {{ event.name }}
      </h1>

      <!-- Divisor -->
      <div class="flex items-center gap-3 my-4 w-full max-w-xs">
        <div class="h-px flex-1" :style="`background:linear-gradient(to right,transparent,${design.accentColor})`"/>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <polygon points="7,0 8.5,5 14,5 9.5,8 11,14 7,10.5 3,14 4.5,8 0,5 5.5,5" :fill="design.accentColor"/>
        </svg>
        <div class="h-px flex-1" :style="`background:linear-gradient(to left,transparent,${design.accentColor})`"/>
      </div>

      <!-- Fecha y hora -->
      <p class="text-base text-center italic mb-1" :style="{ color: design.bodyColor }">
        {{ formatDate(event.date) }}
      </p>
      <p class="text-sm text-center mb-8" :style="{ color: design.accentColor }">
        {{ event.time }} hrs
      </p>

      <!-- Invitado -->
      <div
        class="w-full max-w-sm text-center px-6 py-5 mb-6 rounded-2xl"
        :style="{ background: design.cardBg, border: `1.5px solid ${design.cardBorder}` }"
      >
        <p class="text-xs uppercase tracking-widest mb-2" :style="{ color: design.accentColor }">
          Con mucho gusto invitamos a
        </p>
        <p class="text-2xl font-bold mb-1" :style="{ color: design.titleColor }">{{ guestName }}</p>
        <p v-if="companionsText" class="text-xs" :style="{ color: design.mutedColor }">{{ companionsText }}</p>
      </div>

      <!-- Detalles del lugar -->
      <div class="w-full max-w-sm space-y-3 mb-6">
        <div class="flex items-start gap-3">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" :stroke="design.accentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
          </svg>
          <div>
            <p class="text-sm font-semibold" :style="{ color: design.titleColor }">{{ event.venue }}</p>
            <p v-if="event.venueAddress" class="text-xs" :style="{ color: design.mutedColor }">{{ event.venueAddress }}</p>
          </div>
        </div>
        <div v-if="event.churchName" class="flex items-start gap-3">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" :stroke="design.accentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/>
          </svg>
          <div>
            <p class="text-xs uppercase tracking-wider mb-0.5" :style="{ color: design.accentColor }">Ceremonia</p>
            <p class="text-sm font-semibold" :style="{ color: design.titleColor }">{{ event.churchName }}</p>
            <p v-if="event.churchAddress" class="text-xs" :style="{ color: design.mutedColor }">{{ event.churchAddress }}</p>
          </div>
        </div>
        <div v-if="guest?.table" class="flex items-center gap-3 px-4 py-3 rounded-xl" :style="{ background: design.cardBg, border: `1px solid ${design.cardBorder}` }">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" :stroke="design.accentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z"/>
          </svg>
          <div>
            <p class="text-xs" :style="{ color: design.accentColor }">Mesa asignada</p>
            <p class="text-sm font-bold" :style="{ color: design.titleColor }">{{ guest.table.name }}</p>
          </div>
        </div>
      </div>

      <!-- ── QR CODE ── -->
      <div class="w-full max-w-sm flex flex-col items-center gap-2 mb-5">
        <!-- QR real (invitación real) -->
        <img
          v-if="qrImage"
          :src="qrImage"
          class="w-36 h-36 rounded-2xl object-contain"
          :style="{ border: `2px solid ${design.accentColor}40`, background: '#fff', padding: '6px' }"
          alt="Código QR de acceso"
        />
        <!-- QR placeholder (vista previa) -->
        <div
          v-else
          class="w-36 h-36 rounded-2xl flex items-center justify-center"
          :style="{ border: `2px solid ${design.accentColor}35`, background: 'rgba(255,255,255,0.08)' }"
        >
          <!-- SVG que imita un QR code -->
          <svg width="100" height="100" viewBox="0 0 100 100" :fill="design.accentColor">
            <!-- Esquina sup izq -->
            <rect x="4" y="4" width="28" height="28" rx="3" fill="none" :stroke="design.accentColor" stroke-width="3"/>
            <rect x="10" y="10" width="16" height="16" rx="1"/>
            <!-- Esquina sup der -->
            <rect x="68" y="4" width="28" height="28" rx="3" fill="none" :stroke="design.accentColor" stroke-width="3"/>
            <rect x="74" y="10" width="16" height="16" rx="1"/>
            <!-- Esquina inf izq -->
            <rect x="4" y="68" width="28" height="28" rx="3" fill="none" :stroke="design.accentColor" stroke-width="3"/>
            <rect x="10" y="74" width="16" height="16" rx="1"/>
            <!-- Datos centrales (patrón decorativo) -->
            <rect x="40" y="4" width="4" height="4"/><rect x="48" y="4" width="4" height="4"/><rect x="56" y="4" width="4" height="4"/>
            <rect x="40" y="12" width="4" height="4"/><rect x="56" y="12" width="8" height="4"/>
            <rect x="40" y="20" width="8" height="4"/><rect x="56" y="20" width="4" height="4"/>
            <rect x="40" y="28" width="4" height="4"/><rect x="48" y="28" width="8" height="4"/>
            <rect x="40" y="40" width="4" height="4"/><rect x="48" y="36" width="4" height="4"/><rect x="56" y="40" width="4" height="4"/>
            <rect x="40" y="48" width="8" height="4"/><rect x="52" y="44" width="4" height="4"/><rect x="60" y="48" width="4" height="4"/>
            <rect x="40" y="56" width="4" height="4"/><rect x="48" y="52" width="8" height="4"/>
            <rect x="68" y="36" width="4" height="4"/><rect x="76" y="36" width="8" height="4"/>
            <rect x="68" y="44" width="8" height="4"/><rect x="80" y="44" width="4" height="4" opacity="0.5"/>
            <rect x="68" y="52" width="4" height="4"/><rect x="76" y="52" width="4" height="4"/>
            <rect x="68" y="60" width="8" height="4"/><rect x="80" y="56" width="4" height="8"/>
            <rect x="4" y="40" width="4" height="4"/><rect x="12" y="36" width="8" height="4"/>
            <rect x="4" y="48" width="8" height="4"/><rect x="16" y="44" width="4" height="4"/>
            <rect x="4" y="56" width="4" height="4"/><rect x="12" y="52" width="4" height="4"/><rect x="20" y="56" width="8" height="4"/>
            <rect x="4" y="64" width="8" height="4"/><rect x="16" y="64" width="4" height="4"/>
            <rect x="40" y="68" width="4" height="4"/><rect x="48" y="68" width="8" height="4"/>
            <rect x="44" y="76" width="4" height="4"/><rect x="52" y="72" width="4" height="4"/><rect x="60" y="76" width="4" height="4"/>
            <rect x="40" y="84" width="8" height="4"/><rect x="52" y="80" width="4" height="4"/>
            <rect x="40" y="92" width="4" height="4"/><rect x="48" y="88" width="8" height="4"/>
            <rect x="56" y="84" width="4" height="8"/><rect x="64" y="80" width="4" height="4"/>
          </svg>
        </div>
        <p class="text-xs text-center font-medium" :style="{ color: design.accentColor }">
          Muestra este código en la entrada
        </p>
      </div>

      <!-- Acciones -->
      <div class="w-full max-w-sm flex flex-col gap-2">
        <slot name="actions"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDesignById } from '~/utils/invitationDesigns'
import type { InvitationDesign } from '~/utils/invitationDesigns'

const props = defineProps<{
  designId: string
  event: { name: string; date: string; time: string; venue: string; venueAddress?: string|null; venueMapUrl?: string|null; coverImage?: string|null; type: string; churchName?: string|null; churchAddress?: string|null }
  guest?: { name: string; companions: number; rsvpStatus: string; table?: { name: string; number: number }|null }
  code?: string
  qrImage?: string | null
}>()

const FALLBACK_DESIGN: InvitationDesign = {
  id: 'fallback', name: 'Clásico', eventTypes: ['other'],
  bg: 'linear-gradient(160deg,#FAFAF5,#F0EDE8)', accentColor: '#C9A84C',
  titleColor: '#1A1208', bodyColor: '#3A3020', mutedColor: '#8B7D6B',
  cardBg: 'rgba(201,168,76,0.06)', cardBorder: 'rgba(201,168,76,0.25)',
  decoration: 'botanical', primaryDeco: '#7A9E68', secondaryDeco: '#5C7A4E',
}

const design = computed<InvitationDesign>(() => getDesignById(props.designId) ?? FALLBACK_DESIGN)

const guestName = computed(() => props.guest?.name ?? 'Nombre del Invitado')
const companionsText = computed(() => {
  if (!props.guest) return ''
  return props.guest.companions > 0 ? `Válida para ${props.guest.companions + 1} personas` : 'Invitación personal'
})
const TYPE_LABELS: Record<string, string> = {
  wedding: 'Nuestra Boda', birthday: 'Mi Cumpleaños', 'quinceañera': 'Mis XV Años',
  corporate: 'Evento Corporativo', baby_shower: 'Baby Shower',
  graduation: 'Mi Graduación', bautizo: 'Bautizo', other: 'Evento Especial',
}
const eventTypeLabel = computed(() => TYPE_LABELS[props.event.type] ?? 'Invitación Especial')

function formatDate(d: string) {
  return new Date(d.slice(0, 10) + 'T12:00:00').toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
</script>
