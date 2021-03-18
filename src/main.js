let gl
let count = 0.0

function main() {
  initCanvas()
  addVertexAndFragmentSahders()
  createGeometry()

  // Add backgroundColor
  gl.clearColor(0, 0, 0, 1)
  // Expose gl for debugging
  window.gl = gl

  drawScene()
}

function initCanvas() {
  const canvas = document.querySelector("#gl")

  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight

  canvas.width = WIDTH
  canvas.height = HEIGHT

  gl = canvas.getContext("webgl")
  gl.viewport(0, 0, canvas.width, canvas.height)
}

function addVertexAndFragmentSahders() {
  /*
   *
   * VERTEX
   *
   * */
  const sourceVertex = `
    attribute vec3 position;
    uniform float u_Move;
  
    void main() {
      gl_Position = vec4(position.x + (sin(u_Move) * .3), position.y, position.z, 1);
    }
  `

  const shaderVertex = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(shaderVertex, sourceVertex)
  gl.compileShader(shaderVertex)

  if (!gl.getShaderParameter(shaderVertex, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shaderVertex))
    throw new Error("Failed to compile vertex shader")
  }

  /*
   *
   * SHADER
   *
   * */

  const sourceFragment = `
    precision mediump float;
  
    void main() {
      gl_FragColor = vec4(1, 0, 1, 1);
    }
  `

  const shaderFragment = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(shaderFragment, sourceFragment)
  gl.compileShader(shaderFragment)

  if (!gl.getShaderParameter(shaderFragment, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shaderFragment))
    throw new Error("Failed to compile fragment shader")
  }
  /*
   *
   * CREAT EPROGRAM
   *
   * */
  const program = gl.createProgram()
  gl.attachShader(program, shaderVertex)
  gl.attachShader(program, shaderFragment)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program))
    throw new Error("Failed to link program")
  }

  gl.useProgram(program)
  gl.program = program
}

function createGeometry() {
  const positionsData = new Float32Array([
    -0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    -0.5, // Triangle 1
    -0.5,
    0.5,
    0.5,
    -0.5,
    -0.5,
    -0.5, // Triangle 2
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, positionsData, gl.STATIC_DRAW)

  const attribute = gl.getAttribLocation(gl.program, "position")
  gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(attribute)
}

function drawScene() {
  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Set uniform value (u_Move) in vertex shader
  var mvMatrixUniform = gl.getUniformLocation(gl.program, "u_Move")
  gl.uniform1f(mvMatrixUniform, count)

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, 6)

  count += 0.01
  requestAnimationFrame(drawScene)
}

document.addEventListener("DOMContentLoaded", () => {
  main()
})
