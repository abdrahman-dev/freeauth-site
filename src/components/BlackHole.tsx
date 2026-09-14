import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactElement, RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import { FRAGMENT_SHADER, VERTEX_SHADER } from './BlackHole.shader.ts'

/* eslint-disable react-hooks/immutability -- BlackHoleScene is imperative
   three.js code by design: shader uniforms and parallax refs are mutated
   inside useFrame so the effect never triggers React re-renders. */
/* eslint-disable react-refresh/only-export-components -- useMouseParallax is
   intentionally colocated here so the effect stays self-contained per spec. */

export interface ParallaxPoint {
  x: number
  y: number
}

export interface MouseParallax {
  target: RefObject<ParallaxPoint>
  smooth: RefObject<ParallaxPoint>
}

interface UseMouseParallaxOptions {
  disabled?: boolean
}

export function useMouseParallax(
  options: UseMouseParallaxOptions = {},
): MouseParallax {
  const { disabled = false } = options

  const target = useRef<ParallaxPoint>({ x: 0, y: 0 })
  const smooth = useRef<ParallaxPoint>({ x: 0, y: 0 })

  useEffect(() => {
    if (disabled) {
      target.current.x = 0
      target.current.y = 0
      smooth.current.x = 0
      smooth.current.y = 0
      return
    }

    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMove = (event: MouseEvent): void => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -((event.clientY / window.innerHeight) * 2 - 1)

      target.current.x = THREE.MathUtils.clamp(x, -1, 1)
      target.current.y = THREE.MathUtils.clamp(y, -1, 1)
    }

    const handleLeave = (): void => {
      target.current.x = 0
      target.current.y = 0
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
    }
  }, [disabled])

  return useMemo(
    () => ({
      target,
      smooth,
    }),
    [],
  )
}

interface BlackHoleSceneProps {
  parallax: MouseParallax
  reducedMotion: boolean
  detail: number
}

/*
  Presence scale, driven by the same viewport breakpoint as uDetail.
  The hole sits mostly off-canvas, so both scales are generous: the
  visible quarter must still read as massive.
*/
const DESKTOP_SCALE = 3.2
const MOBILE_SCALE = 2.0

/*
  Hole placement (CSS-style fractions: x across from the left,
  y down from the top — values may exceed [0,1]). The center sits
  just outside the bottom-right corner, so only the upper-left
  quadrant of the effect peeks into view.
*/
const DESKTOP_CENTER_X = 1.06
const DESKTOP_CENTER_Y = 1.02
const MOBILE_CENTER_X = 1.0
const MOBILE_CENTER_Y = 1.02

/*
  Text anchor (same convention): where the copy lives, so the scrim
  can protect it. Far from the hole in both layouts.
*/
const DESKTOP_TEXT_X = 0.24
const DESKTOP_TEXT_Y = 0.46
const MOBILE_TEXT_X = 0.5
const MOBILE_TEXT_Y = 0.2

function BlackHoleScene({
  parallax,
  reducedMotion,
  detail,
}: BlackHoleSceneProps): ReactElement {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uTime: {
            value: 0,
          },
          uMouse: {
            value: new THREE.Vector2(0, 0),
          },
          uAspect: {
            value: 16 / 9,
          },
          uDetail: {
            value: detail,
          },
          uScale: {
            value: detail > 0.5 ? DESKTOP_SCALE : MOBILE_SCALE,
          },
          uCenter: {
            value: new THREE.Vector2(
              detail > 0.5 ? DESKTOP_CENTER_X : MOBILE_CENTER_X,
              detail > 0.5 ? DESKTOP_CENTER_Y : MOBILE_CENTER_Y,
            ),
          },
          uText: {
            value: new THREE.Vector2(
              detail > 0.5 ? DESKTOP_TEXT_X : MOBILE_TEXT_X,
              detail > 0.5 ? DESKTOP_TEXT_Y : MOBILE_TEXT_Y,
            ),
          },
        },
        depthWrite: false,
        depthTest: false,
      }),
    // The shader strings are deps on purpose: if HMR swaps the GLSL
    // module, the material rebuilds instead of rendering a stale
    // program with mismatched uniforms.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [detail, VERTEX_SHADER, FRAGMENT_SHADER],
  )

  const time = useRef(0)

  useEffect(() => {
    return () => {
      material.dispose()
    }
  }, [material])

  useFrame((state, delta) => {
    const frameDelta = Math.min(delta, 0.05)

    const smoothing =
      reducedMotion
        ? 0
        : 1 - Math.exp(-frameDelta * 0.85)

    const target = parallax.target.current
    const smooth = parallax.smooth.current

    smooth.x +=
      (target.x - smooth.x) *
      smoothing

    smooth.y +=
      (target.y - smooth.y) *
      smoothing

    if (!reducedMotion) {
      time.current += frameDelta
    }

    material.uniforms.uTime.value = time.current

    const mouse =
      material.uniforms.uMouse.value as THREE.Vector2

    mouse.set(
      reducedMotion ? 0 : smooth.x,
      reducedMotion ? 0 : smooth.y,
    )

    const width = Math.max(state.size.width, 1)
    const height = Math.max(state.size.height, 1)

    material.uniforms.uAspect.value =
      width / height
  })

  return (
    <mesh
      frustumCulled={false}
      renderOrder={-1}
    >
      <planeGeometry args={[2, 2]} />
      <primitive
        object={material}
        attach="material"
      />
    </mesh>
  )
}

function isWebGLAvailable(): boolean {
  try {
    if (typeof window === 'undefined') {
      return false
    }

    const canvas = document.createElement('canvas')

    return Boolean(
      window.WebGLRenderingContext &&
        (
          canvas.getContext('webgl2') ??
          canvas.getContext('webgl')
        ),
    )
  } catch {
    return false
  }
}

const FALLBACK_CLASS =
  [
    'openauth-fallback-glow',
    'openauth-fallback-glow-animated',
    'pointer-events-none',
    'absolute',
    'inset-0',
  ].join(' ')

export interface BlackHoleProps {
  className?: string
}

export default function BlackHole({
  className = '',
}: BlackHoleProps): ReactElement {
  const [webgl] = useState<boolean>(
    () => isWebGLAvailable(),
  )

  const [reducedMotion, setReducedMotion] =
    useState<boolean>(() =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function'
        ? window.matchMedia(
            '(prefers-reduced-motion: reduce)',
          ).matches
        : false,
    )

  const [detail, setDetail] =
    useState<number>(() =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function'
        ? window.matchMedia(
            '(max-width: 767px)',
          ).matches
          ? 0
          : 1
        : 1,
    )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const motionQuery =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      )

    const narrowQuery =
      window.matchMedia(
        '(max-width: 767px)',
      )

    const handleMotion = (
      event: MediaQueryListEvent,
    ): void => {
      setReducedMotion(event.matches)
    }

    const handleNarrow = (
      event: MediaQueryListEvent,
    ): void => {
      setDetail(event.matches ? 0 : 1)
    }

    motionQuery.addEventListener(
      'change',
      handleMotion,
    )

    narrowQuery.addEventListener(
      'change',
      handleNarrow,
    )

    return () => {
      motionQuery.removeEventListener(
        'change',
        handleMotion,
      )

      narrowQuery.removeEventListener(
        'change',
        handleNarrow,
      )
    }
  }, [])

  const parallax = useMouseParallax({
    disabled:
      reducedMotion ||
      detail === 0,
  })

  if (!webgl) {
    return (
      <div
        aria-hidden="true"
        className={`${FALLBACK_CLASS} ${className}`}
      />
    )
  }

  const fullDetail = detail > 0.5

  return (
    <div
      aria-hidden="true"
      className={[
        'pointer-events-none',
        'absolute',
        'inset-0',
        'overflow-hidden',
        className,
      ].join(' ')}
    >
      <Canvas
        frameloop={reducedMotion ? 'demand' : 'always'}
        dpr={
          fullDetail
            ? [1, 1.5]
            : 1
        }
        camera={{
          position: [0, 0, 5],
          fov: 55,
        }}
        gl={{
          antialias: false,
          alpha: false,
          stencil: false,
          powerPreference: 'low-power',
        }}
        onCreated={(state) => {
          state.gl.setClearColor(
            '#0D0B1A',
            1,
          )
        }}
      >
        <BlackHoleScene
          parallax={parallax}
          reducedMotion={reducedMotion}
          detail={detail}
        />
        {/*
          Thresholded bloom: only the HDR pixels (beamed disk side,
          photon ring) exceed luminance 1.0, so only they bleed light.
          The background stays crisp and dark. mipmapBlur keeps it cheap;
          half-resolution on both breakpoints trims the composer cost.
        */}
        <EffectComposer multisampling={0}>
          <Bloom
            mipmapBlur
            intensity={fullDetail ? 1.15 : 0.5}
            luminanceThreshold={fullDetail ? 1.0 : 1.15}
            luminanceSmoothing={0.25}
            resolutionScale={0.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
