@include "common/header.glsl"

///////////////////////////////////////////////////////////////////////////////
// configuration
///////////////////////////////////////////////////////////////////////////////
#define ENABLE_PLOD_FOR_ABUFFER 1

///////////////////////////////////////////////////////////////////////////////
// input
///////////////////////////////////////////////////////////////////////////////
in VertexData {
  vec2 pass_uv_coords;
  vec3 pass_normal;
  vec3 pass_world_position;
  vec3 pass_color;
} VertexIn;

@include "common/gua_fragment_shader_input.glsl"

///////////////////////////////////////////////////////////////////////////////
// output
///////////////////////////////////////////////////////////////////////////////
@include "common/gua_fragment_shader_output.glsl"

///////////////////////////////////////////////////////////////////////////////
// uniforms
///////////////////////////////////////////////////////////////////////////////
@include "common/gua_camera_uniforms.glsl"
@material_uniforms@

layout(binding=0) uniform sampler2D p01_linear_depth_texture;

///////////////////////////////////////////////////////////////////////////////
// functions
///////////////////////////////////////////////////////////////////////////////
@include "common/gua_global_variable_declaration.glsl"
@include "common/gua_abuffer_collect.glsl"

@material_method_declarations_frag@

///////////////////////////////////////////////////////////////////////////////
// main
///////////////////////////////////////////////////////////////////////////////
void main() 
{
  // early discard of fragments not on surfel
  vec2 uv_coords = VertexIn.pass_uv_coords;

  if( dot(uv_coords, uv_coords) > 1) {
    discard;
  }

  @material_input@
  @include "common/gua_global_variable_assignment.glsl"

  gua_color      = pow(VertexIn.pass_color, vec3(1.4));
  gua_normal     = VertexIn.pass_normal;
  gua_metalness  = 0.0;
  gua_roughness  = 0.0;
  gua_emissivity = 0.0; // pass through if unshaded

  gua_world_position = VertexIn.pass_world_position;

  // normal mode or high fidelity shadows
  if (gua_rendering_mode != 1) {
    @material_method_calls_frag@
  }

  // clipping against clipping planes is performed in submit_fragment
  submit_fragment(gl_FragCoord.z);
}

