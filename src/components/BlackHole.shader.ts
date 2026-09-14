/**
 * BlackHole.shader.ts — isolated GLSL for the OpenAuth black hole.
 *
 * Palette is restricted to the Cosmic Indigo tokens (docs/ui-guide.md):
 * silver / silver-bright / silver-dim / indigo over a deep-space base.
 * No orange/red movie-space colors.
 *
 * The shader renders in HDR: the disk's approaching side and the photon
 * ring intentionally exceed 1.0 so the Bloom pass (see BlackHole.tsx)
 * picks up ONLY those bright pixels via its luminance threshold, while
 * the background stays crisp and dark.
 *
 * Depth hierarchy, back to front:
 *   0. deep-space base          — darkest layer, deepened for contrast
 *   1. lensed starfield         — distant, dim, never reaches bloom
 *   2. gravitational haze       — faint indigo atmosphere
 *   3. disk volume glow         — broad volumetric-feeling mid-ground light
 *   4. disk body                — thin bright plane, strong Doppler beaming
 *   5. photon ring + edge       — crisp HDR foreground focal point
 *   6. event horizon            — true-black occluder over everything behind
 *
 * Presence scale (uScale): every hole-space feature (horizon, ring, disk,
 * lensing, haze) is computed from the scaled coordinate q, so raising
 * uScale enlarges the whole effect uniformly. Screen-space layers —
 * starfield sampling, text scrim, vignette — stay unscaled on purpose.
 *
 * Composition (uCenter, CSS-style fractions — may exceed [0,1]): the
 * hole's center sits just OUTSIDE the bottom-right corner, so only the
 * upper-left quadrant of the effect (shadow cap, lensing arcs, disk
 * sweep) peeks into view. A secondary lensed image wraps arcs
 * over/under the shadow (Gargantua-style approximation reusing the
 * disk shading). An explicit text anchor (uText, same convention)
 * keeps the scrim glued to the copy, which stays far from the hole.
 *
 * Performance note: the three expensive fbm layers (turbulence,
 * secondaryTurbulence, wrapTurb) are gated behind cheap footprint
 * checks. Each fbm multiplier (innerDisk/outerDisk/arcMask/wrapBand)
 * falls to EXACTLY zero outside the disk band / wrap shell, so pixels
 * far from the hole take the cheap background+starfield path only.
 */

export const VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const FRAGMENT_SHADER = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform float uAspect;
uniform float uDetail;
uniform float uScale;
uniform vec2 uCenter;
uniform vec2 uText;

const float PI = 3.14159265359;

/* Squared gaussian without pow(x, 2.0): pow() of a possibly-negative
   base is undefined behavior in GLSL and can produce NaN pixels. */
float gauss(float x) {
  return exp(-x * x);
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  f = f * f * (3.0 - 2.0 * f);

  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));

  return mix(
    mix(a, b, f.x),
    mix(c, d, f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 4; i++) {
    value += noise(p) * amplitude;
    p = p * 2.03 + 11.7;
    amplitude *= 0.5;
  }

  return value;
}

float starLayer(vec2 p, float threshold, float size) {
  vec2 cell = floor(p);
  vec2 local = fract(p) - 0.5;

  float seed = hash21(cell);

  vec2 offset = vec2(
    hash21(cell + 3.17),
    hash21(cell + 9.31)
  ) - 0.5;

  float d = length(local - offset * 0.75);

  float star = smoothstep(size, 0.0, d);
  float visible = step(threshold, seed);

  float twinkle =
    0.72 +
    0.28 * sin(uTime * 0.55 + seed * PI * 2.0);

  /*
    Per-star staggered timeline instead of a unison pulse: each star
    drifts on its own slow frequency (period ~15-50s) and phase, and
    carries a fixed brightness draw so a few read brighter while most
    stay barely there. Two extra hash21 + one sin per layer — negligible
    against the gated fbm work. Under prefers-reduced-motion uTime is
    frozen (and frameloop goes demand), so the stars hold perfectly
    still but remain visible.
  */
  float brightness =
    0.65 +
    0.35 * hash21(cell * 13.37);

  float fade =
    0.65 +
    0.35 * sin(
      uTime * (0.12 + 0.30 * hash21(cell * 7.77)) +
      seed * PI * 2.0
    );

  return star * visible * twinkle * fade * brightness;
}

void main() {
  vec2 p = vec2(
    (vUv.x - 0.5) * uAspect,
    vUv.y - 0.5
  );

  /*
    Very subtle cursor influence (heavily damped on the CPU).
    The black hole itself stays almost stationary. Kept deliberately
    small: at the new larger scale the same offset reads as stronger,
    so this was nudged down, not up.
  */
  vec2 centerOffset = vec2(
    uMouse.x * 0.028,
    uMouse.y * 0.014
  );

  /* uCenter convention (fractions of the canvas, CSS-style):
     x = fraction across from the LEFT, y = fraction DOWN FROM THE TOP.
     NOTE: vUv/WebGL Y runs bottom-up, so the Y term is flipped here
     (0.5 - uCenter.y) to honor the documented top-down convention.
     Keep this flip — dropping it mirrors the hole vertically
     (desktop sinks ~6%, mobile jumps up behind the headline). */
  vec2 holeScreen = vec2(
    (uCenter.x - 0.5) * uAspect,
    0.5 - uCenter.y
  );

  vec2 q = p - holeScreen - centerOffset;

  /*
    Move the black hole slightly downward so the typography
    remains the visual priority.
  */
  q.y += 0.025;

  /*
    Presence scale: divide once here and every hole-space feature
    below (horizon, ring, disk, lensing, haze) grows uniformly.
  */
  q /= uScale;

  float r = length(q);
  float rSafe = max(r, 0.0001);
  vec2 radial = q / rSafe;

  /* -------------------------------------------------------------- */
  /* LAYER 0 — deep space (deepened for contrast)                   */
  /* -------------------------------------------------------------- */

  vec3 col = vec3(
    0.030,
    0.026,
    0.062
  );

  /*
    Approximate gravitational lensing: the closer a pixel gets to
    the singularity, the stronger the angular distortion becomes.
  */
  float lensStrength =
    0.16 /
    (r * r + 0.055);

  lensStrength *= 1.0 - smoothstep(
    0.035,
    0.90,
    r
  );

  vec2 lensedP =
    p -
    radial *
    lensStrength *
    0.10;

  /* -------------------------------------------------------------- */
  /* LAYER 1 — distant starfield (dim, never blooms)                */
  /* -------------------------------------------------------------- */

  float stars = 0.0;

  stars += starLayer(
    lensedP * 26.0,
    0.989,
    0.045
  ) * 0.55;

  if (uDetail > 0.5) {
    stars += starLayer(
      lensedP * 47.0 + 17.3,
      0.992,
      0.035
    ) * 0.40;

    stars += starLayer(
      lensedP * 79.0 + 41.7,
      0.996,
      0.026
    ) * 0.26;
  }

  vec3 silverDim = vec3(
    0.72157,
    0.70588,
    0.83137
  );

  col += silverDim * stars * 0.70;

  /* -------------------------------------------------------------- */
  /* LAYER 2 — gravitational haze (faint indigo atmosphere)         */
  /* -------------------------------------------------------------- */

  float atmosphericGlow =
    exp(-r * 3.8) * 0.10 +
    gauss((r - 0.25) * 4.2) * 0.055;

  vec3 indigo = vec3(
    0.35294,
    0.33725,
    0.50196
  );

  col += indigo * atmosphericGlow;

  /* -------------------------------------------------------------- */
  /* Accretion disk — shared coordinates                            */
  /* -------------------------------------------------------------- */

  vec2 diskSpace = q;

  /* Flatten Y to create the thin tilted disk silhouette. */
  diskSpace.y *= 3.7;

  float diskRadius = length(diskSpace);

  /* Cheap values reused by both disk and wrap below. */
  float rotation =
    uTime * 0.11;

  float velocitySide =
    clamp(
      (-q.x / rSafe) * 0.5 + 0.5,
      0.0,
      1.0
    );

  float beam = smoothstep(
    0.12,
    0.90,
    velocitySide
  );

  float doppler = mix(0.5, 2.0, beam);

  vec3 silver = vec3(
    0.86667,
    0.85098,
    0.94118
  );

  vec3 silverBright = vec3(
    0.92549,
    0.91765,
    0.97255
  );

  /*
    Performance gate — disk band. innerDisk/outerDisk are exactly zero
    outside diskRadius in (0.165, 0.78), so the two disk fbm layers and
    all subsequent disk/volume shading only ever contribute inside this
    radial band. Pixels outside it skip the entire chain; their result
    is bit-identical because the skipped factors are literal zeros.
  */
  if (diskRadius > 0.165 && diskRadius < 0.78) {
    /* Slow, clearly visible rotation — massive, not frantic. */
    float angle = atan(diskSpace.y, diskSpace.x);

    float flowAngle =
      angle -
      rotation;

    /* Procedural turbulent gas. */
    float turbulence = fbm(
      vec2(
        flowAngle * 2.5,
        diskRadius * 17.0
      ) +
      vec2(0.0, -uTime * 0.50)
    );

    float secondaryTurbulence = fbm(
      vec2(
        flowAngle * 6.0,
        diskRadius * 34.0
      ) -
      vec2(uTime * 0.20, 0.0)
    );

    float structure =
      0.55 +
      turbulence * 0.45 +
      secondaryTurbulence * 0.15;

    /* Inner and outer disk boundaries. The outer edge is kept radially
       contained so the far reaches of the disk never wash over the
       distant text block. */
    float innerDisk =
      smoothstep(
        0.165,
        0.205,
        diskRadius
      );

    float outerDisk =
      1.0 -
      smoothstep(
        0.45,
        0.78,
        diskRadius
      );

    /* ------------------------------------------------------------ */
    /* LAYER 3 — disk volume glow (broad mid-ground light)          */
    /* ------------------------------------------------------------ */

    float volume =
      (
        gauss((diskRadius - 0.42) * 2.6) * 0.38 +
        exp(-r * 2.2) * 0.10
      ) *
      mix(0.55, 1.5, beam) *
      innerDisk *
      outerDisk;

    col +=
      mix(indigo, silverDim, 0.45) *
      volume;

    /* ------------------------------------------------------------ */
    /* LAYER 4 — disk body (thin, bright, strongly beamed)          */
    /* ------------------------------------------------------------ */

    float verticalThickness =
      mix(
        0.012,
        0.030,
        smoothstep(0.18, 0.55, diskRadius)
      );

    float planeDist =
      abs(q.y) /
      max(verticalThickness, 0.001);

    float diskThickness = exp(-planeDist * planeDist);

    /* Soft halo hugging the disk plane. */
    float diskHalo =
      gauss((diskRadius - 0.38) * 4.2) * 0.30;

    float disk =
      innerDisk *
      outerDisk *
      (
        diskThickness * 1.1 +
        diskHalo
      );

    /* Hot inner rim. */
    float innerHeat =
      1.0 -
      smoothstep(
        0.16,
        0.30,
        diskRadius
      );

    vec3 diskColor =
      mix(
        indigo,
        silver,
        clamp(
          0.28 +
          innerHeat * 0.55 +
          turbulence * 0.15,
          0.0,
          1.0
        )
      );

    vec3 diskLight =
      diskColor *
      disk *
      structure *
      doppler;

    diskLight +=
      silverBright *
      innerHeat *
      disk *
      0.35;

    col += diskLight;
  }

  /* -------------------------------------------------------------- */
  /* Secondary lensed image — far-side disk bent over/under shadow  */
  /* -------------------------------------------------------------- */

  /*
    Gargantua-style approximation: the same gas shading re-mapped onto
    an elliptical shell hugging the shadow, kept only near the vertical
    axis so it reads as arcs wrapping over the top and under the
    bottom — not a second full ring. Brightness follows the same
    beaming direction so the lighting stays coherent.

    Performance gate — wrap shell, widened to wrapR < 1.6 for seam
    margin. wrapBand is a gaussian in wrapR; at 1.5 it has decayed to
    ~0.002 and by 1.6 to ~1.2e-4 — either cut is far below 8-bit
    precision, so this skips the wrapTurb fbm layer only where the
    contribution is genuinely invisible.
  */
  float wrapRY = q.y > 0.0 ? 0.22 : 0.19;

  vec2 wrapQ = vec2(
    q.x / 0.36,
    q.y / wrapRY
  );

  float wrapR = length(wrapQ);

  if (wrapR < 1.6) {
    float wrapDist = (wrapR - 1.0) * 5.0;
    float wrapBand = exp(-wrapDist * wrapDist);

    float verticality =
      abs(q.y) /
      rSafe;

    float arcMask = smoothstep(0.30, 0.62, verticality);

    float arcInner = smoothstep(0.16, 0.21, r);

    float wrapAngle = atan(wrapQ.y, wrapQ.x);
    float wrapFlow = wrapAngle - rotation;

    float wrapTurb = fbm(
      vec2(
        wrapFlow * 2.5,
        wrapR * 9.0
      ) +
      vec2(0.0, -uTime * 0.35)
    );

    float wrapStruct = 0.55 + wrapTurb * 0.45;

    vec3 wrapColor =
      mix(
        indigo,
        silver,
        clamp(
          0.30 + wrapTurb * 0.25,
          0.0,
          1.0
        )
      );

    float wrapLight =
      wrapBand *
      arcMask *
      arcInner *
      wrapStruct *
      mix(0.6, 1.5, beam) *
      0.55;

    col += wrapColor * wrapLight;
  }

  /* -------------------------------------------------------------- */
  /* LAYER 5 — photon ring (crisp HDR foreground line)              */
  /* -------------------------------------------------------------- */

  float photonRadius = 0.186;

  float ringDist = (r - photonRadius) * 135.0;
  float photonRing = exp(-ringDist * ringDist);

  /* Mostly symmetric: the ring is lensed light, the disk carries
     the asymmetry. */
  float ringAsymmetry =
    0.88 +
    0.12 *
    (
      0.5 +
      0.5 *
      q.x /
      rSafe
    );

  col += silverBright *
    photonRing *
    ringAsymmetry *
    4.0;

  /* Tiny horizon-edge illumination. */
  float horizonEdge =
    smoothstep(
      0.170,
      0.178,
      r
    ) *
    (
      1.0 -
      smoothstep(
        0.180,
        0.186,
        r
      )
    );

  col +=
    silverBright *
    horizonEdge *
    0.12;

  /* -------------------------------------------------------------- */
  /* Text scrim — soft localized darkening behind the headline      */
  /* -------------------------------------------------------------- */

  /*
    Elliptical in screen space, anchored to uText (same CSS-style
    convention as uCenter) so it stays glued to the typography on
    both the desktop split and the mobile stack. Pure gaussian
    falloff: no hard edges, no box. Applied before the horizon
    occluder so the shadow stays black and only the disk light
    behind the text is gently held back.
  */
  vec2 textScreen = vec2(
    (uText.x - 0.5) * uAspect,
    0.5 - uText.y
  );

  vec2 scrimP = vec2(
    (p.x - textScreen.x) * 0.85,
    (p.y - textScreen.y) * 1.9
  );

  float scrim = exp(-dot(scrimP, scrimP) * 2.2);

  col *= 1.0 - scrim * 0.38;

  /* -------------------------------------------------------------- */
  /* LAYER 6 — event horizon (true-black foreground occluder)       */
  /* -------------------------------------------------------------- */

  float shadow =
    1.0 -
    smoothstep(
      0.152,
      0.178,
      r
    );

  /* True void: the occluder is pure black so the ring reads as the
     only light source on that edge. */
  vec3 blackHole = vec3(
    0.0,
    0.0,
    0.0
  );

  vec3 color =
    mix(
      col,
      blackHole,
      shadow
    );

  /* -------------------------------------------------------------- */
  /* Outer vignette — dissolve into the page background             */
  /* -------------------------------------------------------------- */

  float vignette =
    1.0 -
    smoothstep(
      0.45,
      1.25,
      length(p)
    );

  color =
    mix(
      vec3(
        0.05098,
        0.04314,
        0.10196
      ),
      color,
      vignette
    );

  /* Prevent hard canvas edges from appearing. */
  float edgeFade =
    1.0 -
    smoothstep(
      0.60,
      1.15,
      length(p)
    );

  color *= edgeFade;

  gl_FragColor = vec4(color, 1.0);
}
`