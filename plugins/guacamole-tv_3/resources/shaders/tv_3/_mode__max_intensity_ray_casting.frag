vec3 raycast_max_intensity(out vec3 color) {
  vec3 ray_origin    = FragmentIn.pos_ms;

  vec3 ray_direction = normalize(FragmentIn.pos_ms - ms_eye_pos.xyz);



  vec3 ray_increment = ray_direction * step_size;

  vec3 current_pos = ray_origin;

  float max_intensity = 0.0;
  current_pos += ray_increment;

  float num_samples_taken = 0;

  while(is_inside_vol(current_pos) ) {

    float density = get_mode_independent_sample(current_pos);
    max_intensity = max(max_intensity, density);

    current_pos +=  ray_increment;
    ++num_samples_taken;
  }

  color = vec3(max_intensity, max_intensity, max_intensity);

  return current_pos;
};